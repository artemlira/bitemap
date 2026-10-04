"use client";

import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, Timestamp, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import type { FeedActivity } from "./types";
import { fishingSpots } from "@/entities/fishing-spot";
import type { FishingReport } from "@/entities/fishing-report";
import type { SpotImage } from "@/entities/spot-image";
import { getFirebaseFirestore } from "@/shared/api/firebase";

type NotificationKind = "followedReport" | "followedSpot" | "followedPhoto" | "newFollower" | "newComment" | "newReaction";
export type ActivityNotification = {
  actorName: string;
  createdAt: number;
  href: string;
  id: string;
  kind: NotificationKind;
  isUnread?: boolean;
};

type EventDraft = Omit<ActivityNotification, "actorName"> & { actorId: string; actorName?: string };
type TimestampLike = { toMillis?: () => number } | undefined;

function getMillis(value: TimestampLike) {
  return value && typeof value.toMillis === "function" ? value.toMillis() : 0;
}

function getTargetHref(targetType: "catalog" | "user-spot", targetId: string) {
  if (targetType === "user-spot") return `/community/${targetId}`;
  const spot = fishingSpots.find((item) => item.id === targetId);
  return spot ? `/spots/${spot.slug}` : "/spots";
}

function getActivityDrafts(activities: readonly FeedActivity[]): EventDraft[] {
  return activities.map((activity) => ({
    actorId: activity.author.id,
    createdAt: activity.createdAt,
    href: activity.type === "spot" ? `/community/${activity.spot.id}` : activity.targetHref,
    id: activity.id,
    kind: activity.type === "report" ? "followedReport" : activity.type === "spot" ? "followedSpot" : "followedPhoto",
    actorName: activity.author.name,
  }));
}

export function useActivityNotifications(userId: string | undefined, activities: readonly FeedActivity[], isFeedLoading: boolean) {
  const [events, setEvents] = useState<{ items: readonly ActivityNotification[]; lastRead: number; userId: string; hasError: boolean; syncError: boolean } | null>(null);

  useEffect(() => {
    if (!userId) return;
    const db = getFirebaseFirestore();
    return onSnapshot(doc(db, "users", userId), (snapshot) => {
      const lastRead = getMillis(snapshot.data()?.notificationReadAt);
      setEvents((current) => current?.userId === userId ? { ...current, lastRead, syncError: false } : current);
    });
  }, [userId]);

  useEffect(() => {
    if (!userId || isFeedLoading) return;
    const activeUserId = userId;
    let isActive = true;

    async function loadNotifications() {
      try {
        const db = getFirebaseFirestore();
        const [followSnapshot, reportSnapshot, imageSnapshot, readStateSnapshot] = await Promise.all([
          getDocs(query(collection(db, "angler-follows"), where("followedId", "==", activeUserId), limit(40))),
          getDocs(query(collection(db, "fishing-reports"), where("authorId", "==", activeUserId), limit(40))),
          getDocs(query(collection(db, "spot-images"), where("ownerId", "==", activeUserId), limit(40))),
          getDoc(doc(db, "users", activeUserId)),
        ]);
        const reports = reportSnapshot.docs
          .map((entry) => ({ id: entry.id, ...entry.data() }) as FishingReport & { createdAt?: TimestampLike })
          .filter((report) => report.isPublic === true)
          .sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt))
          .slice(0, 8);
        const images = imageSnapshot.docs
          .map((entry) => ({ id: entry.id, ...entry.data() }) as SpotImage & { createdAt?: TimestampLike })
          .sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt))
          .slice(0, 8);

        const drafts: EventDraft[] = [...getActivityDrafts(activities)];
        followSnapshot.docs.forEach((entry) => {
          const follow = entry.data();
          const followerId = typeof follow.followerId === "string" ? follow.followerId : "";
          if (followerId && followerId !== activeUserId) drafts.push({
            actorId: followerId,
            createdAt: getMillis(follow.createdAt),
            href: `/anglers/${followerId}`,
            id: `follower:${entry.id}`,
            kind: "newFollower",
          });
        });

        const interactionReads = await Promise.all([
          ...reports.flatMap((report) => {
            const href = getTargetHref(report.targetType, report.targetId);
            return [
              getDocs(query(collection(db, "fishing-reports", report.id, "comments"), orderBy("createdAt", "desc"), limit(8)))
                .then((snapshot) => snapshot.docs.forEach((entry) => {
                  const comment = entry.data();
                  if (comment.authorId && comment.authorId !== activeUserId) drafts.push({ actorId: comment.authorId, actorName: comment.authorName, createdAt: getMillis(comment.createdAt), href, id: `comment:${report.id}:${entry.id}`, kind: "newComment" });
                })).catch(() => undefined),
              getDocs(query(collection(db, "fishing-reports", report.id, "reactions"), orderBy("createdAt", "desc"), limit(8)))
                .then((snapshot) => snapshot.docs.forEach((entry) => {
                  const reaction = entry.data();
                  if (reaction.userId && reaction.userId !== activeUserId) drafts.push({ actorId: reaction.userId, createdAt: getMillis(reaction.createdAt), href, id: `report-reaction:${report.id}:${entry.id}`, kind: "newReaction" });
                })).catch(() => undefined),
            ];
          }),
          ...images.map((image) => getDocs(query(collection(db, "spot-images", image.id, "reactions"), orderBy("createdAt", "desc"), limit(8)))
            .then((snapshot) => snapshot.docs.forEach((entry) => {
              const reaction = entry.data();
              if (reaction.userId && reaction.userId !== activeUserId) drafts.push({ actorId: reaction.userId, createdAt: getMillis(reaction.createdAt), href: getTargetHref(image.targetType, image.targetId), id: `image-reaction:${image.id}:${entry.id}`, kind: "newReaction" });
            })).catch(() => undefined)),
        ]);
        await Promise.all(interactionReads);

        const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const recentDrafts = drafts.filter((event) => event.actorId !== activeUserId && event.createdAt >= since);
        const actorIds = [...new Set(recentDrafts.filter((event) => !event.actorName).map((event) => event.actorId))];
        const names = new Map<string, string>();
        await Promise.all(actorIds.map(async (actorId) => {
          try {
            const profile = await getDoc(doc(db, "public-profiles", actorId));
            const name = profile.data()?.displayName;
            if (typeof name === "string" && name.trim()) names.set(actorId, name.trim());
          } catch {
            // A missing public profile should not prevent the remaining notifications from loading.
          }
        }));

        const items = recentDrafts
          .map(({ actorId, ...event }) => ({ ...event, actorName: event.actorName || names.get(actorId) || "BiteMap" }))
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 60);
        if (isActive) {
          const lastRead = getMillis(readStateSnapshot.data()?.notificationReadAt);
          setEvents({ items, lastRead, userId: activeUserId, hasError: false, syncError: false });
        }
      } catch {
        if (isActive) {
          setEvents({ items: [], lastRead: 0, userId: activeUserId, hasError: true, syncError: false });
        }
      }
    }

    void loadNotifications();
    return () => { isActive = false; };
  }, [activities, isFeedLoading, userId]);

  const markAllRead = useCallback(() => {
    if (!userId) return;
    const newest = events?.userId === userId ? events.items[0]?.createdAt ?? 0 : 0;
    const timestamp = Math.max(Date.now(), newest);
    setEvents((current) => current?.userId === userId ? { ...current, lastRead: timestamp } : current);
    void setDoc(doc(getFirebaseFirestore(), "users", userId), { notificationReadAt: Timestamp.fromMillis(timestamp) }, { merge: true })
      .catch(() => setEvents((current) => current?.userId === userId ? { ...current, syncError: true } : current));
  }, [events, userId]);

  const currentEvents = userId && events?.userId === userId ? events : null;
  const notifications = currentEvents
    ? currentEvents.items.map((item) => ({ ...item, isUnread: item.createdAt > currentEvents.lastRead }))
    : [];
  return {
    hasError: currentEvents?.hasError ?? false,
    hasSyncError: currentEvents?.syncError ?? false,
    isLoading: Boolean(userId) && (isFeedLoading || events?.userId !== userId),
    markAllRead,
    notifications,
    unreadCount: notifications.filter((item) => item.isUnread).length,
  };
}
