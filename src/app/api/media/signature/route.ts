import "server-only";
import { v2 as cloudinary } from "cloudinary";
import type { SpotImageTargetType } from "@/entities/spot-image";

export const runtime = "nodejs";

type MediaTargetType = SpotImageTargetType | "article" | "fishing-report";
const validTargetTypes: MediaTargetType[] = ["catalog", "user-spot", "article", "fishing-report"];
const validTargetId = /^[a-zA-Z0-9_-]{1,128}$/;

type FirebaseLookupResponse = {
  users?: Array<{
    localId?: string;
  }>;
};

type FirestoreDocument = {
  fields?: {
    ownerId?: { stringValue?: string };
    visibility?: { stringValue?: string };
  };
};

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization");
  return header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
}

function isMediaUploadTargetType(value: unknown): value is MediaTargetType {
  return typeof value === "string" && validTargetTypes.includes(value as MediaTargetType);
}

function isValidTargetId(value: unknown): value is string {
  return typeof value === "string" && validTargetId.test(value);
}

async function getFirebaseUserId(idToken: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    body: JSON.stringify({ idToken }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as FirebaseLookupResponse;
  return data.users?.[0]?.localId ?? null;
}

async function canContributeToUserSpot(idToken: string, userId: string, targetId: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!projectId) {
    return false;
  }

  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/user-spots/${targetId}`,
    { headers: { Authorization: `Bearer ${idToken}` } },
  );

  if (!response.ok) {
    return false;
  }

  const document = (await response.json()) as FirestoreDocument;
  const fields = document.fields;

  return fields?.ownerId?.stringValue === userId || fields?.visibility?.stringValue === "published";
}

async function isArticleEditor(idToken: string, userId: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!projectId) return false;

  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admins/${userId}`,
    { headers: { Authorization: `Bearer ${idToken}` } },
  );

  return response.ok;
}

export async function POST(request: Request) {
  const idToken = getBearerToken(request);

  if (!idToken) {
    return Response.json({ error: "Потрібна авторизація." }, { status: 401 });
  }

  let payload: { targetId?: unknown; targetType?: unknown };

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Некоректні дані запиту." }, { status: 400 });
  }

  const isArticleUpload = payload.targetType === "article";
  const isFishingReportUpload = payload.targetType === "fishing-report";
  if (!isMediaUploadTargetType(payload.targetType) || !isValidTargetId(payload.targetId)) {
    return Response.json({ error: "Некоректна ціль фотографії." }, { status: 400 });
  }

  const userId = await getFirebaseUserId(idToken);

  if (!userId) {
    return Response.json({ error: "Сесія входу завершилася. Увійди ще раз." }, { status: 401 });
  }

  if (payload.targetType === "user-spot" && !(await canContributeToUserSpot(idToken, userId, payload.targetId))) {
    return Response.json({ error: "Немає доступу до цієї водойми." }, { status: 403 });
  }

  if (isArticleUpload && !(await isArticleEditor(idToken, userId))) {
    return Response.json({ error: "Завантажувати зображення до статей можуть лише редактори." }, { status: 403 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json({ error: "Завантаження фото ще не налаштовано." }, { status: 503 });
  }

  const folder = isArticleUpload
    ? `bitemap/articles/${payload.targetId}/${userId}`
    : isFishingReportUpload
      ? `bitemap/fishing-reports/${payload.targetId}/${userId}`
      : `bitemap/spot-images/${payload.targetType}/${payload.targetId}/${userId}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, apiSecret);

  return Response.json({ apiKey, cloudName, folder, signature, timestamp });
}
