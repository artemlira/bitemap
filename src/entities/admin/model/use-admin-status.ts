"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import { useAuth } from "@/shared/lib/auth";

type AdminSnapshot = { userId: string | null; isAdmin: boolean };

export function useAdminStatus() {
  const { isLoading: isAuthLoading, user } = useAuth();
  const [snapshot, setSnapshot] = useState<AdminSnapshot>({ userId: null, isAdmin: false });
  const [errorState, setErrorState] = useState<{ userId: string | null; hasError: boolean } | null>(null);
  const userId = user?.uid;
  const isChecking = Boolean(userId && snapshot.userId !== userId);

  useEffect(() => {
    if (!userId) return;

    return onSnapshot(
      doc(getFirebaseFirestore(), "admins", userId),
      (adminDocument) => {
        setSnapshot({ userId, isAdmin: adminDocument.exists() });
        setErrorState({ userId, hasError: false });
      },
      () => {
        setSnapshot({ userId, isAdmin: false });
        setErrorState({ userId, hasError: true });
      },
    );
  }, [userId]);

  return {
    error: errorState?.userId === userId && errorState?.hasError === true,
    isAdmin: snapshot.userId === userId && snapshot.isAdmin,
    isLoading: isAuthLoading || isChecking,
    user,
  };
}
