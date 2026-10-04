"use client";

import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import { useAuth } from "@/shared/lib/auth";

function getFollowId(followerId: string, followedId: string) {
  return `${followerId}__${followedId}`;
}

type FollowersState = {
  anglerId: string;
  count: number;
};

type FollowState = {
  followId: string;
  isFollowing: boolean;
};

export function useAnglerFollow(anglerId: string) {
  const { isLoading: isAuthLoading, user } = useAuth();
  const [followersState, setFollowersState] = useState<FollowersState | null>(null);
  const [followState, setFollowState] = useState<FollowState | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [errorForAnglerId, setErrorForAnglerId] = useState<string | null>(null);
  const followerId = user?.uid;
  const isSelf = followerId === anglerId;
  const followId = followerId ? getFollowId(followerId, anglerId) : null;
  const isLoading = followersState?.anglerId !== anglerId;
  const isFollowingLoading = Boolean(followId && !isSelf && followState?.followId !== followId);
  const followerCount = followersState?.anglerId === anglerId ? followersState.count : 0;
  const isFollowing = Boolean(followId && followState?.followId === followId && followState.isFollowing);
  const hasError = errorForAnglerId === anglerId;

  useEffect(() => {
    const followersQuery = query(
      collection(getFirebaseFirestore(), "angler-follows"),
      where("followedId", "==", anglerId),
    );

    const unsubscribeFollowers = onSnapshot(
      followersQuery,
      (snapshot) => {
        setFollowersState({ anglerId, count: snapshot.size });
      },
      () => {
        setFollowersState({ anglerId, count: 0 });
        setErrorForAnglerId(anglerId);
      },
    );

    if (!followerId || isSelf) {
      return unsubscribeFollowers;
    }

    const followReference = doc(getFirebaseFirestore(), "angler-follows", getFollowId(followerId, anglerId));
    const unsubscribeFollow = onSnapshot(
      followReference,
      (snapshot) => setFollowState({ followId: followReference.id, isFollowing: snapshot.exists() }),
      () => {
        setFollowState({ followId: followReference.id, isFollowing: false });
        setErrorForAnglerId(anglerId);
      },
    );

    return () => {
      unsubscribeFollowers();
      unsubscribeFollow();
    };
  }, [anglerId, followerId, isSelf]);

  const toggleFollow = useCallback(async () => {
    if (!followerId || isSelf || isPending) return;

    setIsPending(true);
    setErrorForAnglerId(null);

    try {
      const followReference = doc(getFirebaseFirestore(), "angler-follows", getFollowId(followerId, anglerId));

      if (isFollowing) {
        await deleteDoc(followReference);
      } else {
        await setDoc(followReference, {
          followerId,
          followedId: anglerId,
          createdAt: serverTimestamp(),
        });
      }
    } catch {
      setErrorForAnglerId(anglerId);
    } finally {
      setIsPending(false);
    }
  }, [anglerId, followerId, isFollowing, isPending, isSelf]);

  return {
    followerCount,
    hasError,
    isAuthLoading,
    isFollowing,
    isFollowingLoading,
    isLoading,
    isPending,
    isSelf,
    toggleFollow,
    user,
  };
}
