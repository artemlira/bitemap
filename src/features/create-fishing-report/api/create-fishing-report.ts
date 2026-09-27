"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { FishingReportTargetType } from "@/entities/fishing-report";
import { getFirebaseFirestore } from "@/shared/api/firebase";

export type FishingReportFormValues = {
  fish: string;
  fishEn: string;
  impression: string;
  impressionEn: string;
  method: string;
  methodEn: string;
  rating: number;
  tripDate: string;
};

type CreateFishingReportParams = FishingReportFormValues & {
  authorId: string;
  authorName: string;
  targetId: string;
  targetType: FishingReportTargetType;
};

function toFishList(value: string) {
  return value
    .split(",")
    .map((fish) => fish.trim())
    .filter(Boolean);
}

export async function createFishingReport({
  authorId,
  authorName,
  fish,
  fishEn,
  impression,
  impressionEn,
  method,
  methodEn,
  rating,
  targetId,
  targetType,
  tripDate,
}: CreateFishingReportParams) {
  const translatedFish = toFishList(fishEn);
  const englishTranslation = {
    ...(translatedFish.length > 0 ? { fish: translatedFish } : {}),
    ...(impressionEn.trim() ? { impression: impressionEn.trim() } : {}),
    ...(methodEn.trim() ? { method: methodEn.trim() } : {}),
  };

  await addDoc(collection(getFirebaseFirestore(), "fishing-reports"), {
    authorId,
    authorName,
    createdAt: serverTimestamp(),
    fish: toFishList(fish),
    impression: impression.trim(),
    method: method.trim(),
    rating,
    targetId,
    targetType,
    translations: Object.keys(englishTranslation).length > 0 ? { en: englishTranslation } : {},
    tripDate,
  });
}
