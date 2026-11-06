import dataset from "../data/water-bodies.json";
import { buildFishingSpot, type CatalogBase, type CatalogDetails } from "./catalog-mapping";
import type { FishingSpot } from "./types";

type Record = CatalogBase & CatalogDetails;

const records = dataset.records as unknown as Record[];
const byId = new Map(records.map((record) => [record.id, record]));

const FEATURED_IDS = ["synevyr", "kaniv-reservoir", "dnieper-reservoir"];

function toSpot(record: Record) {
  return buildFishingSpot(record, dataset.importedAt, record);
}

export function getFishingSpotBySlug(slug: string): FishingSpot | undefined {
  const record = byId.get(slug);
  return record ? toSpot(record) : undefined;
}

export function getFeaturedFishingSpots(): readonly FishingSpot[] {
  return FEATURED_IDS.flatMap((id) => {
    const record = byId.get(id);
    return record ? [toSpot(record)] : [];
  });
}

export function getAllFishingSpotSlugs(): readonly string[] {
  return records.map((record) => record.id);
}
