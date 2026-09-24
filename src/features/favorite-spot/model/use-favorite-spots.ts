"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import { useAuth } from "@/shared/lib/auth";

type FavoritesSnapshot = {
  ownerId: string | null;
  spotIds: readonly string[];
};

const initialSnapshot: FavoritesSnapshot = {
  ownerId: null,
  spotIds: [],
};

export function useFavoriteSpots() {
  const { isLoading: isAuthLoading, user } = useAuth();
  const [snapshot, setSnapshot] = useState<FavoritesSnapshot>(initialSnapshot);
  const [error, setError] = useState("");
  const userId = user?.uid;
  const isLoading = Boolean(userId && snapshot.ownerId !== userId);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const favoritesReference = collection(getFirebaseFirestore(), "users", userId, "favorites");

    return onSnapshot(
      favoritesReference,
      (favoriteSnapshot) => {
        setSnapshot({
          ownerId: userId,
          spotIds: favoriteSnapshot.docs.map((favorite) => favorite.id),
        });
        setError("");
      },
      () => {
        setSnapshot({ ownerId: userId, spotIds: [] });
        setError("Не вдалося завантажити збережені водойми.");
      },
    );
  }, [userId]);

  const spotIds = useMemo(() => {
    if (snapshot.ownerId !== userId) {
      return new Set<string>();
    }

    return new Set(snapshot.spotIds);
  }, [snapshot, userId]);

  return {
    error,
    isAuthLoading,
    isLoading,
    spotIds,
    user,
  };
}
