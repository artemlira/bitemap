import type { FishingSpot, FishingSpotEnglishTranslation } from "./types";

type LocalizedField = keyof Omit<FishingSpotEnglishTranslation, "fish">;

export function getFishingSpotText(
  spot: FishingSpot,
  field: LocalizedField,
  locale: string,
): string {
  return locale === "en" ? spot.translations.en[field] : spot[field];
}

export function getFishingSpotFish(spot: FishingSpot, locale: string): readonly string[] {
  return locale === "en" ? spot.translations.en.fish : spot.fish;
}
