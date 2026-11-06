export type SpotTone = "lagoon" | "reeds" | "river" | "sunset";

export type FishingSpotPhoto = {
  src: string;
  alt: { uk: string; en: string };
  creator: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
};

export type FishingSpotEnglishTranslation = {
  access: string;
  description: string;
  fish: readonly string[];
  name: string;
  region: string;
  settlement?: string;
  waterType: string;
};

export type LocalizedPair = { uk: string; en: string };

/** Open-data facts (Wikidata). Every field is optional: show only what is known. */
export type FishingSpotFacts = {
  lengthKm?: number;
  areaKm2?: number;
  maxDepthM?: number;
  elevationM?: number;
  basin?: LocalizedPair;
  flowsInto?: LocalizedPair;
  district?: LocalizedPair;
};

/** Simplified OpenStreetMap geometry: rings for lakes, polylines for rivers ([lat, lon] pairs). */
export type FishingSpotShape = { kind: "area" | "line"; lines: [number, number][][] };

export type FishingSpot = {
  shape?: FishingSpotShape;
  /** True when no OpenStreetMap match exists and the pin comes straight from Wikidata. */
  locationApprox?: boolean;
  facts?: FishingSpotFacts;
  /** Article that names the listed fish (Wikipedia). */
  fishSourceUrl?: string;
  accessCategory?: "free" | "paid" | "restricted" | "unknown";
  verificationStatus?: "verified" | "unverified";
  /** ISO date (YYYY-MM-DD) when this catalog record was last edited. */
  updatedAt?: string;
  /** ISO date (YYYY-MM-DD) when facts were last checked against the source. Absent = never verified. */
  verifiedAt?: string;
  settlement?: string;
  latitude: number;
  longitude: number;
  id: string;
  slug: string;
  name: string;
  region: string;
  waterType: string;
  fish: readonly string[];
  description: string;
  access: string;
  sourceUrl?: string;
  /** Where the description text comes from (e.g. a Wikipedia article, CC BY-SA 4.0). */
  descriptionSourceUrl?: string;
  photos?: readonly FishingSpotPhoto[];
  tone: SpotTone;
  translations: {
    en: FishingSpotEnglishTranslation;
  };
};
