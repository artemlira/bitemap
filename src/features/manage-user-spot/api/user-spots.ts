"use client";

import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import type { UserSpotFormValues } from "@/entities/user-spot";
import { getFirebaseFirestore } from "@/shared/api/firebase";

function toSpotPayload(values: UserSpotFormValues) {
  const englishTranslation = {
    ...(values.accessEn.trim() ? { access: values.accessEn.trim() } : {}),
    ...(values.descriptionEn.trim() ? { description: values.descriptionEn.trim() } : {}),
    ...(values.fishEn
      .split(",")
      .map((fish) => fish.trim())
      .filter(Boolean).length > 0
      ? {
          fish: values.fishEn
            .split(",")
            .map((fish) => fish.trim())
            .filter(Boolean),
        }
      : {}),
    ...(values.nameEn.trim() ? { name: values.nameEn.trim() } : {}),
    ...(values.waterTypeEn.trim() ? { waterType: values.waterTypeEn.trim() } : {}),
  };

  return {
    access: values.access,
    description: values.description.trim(),
    fish: values.fish
      .split(",")
      .map((fish) => fish.trim())
      .filter(Boolean),
    name: values.name.trim(),
    region: values.region.trim(),
    regionId: values.regionId,
    community: values.community.trim(),
    communityId: values.communityId,
    settlement: values.settlement.trim(),
    settlementId: values.settlementId,
    tone: values.tone,
    visibility: values.visibility,
    waterType: values.waterType.trim(),
    translations: Object.keys(englishTranslation).length > 0 ? { en: englishTranslation } : {},
  };
}

export async function createUserSpot(userId: string, values: UserSpotFormValues) {
  return addDoc(collection(getFirebaseFirestore(), "user-spots"), {
    ...toSpotPayload(values),
    createdAt: serverTimestamp(),
    ownerId: userId,
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserSpot(spotId: string, values: UserSpotFormValues) {
  return updateDoc(doc(getFirebaseFirestore(), "user-spots", spotId), {
    ...toSpotPayload(values),
    updatedAt: serverTimestamp(),
  });
}
