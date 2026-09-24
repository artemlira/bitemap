export type SpotTone = "lagoon" | "reeds" | "river" | "sunset";

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
};
