"use client";

import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import type { FishingActivity } from "@/entities/fishing-report";
import type { UploadedSpotImage } from "@/entities/spot-image/api/upload-spot-image-file";
import { getFirebaseFirestore } from "@/shared/api/firebase";

export type FishingReportEditValues = {
  activity: FishingActivity;
  bait: string;
  baitEn: string;
  catchLengthCm: string;
  catchWeightKg: string;
  waterTemperatureC: string;
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

function toFishList(value: string) {
  return value
    .split(",")
    .map((fish) => fish.trim())
    .filter(Boolean);
}

export async function updateFishingReport(reportId: string, values: FishingReportEditValues, photo?: UploadedSpotImage | null) {
  const translatedFish = toFishList(values.fishEn);
  const englishTranslation = {
    ...(values.baitEn.trim() ? { bait: values.baitEn.trim() } : {}),
    ...(translatedFish.length > 0 ? { fish: translatedFish } : {}),
    ...(values.conditionsEn.trim() ? { conditions: values.conditionsEn.trim() } : {}),
    ...(values.impressionEn.trim() ? { impression: values.impressionEn.trim() } : {}),
    ...(values.methodEn.trim() ? { method: values.methodEn.trim() } : {}),
    ...(values.rodSetupEn.trim() ? { rodSetup: values.rodSetupEn.trim() } : {}),
  };
  const weight = Number(values.catchWeightKg);
  const length = Number(values.catchLengthCm);
  const waterTemperature = Number(values.waterTemperatureC);
  if (values.waterTemperatureC.trim() && (!Number.isFinite(waterTemperature) || waterTemperature < -2 || waterTemperature > 40)) {
    throw new Error("invalid-water-temperature");
  }

  await updateDoc(doc(getFirebaseFirestore(), "fishing-reports", reportId), {
    activity: values.activity,
    bait: values.bait.trim(),
    catchWeightKg: Number.isFinite(weight) && weight > 0 ? weight : null,
    catchLengthCm: Number.isFinite(length) && length > 0 ? length : null,
    waterTemperatureC: values.waterTemperatureC.trim() && Number.isFinite(waterTemperature) && waterTemperature >= -2 && waterTemperature <= 40 ? waterTemperature : null,
    conditions: values.conditions.trim(),
    fish: toFishList(values.fish),
    impression: values.impression.trim(),
    method: values.method.trim(),
    rodSetup: values.rodSetup.trim(),
    ...(photo !== undefined ? { photo: photo ? { storagePath: photo.storagePath, url: photo.url } : null } : {}),
    rating: values.rating,
    translations: Object.keys(englishTranslation).length > 0 ? { en: englishTranslation } : {},
    tripDate: values.tripDate,
  });
}

export function deleteFishingReport(reportId: string) {
  return deleteDoc(doc(getFirebaseFirestore(), "fishing-reports", reportId));
}
