import type { UserSpot } from "./types";

type UserSpotRecord = Omit<UserSpot, "id" | "updatedAt"> & {
  updatedAt?: Date | { toDate?: () => Date };
};

export function normalizeUserSpot(id: string, data: UserSpotRecord): UserSpot {
  const timestamp = data.updatedAt;
  const updatedAt = timestamp instanceof Date
    ? timestamp
    : typeof timestamp?.toDate === "function"
      ? timestamp.toDate()
      : undefined;

  return {
    ...data,
    accessCategory: data.accessCategory ?? "unknown",
    id,
    updatedAt,
    verificationStatus: data.verificationStatus ?? "unverified",
    visibility: data.visibility === "published" ? "published" : "private",
  };
}
