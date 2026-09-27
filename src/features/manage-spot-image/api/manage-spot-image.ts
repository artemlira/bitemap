"use client";

import { uploadSpotImageFile, type SpotImage, type SpotImageTargetType } from "@/entities/spot-image";

type ReplaceSpotImageParams = {
  file: File;
  idToken: string;
  image: SpotImage;
  targetId: string;
  targetType: SpotImageTargetType;
};

async function requestMutation(imageId: string, idToken: string, method: "DELETE" | "PATCH", body?: Record<string, string>) {
  const response = await fetch(`/api/media/${imageId}`, {
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Authorization: `Bearer ${idToken}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    method,
  });

  if (!response.ok) {
    throw new Error("spot-image-mutation-failed");
  }
}

export async function deleteSpotImage(imageId: string, idToken: string) {
  await requestMutation(imageId, idToken, "DELETE");
}

export async function replaceSpotImage({ file, idToken, image, targetId, targetType }: ReplaceSpotImageParams) {
  const uploadedImage = await uploadSpotImageFile({ file, idToken, targetId, targetType });

  await requestMutation(image.id, idToken, "PATCH", uploadedImage);
}
