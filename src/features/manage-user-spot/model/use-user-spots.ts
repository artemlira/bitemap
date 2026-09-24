"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import type { UserSpot } from "@/entities/user-spot";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import { useAuth } from "@/shared/lib/auth";

function toUserSpot(id: string, data: Omit<UserSpot, "id" | "visibility"> & Partial<Pick<UserSpot, "visibility">>): UserSpot {
  return {
    ...data,
    id,
    visibility: data.visibility === "published" ? "published" : "private",
  };
}

type UserSpotsSnapshot = {
  ownerId: string | null;
  spots: readonly UserSpot[];
};

const initialSnapshot: UserSpotsSnapshot = {
  ownerId: null,
  spots: [],
};

export function useUserSpots() {
  const { isLoading: isAuthLoading, user } = useAuth();
  const [snapshot, setSnapshot] = useState<UserSpotsSnapshot>(initialSnapshot);
  const [error, setError] = useState("");
  const userId = user?.uid;
  const isLoading = Boolean(userId && snapshot.ownerId !== userId);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const userSpotsQuery = query(
      collection(getFirebaseFirestore(), "user-spots"),
      where("ownerId", "==", userId),
    );

    return onSnapshot(
      userSpotsQuery,
      (userSpotsSnapshot) => {
        setSnapshot({
          ownerId: userId,
          spots: userSpotsSnapshot.docs.map((spot) => toUserSpot(spot.id, spot.data() as Omit<UserSpot, "id">)),
        });
        setError("");
      },
      () => {
        setSnapshot({ ownerId: userId, spots: [] });
        setError("Не вдалося завантажити твої водойми.");
      },
    );
  }, [userId]);

  return {
    error,
    isAuthLoading,
    isLoading,
    spots: snapshot.ownerId === userId ? snapshot.spots : [],
    user,
  };
}

export function useUserSpot(spotId: string) {
  const { isLoading: isAuthLoading, user } = useAuth();
  const [snapshot, setSnapshot] = useState<{ ownerId: string | null; spot: UserSpot | null }>({
    ownerId: null,
    spot: null,
  });
  const [error, setError] = useState("");
  const userId = user?.uid;
  const isLoading = Boolean(userId && snapshot.ownerId !== userId);

  useEffect(() => {
    if (!userId) {
      return;
    }

    return onSnapshot(
      doc(getFirebaseFirestore(), "user-spots", spotId),
      (userSpotSnapshot) => {
        setSnapshot({
          ownerId: userId,
          spot: userSpotSnapshot.exists()
            ? toUserSpot(userSpotSnapshot.id, userSpotSnapshot.data() as Omit<UserSpot, "id">)
            : null,
        });
        setError("");
      },
      () => {
        setSnapshot({ ownerId: userId, spot: null });
        setError("Не вдалося відкрити цю водойму.");
      },
    );
  }, [spotId, userId]);

  return {
    error,
    isAuthLoading,
    isLoading,
    spot: snapshot.ownerId === userId ? snapshot.spot : null,
    user,
  };
}
