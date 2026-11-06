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

export type FishingSpot = {
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
