"use client";

import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import type { FishingActivity } from "@/entities/fishing-report";
import { getFirebaseFirestore } from "@/shared/api/firebase";

export type FishingReportEditValues = {
  activity: FishingActivity;
  bait: string;
  baitEn: string;
  fish: string;
  fishEn: string;
  impression: string;
  impressionEn: string;
  method: string;
  methodEn: string;
  rating: number;
  tripDate: string;
};

function toFishList(value: string) {
  return value
    .split(",")
    .map((fish) => fish.trim())
    .filter(Boolean);
}

export async function updateFishingReport(reportId: string, values: FishingReportEditValues) {
  const translatedFish = toFishList(values.fishEn);
  const englishTranslation = {
    ...(values.baitEn.trim() ? { bait: values.baitEn.trim() } : {}),
    ...(translatedFish.length > 0 ? { fish: translatedFish } : {}),
    ...(values.impressionEn.trim() ? { impression: values.impressionEn.trim() } : {}),
    ...(values.methodEn.trim() ? { method: values.methodEn.trim() } : {}),
  };

  await updateDoc(doc(getFirebaseFirestore(), "fishing-reports", reportId), {
    activity: values.activity,
    bait: values.bait.trim(),
    fish: toFishList(values.fish),
    impression: values.impression.trim(),
    method: values.method.trim(),
    rating: values.rating,
    translations: Object.keys(englishTranslation).length > 0 ? { en: englishTranslation } : {},
    tripDate: values.tripDate,
  });
}

export function deleteFishingReport(reportId: string) {
  return deleteDoc(doc(getFirebaseFirestore(), "fishing-reports", reportId));
}
