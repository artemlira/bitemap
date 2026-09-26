import type { UserSpot, UserSpotEnglishTranslation } from "./types";

type LocalizedField = keyof Omit<UserSpotEnglishTranslation, "fish">;

export function getUserSpotText(
  spot: UserSpot,
  field: LocalizedField,
  locale: string,
): string {
  const sourceValue = spot[field] as string;

  return locale === "en" ? spot.translations?.en?.[field] || sourceValue : sourceValue;
}

export function getUserSpotFish(spot: UserSpot, locale: string): readonly string[] {
  return locale === "en" ? spot.translations?.en?.fish || spot.fish : spot.fish;
}
