"use client";

import { useCallback, useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import { useAuth } from "@/shared/lib/auth";

export type FishCount = { name: string; count: number };

type State = { counts: FishCount[]; mine: string[]; status: "loading" | "ready" | "error" };

/** Aggregated "what bites here" reports from anglers for one water. */
export function useFishVotes(spotId: string) {
  const { user } = useAuth();
  const userId = user?.uid;
  const [state, setState] = useState<State>({ counts: [], mine: [], status: "loading" });

  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadVotes() {
      try {
        const snapshot = await getDocs(query(collection(getFirebaseFirestore(), "spot-fish-votes"), where("spotId", "==", spotId)));
        const totals = new Map<string, number>();
        let mine: string[] = [];

        for (const entry of snapshot.docs) {
          const data = entry.data();
          const fish = Array.isArray(data.fish) ? (data.fish as string[]) : [];
          for (const name of fish) totals.set(name, (totals.get(name) ?? 0) + 1);
          if (data.userId === userId) mine = fish;
        }

        const counts = [...totals].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "uk"));
        if (isActive) setState({ counts, mine, status: "ready" });
      } catch {
        if (isActive) setState((current) => ({ ...current, status: "error" }));
      }
    }

    void loadVotes();
    return () => {
      isActive = false;
    };
  }, [spotId, userId, reloadToken]);

  const save = useCallback(
    async (fish: string[]) => {
      if (!userId) return;
      const reference = doc(getFirebaseFirestore(), "spot-fish-votes", `${spotId}__${userId}`);
      if (fish.length === 0) await deleteDoc(reference);
      else await setDoc(reference, { spotId, userId, fish, updatedAt: serverTimestamp() });
      setReloadToken((token) => token + 1);
    },
    [spotId, userId],
  );

  return { ...state, isSignedIn: Boolean(userId), save };
}
