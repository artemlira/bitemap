"use client";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import type { ReportComment } from "./types";

type CommentsState = {
  comments: readonly ReportComment[];
  hasError: boolean;
  reportId: string;
};

export function useReportComments(reportId: string, enabled: boolean) {
  const [state, setState] = useState<CommentsState | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const commentsQuery = query(
      collection(getFirebaseFirestore(), "fishing-reports", reportId, "comments"),
      orderBy("createdAt", "asc"),
    );

    return onSnapshot(
      commentsQuery,
      (snapshot) => setState({
        comments: snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as ReportComment),
        hasError: false,
        reportId,
      }),
      () => setState({ comments: [], hasError: true, reportId }),
    );
  }, [enabled, reportId]);

  const currentState = state?.reportId === reportId ? state : null;

  return {
    comments: currentState?.comments ?? [],
    hasError: currentState?.hasError ?? false,
    isLoading: enabled && !currentState,
  };
}
