"use client";

import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import type { FishingActivity, FishingReportTargetType } from "@/entities/fishing-report";
import type { UploadedSpotImage } from "@/entities/spot-image/api/upload-spot-image-file";
import { getFirebaseFirestore } from "@/shared/api/firebase";

export type FishingReportFormValues = {
  activity: FishingActivity;
  bait: string;
  baitEn: string;
  catchLengthCm: string;
  catchWeightKg: string;
  conditions: string;
  conditionsEn: string;
  fish: string;
  fishEn: string;
  impression: string;
  impressionEn: string;
  method: string;
  methodEn: string;
  rodSetup: string;
  rodSetupEn: string;
  rating: number;
  tripDate: string;
};

export function createFishingReportId() {
  return doc(collection(getFirebaseFirestore(), "fishing-reports")).id;
}

type CreateFishingReportParams = FishingReportFormValues & {
  authorId: string;
  authorName: string;
  isPublic: boolean;
  photo?: UploadedSpotImage | null;
  reportId: string;
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
  isPublic,
  activity,
  bait,
  baitEn,
  catchLengthCm,
  catchWeightKg,
  conditions,
  conditionsEn,
  fish,
  fishEn,
  impression,
  impressionEn,
  method,
  methodEn,
  rodSetup,
  rodSetupEn,
  rating,
  targetId,
  targetType,
  tripDate,
  photo,
  reportId,
}: CreateFishingReportParams) {
  const translatedFish = toFishList(fishEn);
  const englishTranslation = {
    ...(baitEn.trim() ? { bait: baitEn.trim() } : {}),
    ...(translatedFish.length > 0 ? { fish: translatedFish } : {}),
    ...(conditionsEn.trim() ? { conditions: conditionsEn.trim() } : {}),
    ...(impressionEn.trim() ? { impression: impressionEn.trim() } : {}),
    ...(methodEn.trim() ? { method: methodEn.trim() } : {}),
    ...(rodSetupEn.trim() ? { rodSetup: rodSetupEn.trim() } : {}),
  };

  const weight = Number(catchWeightKg);
  const length = Number(catchLengthCm);
  const report = doc(getFirebaseFirestore(), "fishing-reports", reportId);

  await setDoc(report, {
    authorId,
    authorName,
    activity,
    bait: bait.trim(),
    ...(Number.isFinite(weight) && weight > 0 ? { catchWeightKg: weight } : {}),
    ...(Number.isFinite(length) && length > 0 ? { catchLengthCm: length } : {}),
    conditions: conditions.trim(),
    createdAt: serverTimestamp(),
    fish: toFishList(fish),
    impression: impression.trim(),
    method: method.trim(),
    rodSetup: rodSetup.trim(),
    ...(photo ? { photo: { storagePath: photo.storagePath, url: photo.url } } : {}),
    isPublic,
    rating,
    targetId,
    targetType,
    translations: Object.keys(englishTranslation).length > 0 ? { en: englishTranslation } : {},
    tripDate,
  });
}
