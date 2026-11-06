// Species people can report catching. Ukrainian names are the stored values (also checked by
// firestore.rules); English labels are display only.
export const FISH_EN: Record<string, string> = {
  "Щука": "Pike", "Короп": "Carp", "Сазан": "Wild carp", "Лящ": "Bream", "Плітка": "Roach", "Окунь": "Perch",
  "Судак": "Zander", "Сом": "Catfish", "Карась": "Crucian carp", "Лин": "Tench", "Жерех": "Asp", "Голавль": "Chub",
  "Краснопірка": "Rudd", "Білий амур": "Grass carp", "Товстолоб": "Silver carp", "Форель": "Trout", "Харіус": "Grayling",
  "Марена": "Barbel", "Уклея": "Bleak", "Йорж": "Ruffe", "В'юн": "Weatherfish", "Бичок": "Goby", "Осетер": "Sturgeon",
  "Вугор": "Eel", "Підуст": "Nase", "Чехоня": "Sabrefish", "Білизна": "Asp (white)", "Гольян": "Minnow", "Лосось": "Salmon",
  "Кефаль": "Mullet", "Бабець": "Bullhead", "Пічкур": "Gudgeon", "Скумбрія": "Mackerel", "Тарань": "Dried roach",
};

// Votes store ASCII codes (Firestore rules cannot contain Cyrillic string literals).
export const FISH_CODES: Record<string, string> = {
  "Щука": "pike",
  "Короп": "carp",
  "Сазан": "wild-carp",
  "Лящ": "bream",
  "Плітка": "roach",
  "Окунь": "perch",
  "Судак": "zander",
  "Сом": "catfish",
  "Карась": "crucian",
  "Лин": "tench",
  "Жерех": "asp",
  "Голавль": "chub",
  "Краснопірка": "rudd",
  "Білий амур": "grass-carp",
  "Товстолоб": "silver-carp",
  "Форель": "trout",
  "Харіус": "grayling",
  "Марена": "barbel",
  "Уклея": "bleak",
  "Йорж": "ruffe",
  "В'юн": "weatherfish",
  "Бичок": "goby",
  "Осетер": "sturgeon",
  "Вугор": "eel",
  "Підуст": "nase",
  "Чехоня": "sabrefish",
  "Білизна": "white-asp",
  "Гольян": "minnow",
  "Лосось": "salmon",
  "Кефаль": "mullet",
  "Бабець": "bullhead",
  "Пічкур": "gudgeon",
  "Скумбрія": "mackerel",
  "Тарань": "taran",
};

export const FISH_SPECIES = Object.values(FISH_CODES);

const NAME_BY_CODE = Object.fromEntries(Object.entries(FISH_CODES).map(([name, code]) => [code, name]));

/** Display label for a stored species code (falls back to the code). */
export function getFishLabel(code: string, locale: string) {
  const name = NAME_BY_CODE[code] ?? code;
  return locale === "en" ? (FISH_EN[name] ?? name) : name;
}
