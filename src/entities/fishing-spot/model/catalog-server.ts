import dataset from "../data/water-bodies.json";
import osmDataset from "../data/osm-water.json";
import { buildFishingSpot, type CatalogBase, type CatalogDetails } from "./catalog-mapping";
import type { FishingSpot } from "./types";

type Record = CatalogBase & CatalogDetails;

const records = [...(dataset.records as unknown as Record[]), ...(osmDataset.records as unknown as Record[])];
const byId = new Map(records.map((record) => [record.id, record]));

const FEATURED_IDS = ["synevyr", "cuciurgan-reservoir", "lake-kahul"];

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

export type NearbySpot = { id: string; name: { uk: string; en: string }; type: string; region: { uk: string; en: string }; distanceKm: number };

const toRad = (value: number) => (value * Math.PI) / 180;

/** Closest catalog waters to a spot (great-circle distance), without the spot itself. */
export function getNearbyFishingSpots(slug: string, count = 6): NearbySpot[] {
  const origin = byId.get(slug);
  if (!origin) return [];
  return records
    .filter((record) => record.id !== slug)
    .map((record) => {
      const dLat = toRad(record.latitude - origin.latitude);
      const dLon = toRad(record.longitude - origin.longitude);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(origin.latitude)) * Math.cos(toRad(record.latitude)) * Math.sin(dLon / 2) ** 2;
      return { record, distanceKm: 6371 * 2 * Math.asin(Math.sqrt(a)) };
    })
    .sort((first, second) => first.distanceKm - second.distanceKm)
    .slice(0, count)
    .map(({ record, distanceKm }) => ({
      id: record.id,
      name: { uk: record.name.uk, en: record.name.en ?? record.name.uk },
      type: record.type,
      region: record.region,
      distanceKm: Math.round(distanceKm),
    }));
}

export function getCatalogStats() {
  return {
    total: records.length,
    regions: new Set(records.map((record) => record.region.uk)).size,
    photos: records.filter((record) => record.photo).length,
  };
}

export function getAllFishingSpotSlugs(): readonly string[] {
  return records.map((record) => record.id);
}

// ---- regions ---------------------------------------------------------------------------

export type RegionSummary = {
  slug: string;
  name: { uk: string; en: string };
  total: number;
  byType: { [type: string]: number };
};

const regionSlug = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function groupByRegion() {
  const groups = new Map<string, { summary: RegionSummary; records: Record[] }>();
  for (const record of records) {
    const slug = regionSlug(record.region.en);
    const group = groups.get(slug) ?? { summary: { slug, name: record.region, total: 0, byType: {} }, records: [] };
    group.summary.total += 1;
    group.summary.byType[record.type] = (group.summary.byType[record.type] ?? 0) + 1;
    group.records.push(record);
    groups.set(slug, group);
  }
  return groups;
}

export function getRegions(): RegionSummary[] {
  return [...groupByRegion().values()]
    .map((group) => group.summary)
    .sort((first, second) => first.name.uk.localeCompare(second.name.uk, "uk"));
}

/** A region with its most useful waters first (records are already ranked by the index builder). */
export function getRegionBySlug(slug: string, count = 12) {
  const group = groupByRegion().get(slug);
  if (!group) return undefined;
  return { summary: group.summary, spots: group.records.slice(0, count).map(toSpot) };
}
