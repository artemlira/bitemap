"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { uploadSpotImageFile, type SpotImageTargetType } from "@/entities/spot-image";
import { getFirebaseFirestore } from "@/shared/api/firebase";

type UploadSpotImageParams = {
  captionEn: string;
  captionUk: string;
  file: File;
  idToken: string;
  ownerId: string;
  targetId: string;
  targetType: SpotImageTargetType;
};


export async function uploadSpotImage({
  captionEn,
  captionUk,
  file,
  idToken,
  ownerId,
  targetId,
  targetType,
}: UploadSpotImageParams) {
  const uploadedImage = await uploadSpotImageFile({ file, idToken, targetId, targetType });

  const caption = {
    uk: captionUk.trim() || "Фотографія водойми",
    ...(captionEn.trim() ? { en: captionEn.trim() } : {}),
  };

  await addDoc(collection(getFirebaseFirestore(), "spot-images"), {
    caption,
    createdAt: serverTimestamp(),
    ownerId,
    storagePath: uploadedImage.storagePath,
    targetId,
    targetType,
    url: uploadedImage.url,
  });
}
