import type { FishingSpot, FishingSpotPhoto, SpotTone } from "./types";

export type WaterBodyType = "lake" | "reservoir" | "river" | "canal" | "pond";

export type CatalogBase = {
  id: string;
  type: WaterBodyType;
  name: { uk: string; en: string | null };
  region: { uk: string; en: string };
  latitude: number;
  longitude: number;
};

export type CatalogDetails = {
  qid: string;
  description: { uk: string | null; en: string | null };
  wikipedia: { uk: string | null; en: string | null };
  photo: { src: string; creator: string; pageUrl: string; license: string; licenseUrl: string } | null;
};

const WATER_TYPES: Record<WaterBodyType, { uk: string; en: string; tone: SpotTone }> = {
  lake: { uk: "Озеро", en: "Lake", tone: "lagoon" },
  reservoir: { uk: "Водосховище", en: "Reservoir", tone: "reeds" },
  river: { uk: "Річка", en: "River", tone: "river" },
  canal: { uk: "Канал", en: "Canal", tone: "sunset" },
  pond: { uk: "Ставок", en: "Pond", tone: "reeds" },
};

export const catalogWaterTypes = WATER_TYPES;

/** Builds the app-level spot from an open-data catalog record. */
export function buildFishingSpot(
  base: CatalogBase,
  importedAt: string,
  details?: CatalogDetails,
): FishingSpot {
  const type = WATER_TYPES[base.type];
  const photo: FishingSpotPhoto | undefined = details?.photo
    ? {
        src: details.photo.src,
        alt: { uk: base.name.uk, en: base.name.en ?? base.name.uk },
        creator: details.photo.creator,
        sourceUrl: details.photo.pageUrl,
        license: details.photo.license,
        licenseUrl: details.photo.licenseUrl,
      }
    : undefined;

  return {
    id: base.id,
    slug: base.id,
    name: base.name.uk,
    region: base.region.uk,
    waterType: type.uk,
    latitude: base.latitude,
    longitude: base.longitude,
    fish: [],
    description: details?.description.uk ?? "",
    access: "Умови доступу не перевірені",
    accessCategory: "unknown",
    verificationStatus: "verified",
    verifiedAt: importedAt,
    updatedAt: importedAt,
    sourceUrl: details ? `https://www.wikidata.org/wiki/${details.qid}` : undefined,
    descriptionSourceUrl: details?.description.uk ? (details.wikipedia.uk ?? undefined) : undefined,
    photos: photo ? [photo] : undefined,
    tone: type.tone,
    translations: {
      en: {
        access: "Access conditions unverified",
        description: details?.description.en ?? details?.description.uk ?? "",
        fish: [],
        name: base.name.en ?? base.name.uk,
        region: base.region.en,
        waterType: type.en,
      },
    },
  };
}
