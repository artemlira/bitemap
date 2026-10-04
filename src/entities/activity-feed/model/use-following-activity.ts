"use client";

import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { fishingSpots, getFishingSpotText } from "@/entities/fishing-spot";
import type { FishingReport } from "@/entities/fishing-report";
import type { SpotImage } from "@/entities/spot-image";
import { getUserSpotText, type UserSpot } from "@/entities/user-spot";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import { useAuth } from "@/shared/lib/auth";
import type { FeedActivity, FeedAuthor } from "./types";

type FollowDocument = { followedId: string };

function toMillis(value: unknown, fallback = 0) {
  if (value && typeof value === "object" && "toMillis" in value && typeof value.toMillis === "function") {
    return value.toMillis();
  }

  return fallback;
}

function getCatalogTarget(targetId: string, locale: string) {
  const spot = fishingSpots.find((item) => item.id === targetId);
  return spot ? { href: `/spots/${spot.slug}`, name: getFishingSpotText(spot, "name", locale) } : null;
}

export function useFollowingActivity() {
  const locale = useLocale();
  const { isLoading: isAuthLoading, user } = useAuth();
  const [feedState, setFeedState] = useState<{
    activities: readonly FeedActivity[];
    hasError: boolean;
    userId: string;
  } | null>(null);

  useEffect(() => {
    if (isAuthLoading || !user) return;

    let isActive = true;

    async function loadActivity() {
      try {
        const db = getFirebaseFirestore();
        const followSnapshot = await getDocs(query(
          collection(db, "angler-follows"),
          where("followerId", "==", user!.uid),
        ));
        const followedIds = [...new Set(followSnapshot.docs
          .map((item) => (item.data() as FollowDocument).followedId)
          .filter((id) => id && id !== user!.uid))];

        if (followedIds.length === 0) {
          if (isActive) setFeedState({ activities: [], hasError: false, userId: user!.uid });
          return;
        }

        const authorEntries = await Promise.all(followedIds.map(async (id): Promise<[string, FeedAuthor]> => {
          const profile = await getDoc(doc(db, "public-profiles", id));
          const data = profile.exists() ? profile.data() : {};
          return [id, {
            id,
            name: typeof data.displayName === "string" && data.displayName.trim() ? data.displayName : "BiteMap angler",
            photoURL: typeof data.photoURL === "string" ? data.photoURL : null,
          }];
        }));
        const authors = new Map(authorEntries);

        const perAuthor = await Promise.all(followedIds.map(async (authorId) => {
          const [reportSnapshot, spotSnapshot, catalogImageSnapshot] = await Promise.all([
            getDocs(query(collection(db, "fishing-reports"), where("authorId", "==", authorId), where("isPublic", "==", true))),
            getDocs(query(collection(db, "user-spots"), where("ownerId", "==", authorId), where("visibility", "==", "published"))),
            getDocs(query(collection(db, "spot-images"), where("ownerId", "==", authorId), where("targetType", "==", "catalog"))),
          ]);

          const reports = reportSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as FishingReport);
          const spots = spotSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as UserSpot);
          const catalogImages = catalogImageSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as SpotImage);
          const spotImageSnapshots = await Promise.all(spots.map((spot) => getDocs(query(
            collection(db, "spot-images"),
            where("targetType", "==", "user-spot"),
            where("targetId", "==", spot.id),
          ))));
          const spotImages = spotImageSnapshots.flatMap((snapshot) => snapshot.docs
            .map((item) => ({ id: item.id, ...item.data() }) as SpotImage));

          return { authorId, catalogImages, reports, spots, spotImages };
        }));

        const publishedSpots = new Map<string, UserSpot>();
        perAuthor.forEach(({ spots }) => spots.forEach((spot) => publishedSpots.set(spot.id, spot)));
        const nextActivities: FeedActivity[] = [];

        perAuthor.forEach(({ authorId, catalogImages, reports, spots, spotImages }) => {
          const author = authors.get(authorId);
          if (!author) return;

          reports.forEach((report) => {
            const target = report.targetType === "user-spot"
              ? publishedSpots.get(report.targetId)
              : null;
            const catalogTarget = report.targetType === "catalog" ? getCatalogTarget(report.targetId, locale) : null;
            const targetData = target
              ? { href: `/community/${target.id}`, name: getUserSpotText(target, "name", locale) }
              : catalogTarget;

            if (!targetData) return;
            nextActivities.push({
              author,
              createdAt: toMillis((report as FishingReport & { createdAt?: unknown }).createdAt, Date.parse(`${report.tripDate}T00:00:00Z`)),
              id: `report:${report.id}`,
              report,
              targetHref: targetData.href,
              targetName: targetData.name,
              type: "report",
            });
          });

          spots.forEach((spot) => nextActivities.push({
            author,
            createdAt: toMillis((spot as UserSpot & { createdAt?: unknown }).createdAt),
            id: `spot:${spot.id}`,
            spot,
            type: "spot",
          }));

          [...catalogImages, ...spotImages].forEach((image) => {
            const target = image.targetType === "user-spot" ? publishedSpots.get(image.targetId) : null;
            const catalogTarget = image.targetType === "catalog" ? getCatalogTarget(image.targetId, locale) : null;
            const targetData = target
              ? { href: `/community/${target.id}`, name: getUserSpotText(target, "name", locale) }
              : catalogTarget;

            if (!targetData) return;
            nextActivities.push({
              author,
              createdAt: toMillis((image as SpotImage & { createdAt?: unknown }).createdAt),
              id: `image:${image.id}`,
              image,
              targetHref: targetData.href,
              targetName: targetData.name,
              type: "image",
            });
          });
        });

        nextActivities.sort((first, second) => second.createdAt - first.createdAt);
        if (isActive) setFeedState({ activities: nextActivities.slice(0, 50), hasError: false, userId: user!.uid });
      } catch {
        if (isActive) setFeedState({ activities: [], hasError: true, userId: user!.uid });
      }
    }

    void loadActivity();
    return () => { isActive = false; };
  }, [isAuthLoading, locale, user]);

  return {
    activities: user && feedState?.userId === user.uid ? feedState.activities : [],
    hasError: Boolean(user && feedState?.userId === user.uid && feedState.hasError),
    isAuthLoading,
    isLoading: isAuthLoading || Boolean(user && feedState?.userId !== user.uid),
    user,
  };
}
