import { FISH_EN } from "./fish-species";
import type { FishingSpot, FishingSpotFacts, FishingSpotPhoto, FishingSpotShape, SpotTone } from "./types";

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
  /** Wikidata id (wiki-sourced records). */
  qid?: string;
  /** OpenStreetMap reference like way/123 (osm-sourced records). */
  osm?: string;
  accessCategory?: "free" | "paid" | "restricted" | "unknown";
  facts?: FishingSpotFacts;
  fish?: string[];
  shape?: FishingSpotShape;
  locationApprox?: boolean;
  description?: { uk: string | null; en: string | null };
  wikipedia?: { uk: string | null; en: string | null };
  photo?: { src: string; creator: string; pageUrl: string; license: string; licenseUrl: string } | null;
};

const WATER_TYPES: Record<WaterBodyType, { uk: string; en: string; tone: SpotTone }> = {
  lake: { uk: "Озеро", en: "Lake", tone: "lagoon" },
  reservoir: { uk: "Водосховище", en: "Reservoir", tone: "reeds" },
  river: { uk: "Річка", en: "River", tone: "river" },
  canal: { uk: "Канал", en: "Canal", tone: "sunset" },
  pond: { uk: "Ставок", en: "Pond", tone: "reeds" },
};

export const catalogWaterTypes = WATER_TYPES;


const num = (value: number) => value.toLocaleString("uk-UA", { maximumFractionDigits: 1 });
const numEn = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 1 });

/** A plain sentence built only from known facts, used when no article text exists. */
function describeFromFacts(type: WaterBodyType, facts: FishingSpotFacts | undefined, lang: "uk" | "en"): string {
  const label = WATER_TYPES[type][lang];
  if (!facts) return "";
  const parts: string[] = [];
  if (lang === "uk") {
    if (facts.lengthKm) parts.push(`завдовжки ${num(facts.lengthKm)} км`);
    if (facts.areaKm2) parts.push(`площею ${num(facts.areaKm2)} км²`);
    if (facts.maxDepthM) parts.push(`із максимальною глибиною ${num(facts.maxDepthM)} м`);
    if (facts.basin) parts.push(`у басейні: ${facts.basin.uk}`);
    if (facts.flowsInto) parts.push(`впадає в: ${facts.flowsInto.uk}`);
  } else {
    if (facts.lengthKm) parts.push(`${numEn(facts.lengthKm)} km long`);
    if (facts.areaKm2) parts.push(`covering ${numEn(facts.areaKm2)} km²`);
    if (facts.maxDepthM) parts.push(`up to ${numEn(facts.maxDepthM)} m deep`);
    if (facts.basin) parts.push(`in the ${facts.basin.en} basin`);
    if (facts.flowsInto) parts.push(`flowing into ${facts.flowsInto.en}`);
  }
  return parts.length ? `${label}, ${parts.join(", ")}.` : "";
}

/** Builds the app-level spot from an open-data catalog record. */
export type CatalogExtras = { facts?: FishingSpotFacts; fish?: string[]; accessCategory?: CatalogDetails["accessCategory"] };

export function buildFishingSpot(
  base: CatalogBase,
  importedAt: string,
  details?: CatalogDetails,
  extras?: CatalogExtras,
): FishingSpot {
  const facts = details?.facts ?? extras?.facts;
  const fishNames = details?.fish ?? extras?.fish ?? [];
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
    fish: fishNames,
    facts,
    shape: details?.shape,
    locationApprox: details ? details.locationApprox : undefined,
    fishSourceUrl: details?.fish?.length ? (details.wikipedia?.uk ?? undefined) : undefined,
    description: details?.description?.uk ?? describeFromFacts(base.type, facts, "uk"),
    access: "Умови доступу не перевірені",
    accessCategory: details?.accessCategory ?? extras?.accessCategory ?? "unknown",
    verificationStatus: "verified",
    verifiedAt: importedAt,
    updatedAt: importedAt,
    sourceUrl: details?.osm
      ? `https://www.openstreetmap.org/${details.osm}`
      : details?.qid
        ? `https://www.wikidata.org/wiki/${details.qid}`
        : undefined,
    descriptionSourceUrl: details?.description?.uk ? (details.wikipedia?.uk ?? undefined) : undefined,
    photos: photo ? [photo] : undefined,
    tone: type.tone,
    translations: {
      en: {
        access: "Access conditions unverified",
        description: details?.description?.en ?? describeFromFacts(base.type, facts, "en") ?? "",
        fish: fishNames.map((name) => FISH_EN[name] ?? name),
        name: base.name.en ?? base.name.uk,
        region: base.region.en,
        waterType: type.en,
      },
    },
  };
}
