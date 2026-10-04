"use client";

const maxImageSize = 5 * 1024 * 1024;

type UploadSignature = { apiKey: string; cloudName: string; folder: string; signature: string; timestamp: number };
type CloudinaryResponse = { public_id?: string; secure_url?: string };

export async function uploadArticleImage(file: File, slug: string, idToken: string) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > maxImageSize) throw new Error("The image must be 5 MB or smaller.");

  const signatureResponse = await fetch("/api/media/signature", {
    body: JSON.stringify({ targetId: slug, targetType: "article" }),
    headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
    method: "POST",
  });
  const signatureData: unknown = await signatureResponse.json();

  if (!signatureResponse.ok || !isUploadSignature(signatureData)) {
    throw new Error(readError(signatureData, "Could not prepare image upload."));
  }

  const formData = new FormData();
  formData.append("api_key", signatureData.apiKey);
  formData.append("file", file);
  formData.append("folder", signatureData.folder);
  formData.append("signature", signatureData.signature);
  formData.append("timestamp", String(signatureData.timestamp));

  const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`, {
    body: formData,
    method: "POST",
  });
  const uploadData: unknown = await uploadResponse.json();

  if (!uploadResponse.ok || !isCloudinaryResponse(uploadData)) {
    throw new Error(readError(uploadData, "Could not upload the image. Try another JPG, PNG or WebP file."));
  }

  return { storagePath: uploadData.public_id, url: uploadData.secure_url };
}

function isUploadSignature(value: unknown): value is UploadSignature {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return ["apiKey", "cloudName", "folder", "signature"].every((key) => typeof data[key] === "string")
    && typeof data.timestamp === "number";
}

function isCloudinaryResponse(value: unknown): value is Required<CloudinaryResponse> {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return typeof data.public_id === "string" && typeof data.secure_url === "string";
}

function readError(value: unknown, fallback: string) {
  if (value && typeof value === "object" && "error" in value) {
    const error = (value as { error?: unknown }).error;
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return fallback;
}
