"use client";

import { useEffect } from "react";
import { useAuth } from "@/shared/lib/auth";
import { ensurePublicUserProfile } from "../api/sync-user-profile";

export function PublicProfileSynchronizer() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      void ensurePublicUserProfile(user).catch(() => undefined);
    }
  }, [user]);

  return null;
}
