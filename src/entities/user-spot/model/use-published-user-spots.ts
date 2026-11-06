"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import type { UserSpot } from "./types";
import { normalizeUserSpot } from "./normalize";
import { getFirebaseFirestore } from "@/shared/api/firebase";

export function usePublishedUserSpots() {
  const [spots, setSpots] = useState<readonly UserSpot[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const publishedSpotsQuery = query(
      collection(getFirebaseFirestore(), "user-spots"),
      where("visibility", "==", "published"),
    );

    return onSnapshot(
      publishedSpotsQuery,
      (snapshot) => {
        setSpots(snapshot.docs.map((spot) => normalizeUserSpot(spot.id, spot.data() as Omit<UserSpot, "id">)));
        setError("");
        setIsLoading(false);
      },
      () => {
        setSpots([]);
        setError("Не вдалося завантажити водойми спільноти.");
        setIsLoading(false);
      },
    );
  }, []);

  return { error, isLoading, spots };
}

export function usePublishedUserSpotsByOwner(ownerId: string) {
  const [spots, setSpots] = useState<readonly UserSpot[]>([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const publishedSpotsQuery = query(
      collection(getFirebaseFirestore(), "user-spots"),
      where("ownerId", "==", ownerId),
      where("visibility", "==", "published"),
    );

    return onSnapshot(
      publishedSpotsQuery,
      (snapshot) => {
        setSpots(snapshot.docs.map((spot) => normalizeUserSpot(spot.id, spot.data() as Omit<UserSpot, "id">)));
        setError(false);
        setIsLoading(false);
      },
      () => {
        setSpots([]);
        setError(true);
        setIsLoading(false);
      },
    );
  }, [ownerId]);

  return { error, isLoading, spots };
}

export function usePublishedUserSpot(spotId: string) {
  const [spot, setSpot] = useState<UserSpot | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return onSnapshot(
      doc(getFirebaseFirestore(), "user-spots", spotId),
      (snapshot) => {
        setSpot(snapshot.exists() ? normalizeUserSpot(snapshot.id, snapshot.data() as Omit<UserSpot, "id">) : null);
        setError("");
        setIsLoading(false);
      },
      () => {
        setSpot(null);
        setError("Ця водойма недоступна або більше не опублікована.");
        setIsLoading(false);
      },
    );
  }, [spotId]);

  return { error, isLoading, spot };
}
