import type { UserSpot, UserSpotEnglishTranslation } from "./types";

type LocalizedField = keyof Omit<UserSpotEnglishTranslation, "fish">;

const legacyAccessLabels = new Set([
  "Вільний доступ",
  "Платна водойма",
  "Уточнюйте правила",
  "Free access",
  "Paid fishing spot",
  "Check the rules",
]);

export function getUserSpotAccessNote(spot: UserSpot, locale: string): string {
  const value = locale === "en" ? spot.translations?.en?.access || spot.access : spot.access;
  return legacyAccessLabels.has(value.trim()) ? "" : value;
}

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
