import { isWithinUkraine } from "../../../shared/lib/geo/ukraine-bounds";
import type { FishingSpot } from "./types";

export type FishingSpotIssue = { spotId: string; field: string; message: string };

const ACCESS_CATEGORIES = ["free", "paid", "restricted", "unknown"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Checks the publication standard from docs/fishing-spot-catalog-audit.md for curated records. */
export function validateFishingSpot(spot: FishingSpot): FishingSpotIssue[] {
  const issues: FishingSpotIssue[] = [];
  const report = (field: string, message: string) => issues.push({ spotId: spot.id, field, message });

  if (!spot.id || !/^[a-z0-9-]+$/.test(spot.slug)) report("slug", "slug must be lowercase latin letters, digits and dashes");
  if (!spot.name.trim() || !spot.translations?.en?.name?.trim()) report("name", "name is required in uk and en");
  if (!isWithinUkraine(spot.latitude, spot.longitude)) report("coordinates", "coordinates are outside Ukraine");
  if (!spot.region.trim()) report("region", "region is required");
  if (!spot.waterType.trim()) report("waterType", "water type is required");
  if (!spot.description.trim()) report("description", "description is required");
  if (!ACCESS_CATEGORIES.includes(spot.accessCategory ?? "unknown")) report("accessCategory", "unknown access category");
  if (!spot.updatedAt || !ISO_DATE.test(spot.updatedAt)) report("updatedAt", "updatedAt must be an ISO date");
  if (spot.verifiedAt && !ISO_DATE.test(spot.verifiedAt)) report("verifiedAt", "verifiedAt must be an ISO date");
  if (spot.verificationStatus === "verified" && !spot.sourceUrl) report("sourceUrl", "verified records need a source");
  if (spot.accessCategory && spot.accessCategory !== "unknown" && !spot.sourceUrl) {
    report("sourceUrl", "a stated access category needs a source");
  }

  return issues;
}
