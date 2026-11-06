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

export const FISH_SPECIES = Object.keys(FISH_EN);

export function getFishLabel(name: string, locale: string) {
  return locale === "en" ? (FISH_EN[name] ?? name) : name;
}
