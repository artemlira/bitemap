"use client";

import { useEffect, useState } from "react";
import { subscribeToOpenContentReports } from "@/features/content-report/api/content-reports";
import { useNewUserSpots } from "./new-user-spots";
import { readSpotsSeenAt, SEEN_EVENT } from "./seen";

/** Counts for the admin badge: open reports plus community spots added since the list was last opened. */
export function useModerationAlerts(enabled: boolean) {
  const [openReports, setOpenReports] = useState(0);
  const [seenAt, setSeenAt] = useState(0);
  const { spots } = useNewUserSpots(enabled && seenAt > 0, seenAt);

  useEffect(() => {
    if (!enabled) return;
    return subscribeToOpenContentReports((reports) => setOpenReports(reports.length), () => setOpenReports(0));
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const sync = () => setSeenAt(readSpotsSeenAt());
    sync();
    window.addEventListener(SEEN_EVENT, sync);
    return () => window.removeEventListener(SEEN_EVENT, sync);
  }, [enabled]);

  const newSpots = enabled && seenAt > 0 ? spots.length : 0;
  return { newSpots, openReports, total: enabled ? openReports + newSpots : 0 };
}
