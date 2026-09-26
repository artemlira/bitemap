export type SpotTone = "lagoon" | "reeds" | "river" | "sunset";

export type FishingSpotEnglishTranslation = {
  access: string;
  description: string;
  fish: readonly string[];
  name: string;
  region: string;
  waterType: string;
};

export type FishingSpot = {
  id: string;
  slug: string;
  name: string;
  region: string;
  waterType: string;
  fish: readonly string[];
  description: string;
  access: string;
  tone: SpotTone;
  translations: {
    en: FishingSpotEnglishTranslation;
  };
};
