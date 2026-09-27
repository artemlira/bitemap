"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import type { PublicUserProfile } from "./types";

export function usePublicUserProfile(userId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);

  useEffect(() => {
    return onSnapshot(
      doc(getFirebaseFirestore(), "public-profiles", userId),
      (snapshot) => {
        setProfile(snapshot.exists() ? (snapshot.data() as PublicUserProfile) : null);
        setIsLoading(false);
      },
      () => {
        setProfile(null);
        setIsLoading(false);
      },
    );
  }, [userId]);

  return { isLoading, profile };
}
