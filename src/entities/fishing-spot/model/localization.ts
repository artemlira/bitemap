import type { FishingSpot, FishingSpotEnglishTranslation } from "./types";

type LocalizedField = keyof Omit<FishingSpotEnglishTranslation, "fish" | "settlement">;

export function getFishingSpotText(
  spot: FishingSpot,
  field: LocalizedField,
  locale: string,
): string {
  return locale === "en" ? spot.translations.en[field] : spot[field];
}

export function getFishingSpotSettlement(spot: FishingSpot, locale: string): string | undefined {
  return locale === "en" ? (spot.translations.en.settlement ?? spot.settlement) : spot.settlement;
}

export function getFishingSpotFish(spot: FishingSpot, locale: string): readonly string[] {
  return locale === "en" ? spot.translations.en.fish : spot.fish;
}
