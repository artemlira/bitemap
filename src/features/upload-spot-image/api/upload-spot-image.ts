"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { SpotImageTargetType } from "@/entities/spot-image";
import { getFirebaseFirestore } from "@/shared/api/firebase";

const maxImageSize = 5 * 1024 * 1024;

type UploadSpotImageParams = {
  captionEn: string;
  captionUk: string;
  file: File;
  idToken: string;
  ownerId: string;
  targetId: string;
  targetType: SpotImageTargetType;
};

type UploadSignature = {
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: number;
};

type CloudinaryUploadResponse = {
  public_id?: unknown;
  secure_url?: unknown;
};

async function requestUploadSignature(idToken: string, targetType: SpotImageTargetType, targetId: string) {
  const response = await fetch("/api/media/signature", {
    body: JSON.stringify({ targetId, targetType }),
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const data: unknown = await response.json();

  if (!response.ok || !isUploadSignature(data)) {
    throw new Error(getResponseError(data, "Не вдалося підготувати завантаження."));
  }

  return data;
}

function isUploadSignature(value: unknown): value is UploadSignature {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;

  return ["apiKey", "cloudName", "folder", "signature"].every((key) => typeof data[key] === "string")
    && typeof data.timestamp === "number";
}

function isCloudinaryUploadResponse(value: unknown): value is Required<CloudinaryUploadResponse> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as CloudinaryUploadResponse;
  return typeof data.public_id === "string" && typeof data.secure_url === "string";
}

function getResponseError(value: unknown, fallback: string) {
  if (!value || typeof value !== "object" || !("error" in value)) {
    return fallback;
  }

  const error = (value as { error?: unknown }).error;

  if (typeof error === "string") {
    return error;
  }

  if (!error || typeof error !== "object" || !("message" in error)) {
    return fallback;
  }

  const message = (error as { message?: unknown }).message;

  if (typeof message !== "string") {
    return fallback;
  }

  if (/api key|signature|cloud name/i.test(message)) {
    return "Cloudinary відхилив налаштування. Перевір Cloud name, API Key і API Secret, потім перезапусти сервер.";
  }

  if (/missing permissions|forbidden/i.test(message)) {
    return "Cloudinary API Key не має дозволу створювати файли. Створи або обери ключ із роллю Master Admin у Settings → API Keys, онови .env.local і перезапусти сервер.";
  }

  return "Cloudinary не прийняв цей файл. Спробуй інше зображення JPG, PNG або WebP до 5 МБ.";
}

export async function uploadSpotImage({
  captionEn,
  captionUk,
  file,
  idToken,
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

  const uploadSignature = await requestUploadSignature(idToken, targetType, targetId);
  const formData = new FormData();
  formData.append("api_key", uploadSignature.apiKey);
  formData.append("file", file);
  formData.append("folder", uploadSignature.folder);
  formData.append("signature", uploadSignature.signature);
  formData.append("timestamp", String(uploadSignature.timestamp));

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${uploadSignature.cloudName}/image/upload`,
    { body: formData, method: "POST" },
  );
  const uploadData: unknown = await uploadResponse.json();

  if (!uploadResponse.ok || !isCloudinaryUploadResponse(uploadData)) {
    throw new Error(getResponseError(uploadData, "Не вдалося завантажити зображення."));
  }

  const caption = {
    uk: captionUk.trim() || "Фотографія водойми",
    ...(captionEn.trim() ? { en: captionEn.trim() } : {}),
  };

  await addDoc(collection(getFirebaseFirestore(), "spot-images"), {
    caption,
    createdAt: serverTimestamp(),
    ownerId,
    storagePath: uploadData.public_id,
    targetId,
    targetType,
    url: uploadData.secure_url,
  });
}
