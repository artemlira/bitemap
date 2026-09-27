import "server-only";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

const validImageId = /^[a-zA-Z0-9_-]{1,128}$/;

type FirebaseLookupResponse = {
  users?: Array<{
    localId?: string;
  }>;
};

type FirestoreDocument = {
  fields?: {
    ownerId?: { stringValue?: string };
    storagePath?: { stringValue?: string };
    targetId?: { stringValue?: string };
    targetType?: { stringValue?: string };
  };
};

type ImageFields = {
  ownerId: { stringValue: string };
  storagePath: { stringValue: string };
  targetId: { stringValue: string };
  targetType: { stringValue: string };
};

type ImageContext = {
  documentUrl: string;
  idToken: string;
  image: ImageFields;
  userId: string;
};

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization");
  return header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
}

function getEnvironment() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
  const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!apiKey || !cloudName || !cloudinaryApiKey || !cloudinaryApiSecret || !projectId) {
    return null;
  }

  return { apiKey, cloudName, cloudinaryApiKey, cloudinaryApiSecret, projectId };
}

async function getFirebaseUserId(apiKey: string, idToken: string) {
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

function readStringField(fields: FirestoreDocument["fields"], fieldName: keyof NonNullable<FirestoreDocument["fields"]>) {
  const value = fields?.[fieldName]?.stringValue;
  return typeof value === "string" && value.length > 0 ? value : null;
}

function isImageDocument(fields: FirestoreDocument["fields"]): fields is ImageFields {
  return ["ownerId", "storagePath", "targetId", "targetType"].every((fieldName) =>
    Boolean(readStringField(fields, fieldName as keyof NonNullable<FirestoreDocument["fields"]>)),
  );
}

async function resolveImageContext(request: Request, imageId: string): Promise<ImageContext | Response> {
  const idToken = getBearerToken(request);
  const environment = getEnvironment();

  if (!idToken) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!environment) {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  const userId = await getFirebaseUserId(environment.apiKey, idToken);

  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const documentUrl = `https://firestore.googleapis.com/v1/projects/${environment.projectId}/databases/(default)/documents/spot-images/${imageId}`;
  const response = await fetch(documentUrl, { headers: { Authorization: `Bearer ${idToken}` } });

  if (response.status === 404) {
    return Response.json({ error: "not-found" }, { status: 404 });
  }

  if (!response.ok) {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  const document = (await response.json()) as FirestoreDocument;

  if (!isImageDocument(document.fields)) {
    return Response.json({ error: "invalid-image" }, { status: 422 });
  }

  if (document.fields.ownerId.stringValue !== userId) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  return { documentUrl, idToken, image: document.fields, userId };
}

function configureCloudinary(environment: NonNullable<ReturnType<typeof getEnvironment>>) {
  cloudinary.config({
    api_key: environment.cloudinaryApiKey,
    api_secret: environment.cloudinaryApiSecret,
    cloud_name: environment.cloudName,
    secure: true,
  });
}

function isResponse(value: ImageContext | Response): value is Response {
  return value instanceof Response;
}

export async function DELETE(request: Request, { params }: { params: Promise<{ imageId: string }> }) {
  const { imageId } = await params;

  if (!validImageId.test(imageId)) {
    return Response.json({ error: "invalid-image" }, { status: 400 });
  }

  const context = await resolveImageContext(request, imageId);

  if (isResponse(context)) {
    return context;
  }

  const environment = getEnvironment();

  if (!environment) {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  configureCloudinary(environment);

  try {
    await cloudinary.uploader.destroy(context.image.storagePath.stringValue, { invalidate: true, resource_type: "image" });
  } catch {
    return Response.json({ error: "media-delete-failed" }, { status: 502 });
  }

  const deleteResponse = await fetch(context.documentUrl, {
    headers: { Authorization: `Bearer ${context.idToken}` },
    method: "DELETE",
  });

  if (!deleteResponse.ok) {
    return Response.json({ error: "media-delete-failed" }, { status: 502 });
  }

  return new Response(null, { status: 204 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ imageId: string }> }) {
  const { imageId } = await params;

  if (!validImageId.test(imageId)) {
    return Response.json({ error: "invalid-image" }, { status: 400 });
  }

  const context = await resolveImageContext(request, imageId);

  if (isResponse(context)) {
    return context;
  }

  let payload: { storagePath?: unknown; url?: unknown };

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid-payload" }, { status: 400 });
  }

  const storagePath = typeof payload.storagePath === "string" ? payload.storagePath : null;
  const url = typeof payload.url === "string" ? payload.url : null;
  const targetId = context.image.targetId.stringValue;
  const targetType = context.image.targetType.stringValue;
  const environment = getEnvironment();

  if (!storagePath || !url || !environment) {
    return Response.json({ error: "invalid-payload" }, { status: 400 });
  }

  const expectedFolder = `bitemap/spot-images/${targetType}/${targetId}/${context.userId}/`;

  if (!storagePath.startsWith(expectedFolder) || !url.startsWith(`https://res.cloudinary.com/${environment.cloudName}/`)) {
    return Response.json({ error: "invalid-payload" }, { status: 400 });
  }

  const updateResponse = await fetch(`${context.documentUrl}?updateMask.fieldPaths=storagePath&updateMask.fieldPaths=url`, {
    body: JSON.stringify({
      fields: {
        storagePath: { stringValue: storagePath },
        url: { stringValue: url },
      },
    }),
    headers: {
      Authorization: `Bearer ${context.idToken}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });

  if (!updateResponse.ok) {
    configureCloudinary(environment);
    await cloudinary.uploader.destroy(storagePath, { invalidate: true, resource_type: "image" }).catch(() => undefined);
    return Response.json({ error: "media-replace-failed" }, { status: 502 });
  }

  configureCloudinary(environment);
  await cloudinary.uploader.destroy(context.image.storagePath.stringValue, { invalidate: true, resource_type: "image" }).catch(() => undefined);

  return Response.json({ ok: true });
}
