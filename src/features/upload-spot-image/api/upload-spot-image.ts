"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { SpotImageTargetType } from "@/entities/spot-image";
import { getFirebaseFirestore, getFirebaseStorage } from "@/shared/api/firebase";

const maxImageSize = 5 * 1024 * 1024;

type UploadSpotImageParams = {
  captionEn: string;
  captionUk: string;
  file: File;
  ownerId: string;
  targetId: string;
  targetType: SpotImageTargetType;
};

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : "jpg";
}

export async function uploadSpotImage({
  captionEn,
  captionUk,
  file,
  ownerId,
  targetId,
  targetType,
}: UploadSpotImageParams) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Обери файл зображення.");
  }

  if (file.size > maxImageSize) {
    throw new Error("Розмір зображення не повинен перевищувати 5 МБ.");
  }

  const imageId = crypto.randomUUID();
  const storagePath = `spot-images/${targetType}/${targetId}/${ownerId}/${imageId}.${getFileExtension(file)}`;
  const storageReference = ref(getFirebaseStorage(), storagePath);

  await uploadBytes(storageReference, file, { contentType: file.type });

  const url = await getDownloadURL(storageReference);
  const caption = {
    uk: captionUk.trim() || "Фотографія водойми",
    ...(captionEn.trim() ? { en: captionEn.trim() } : {}),
  };

  await addDoc(collection(getFirebaseFirestore(), "spot-images"), {
    caption,
    createdAt: serverTimestamp(),
    ownerId,
    storagePath,
    targetId,
    targetType,
    url,
  });
}
