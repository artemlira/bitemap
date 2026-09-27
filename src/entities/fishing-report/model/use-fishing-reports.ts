"use client";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import type { FishingReport, FishingReportTargetType } from "./types";

export function useFishingReports(targetType: FishingReportTargetType, targetId: string) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<readonly FishingReport[]>([]);

  useEffect(() => {
    const reportsQuery = query(
      collection(getFirebaseFirestore(), "fishing-reports"),
      where("targetId", "==", targetId),
      where("targetType", "==", targetType),
      where("isPublic", "==", true),
    );

    return onSnapshot(
      reportsQuery,
      (snapshot) => {
        const nextReports = snapshot.docs
          .map((report) => ({ id: report.id, ...report.data() }) as FishingReport)
          .sort((firstReport, secondReport) => secondReport.tripDate.localeCompare(firstReport.tripDate));

        setReports(nextReports);
        setError(false);
        setIsLoading(false);
      },
      () => {
        setReports([]);
        setError(true);
        setIsLoading(false);
      },
    );
  }, [targetId, targetType]);

  return { error, isLoading, reports };
}

export function useCommunityFishingReports() {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<readonly FishingReport[]>([]);

  useEffect(() => {
    const reportsQuery = query(
      collection(getFirebaseFirestore(), "fishing-reports"),
      where("isPublic", "==", true),
    );

    return onSnapshot(
      reportsQuery,
      (snapshot) => {
        const nextReports = snapshot.docs
          .map((report) => ({ id: report.id, ...report.data() }) as FishingReport)
          .sort((firstReport, secondReport) => secondReport.tripDate.localeCompare(firstReport.tripDate))
          .slice(0, 6);

        setReports(nextReports);
        setError(false);
        setIsLoading(false);
      },
      () => {
        setReports([]);
        setError(true);
        setIsLoading(false);
      },
    );
  }, []);

  return { error, isLoading, reports };
}

export function usePublicFishingReportsByAuthor(authorId: string) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<readonly FishingReport[]>([]);

  useEffect(() => {
    const reportsQuery = query(
      collection(getFirebaseFirestore(), "fishing-reports"),
      where("authorId", "==", authorId),
      where("isPublic", "==", true),
    );

    return onSnapshot(
      reportsQuery,
      (snapshot) => {
        const nextReports = snapshot.docs
          .map((report) => ({ id: report.id, ...report.data() }) as FishingReport)
          .sort((firstReport, secondReport) => secondReport.tripDate.localeCompare(firstReport.tripDate));

        setReports(nextReports);
        setError(false);
        setIsLoading(false);
      },
      () => {
        setReports([]);
        setError(true);
        setIsLoading(false);
      },
    );
  }, [authorId]);

  return { error, isLoading, reports };
}
