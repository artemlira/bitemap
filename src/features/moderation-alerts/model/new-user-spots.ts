"use client";

import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import { getFirebaseFirestore } from "@/shared/api/firebase";

export type NewUserSpot = {
  createdAt?: Date;
  id: string;
  name: string;
  ownerId: string;
  region: string;
  waterType: string;
};

const MAX_SPOTS = 50;

/**
 * Latest published community spots, newest first (needs the visibility + createdAt index).
 * With `sinceMs` only spots created after that moment are read, which keeps the header badge cheap.
 */
export function useNewUserSpots(enabled: boolean, sinceMs?: number) {
  const [spots, setSpots] = useState<readonly NewUserSpot[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    const spotsQuery = query(
      collection(getFirebaseFirestore(), "user-spots"),
      where("visibility", "==", "published"),
      ...(sinceMs ? [where("createdAt", ">", Timestamp.fromMillis(sinceMs))] : []),
      orderBy("createdAt", "desc"),
      limit(MAX_SPOTS),
    );

    return onSnapshot(
      spotsQuery,
      (snapshot) => {
        const next = snapshot.docs.map((entry) => {
          const data = entry.data() as { createdAt?: Timestamp; name?: string; ownerId?: string; region?: string; waterType?: string };
          return {
            createdAt: data.createdAt?.toDate(),
            id: entry.id,
            name: data.name ?? "",
            ownerId: data.ownerId ?? "",
            region: data.region ?? "",
            waterType: data.waterType ?? "",
          };
        });
        setSpots(next);
        setHasError(false);
        setIsLoading(false);
      },
      () => {
        setHasError(true);
        setIsLoading(false);
      },
    );
  }, [enabled, sinceMs]);

  return { hasError, isLoading, spots };
}
