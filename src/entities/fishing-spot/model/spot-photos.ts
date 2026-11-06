import type { FishingSpotPhoto } from "./types";

const commons = "https://commons.wikimedia.org/wiki/File:";
const ccBySa3 = "https://creativecommons.org/licenses/by-sa/3.0/";
const ccBySa4 = "https://creativecommons.org/licenses/by-sa/4.0/";

export const fishingSpotPhotos: Readonly<Record<string, readonly FishingSpotPhoto[]>> = {
  "rusanivskyi-canal": [
    { src: "/images/fishing-spots/rusanivskyi-2.jpg", alt: { uk: "Русанівський канал між житловими кварталами Києва", en: "Rusanivskyi Canal between Kyiv residential blocks" }, creator: "Maksym Kozlenko", sourceUrl: `${commons}2019-07-20_Русанівський_канал,_Київ.jpg`, license: "CC BY-SA 4.0", licenseUrl: ccBySa4 },
    { src: "/images/fishing-spots/rusanivskyi-3.jpg", alt: { uk: "Берег Русанівського каналу", en: "Bank of Rusanivskyi Canal" }, creator: "Maksym Kozlenko", sourceUrl: `${commons}Русанівський_канал,_Київ.jpg`, license: "CC BY-SA 4.0", licenseUrl: ccBySa4 },
    { src: "/images/fishing-spots/rusanivskyi-1.jpg", alt: { uk: "Русанівський канал у Києві", en: "Rusanivskyi Canal in Kyiv" }, creator: "BaseSat", sourceUrl: `${commons}Rusanivskyi_canal_2013-06-11_(002).JPG`, license: "CC BY-SA 3.0", licenseUrl: ccBySa3 },
  ],
  "dnister-bays": [
    { src: "/images/fishing-spots/dnister-liman.jpg", alt: { uk: "Дністровський лиман біля Затоки", en: "Dniester Estuary near Zatoka" }, creator: "BackFire", sourceUrl: `${commons}Dniester-Liman-Zatoka.jpg`, license: "CC BY-SA 3.0", licenseUrl: ccBySa3 },
  ],
  "vorskla-river": [
    { src: "/images/fishing-spots/vorskla.jpg", alt: { uk: "Річка Ворскла в Полтаві", en: "Vorskla River in Poltava" }, creator: "Paffka", sourceUrl: `${commons}Vorskla_Poltava.JPG`, license: "CC BY-SA 3.0", licenseUrl: ccBySa3 },
    { src: "/images/fishing-spots/vorskla-2.jpg", alt: { uk: "Краєвид на Ворсклу в Полтаві", en: "Scenery along the Vorskla in Poltava" }, creator: "Adam Jones", sourceUrl: `${commons}Scene_along_Vorskla_River_-_Poltava_-_Ukraine_-_01_(42920318855).jpg`, license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/" },
  ],
  "svitiaz-lake": [
    { src: "/images/fishing-spots/svitiaz.jpg", alt: { uk: "Озеро Світязь у Шацькому національному природному парку", en: "Lake Svitiaz in Shatsk National Nature Park" }, creator: "Oksana Makarenko (UA-Lora)", sourceUrl: `${commons}Shatsky_National_Natural_Park-Svitiaz_lake-04-2014-1.JPG`, license: "CC BY-SA 3.0", licenseUrl: ccBySa3 },
    { src: "/images/fishing-spots/svitiaz-2.jpg", alt: { uk: "Панорама озера Світязь", en: "Panorama of Lake Svitiaz" }, creator: "Galvm", sourceUrl: `${commons}Svitiaz_Kovelskyi_Volynska-Shatskyi_NPP-Svitiaz_lake-panorama_from_the_pansion_Shatski_ozera.jpg`, license: "CC BY-SA 4.0", licenseUrl: ccBySa4 },
  ],
  "kremenchuk-reservoir": [
    { src: "/images/fishing-spots/kremenchuk.jpg", alt: { uk: "Краєвид Кременчуцького водосховища", en: "View of Kremenchuk Reservoir" }, creator: "TheVovaNik", sourceUrl: `${commons}Kremenchuk_Reservoir.jpg`, license: "CC BY-SA 4.0", licenseUrl: ccBySa4 },
  ],
  "ros-river": [
    { src: "/images/fishing-spots/ros.jpg", alt: { uk: "Річка Рось у Білій Церкві", en: "Ros River in Bila Tserkva" }, creator: "Visem", sourceUrl: `${commons}Ducks_in_Ros%27_river_(Bila_Tserkva).jpg`, license: "CC BY-SA 4.0", licenseUrl: ccBySa4 },
  ],
  "desna-backwaters": [
    { src: "/images/fishing-spots/desna.jpg", alt: { uk: "Десна в межах Чернігова", en: "Desna River in Chernihiv" }, creator: "Sergiy Klymenko", sourceUrl: `${commons}Desna_River_in_Chernihiv.jpg`, license: "CC BY-SA 3.0", licenseUrl: ccBySa3 },
  ],
  "synevyr-lake": [
    { src: "/images/fishing-spots/synevyr.jpg", alt: { uk: "Озеро Синевир у національному природному парку", en: "Lake Synevyr in the national nature park" }, creator: "Roman Brechko (Rbrechko)", sourceUrl: `${commons}21-224-5054_Synevyr_Lake_RB_18.jpg`, license: "CC BY-SA 4.0", licenseUrl: ccBySa4 },
  ],
  "dnipro-kyiv": [
    { src: "/images/fishing-spots/dnipro-kyiv.jpg", alt: { uk: "Дніпро в Києві", en: "The Dnipro in Kyiv" }, creator: "Олекса-Київ", sourceUrl: `${commons}DnieperRiverinKiev.jpg`, license: "Public domain", licenseUrl: `${commons}DnieperRiverinKiev.jpg#Licensing` },
  ],
  "kyiv-reservoir": [
    { src: "/images/fishing-spots/kyiv-reservoir.jpg", alt: { uk: "Київське водосховище біля села Толокунь", en: "Kyiv Reservoir near Tolokun village" }, creator: "Vasyatka1", sourceUrl: `${commons}Kyiv_Reservoir_near_Tolokun_village_(1).jpg`, license: "CC BY-SA 4.0", licenseUrl: ccBySa4 },
  ],
  "kaniv-reservoir": [
    { src: "/images/fishing-spots/kaniv-reservoir.jpg", alt: { uk: "Канівське водосховище поблизу села Григорівка", en: "Kaniv Reservoir near Hryhorivka village" }, creator: "Руслан Грибюк", sourceUrl: `${commons}Вид_на_Канівське_водосховище.jpg`, license: "CC BY-SA 4.0", licenseUrl: ccBySa4 },
  ],
  "kamianske-reservoir": [
    { src: "/images/fishing-spots/kamianske-reservoir.jpg", alt: { uk: "Кам’янське водосховище біля села Куліші", en: "Kamianske Reservoir near Kulishi village" }, creator: "Vasyatka1", sourceUrl: `${commons}Dniprodzerzhynsk_Reservoir_(2).JPG`, license: "Public domain", licenseUrl: `${commons}Dniprodzerzhynsk_Reservoir_(2).JPG#Licensing` },
  ],
  "dnipro-reservoir": [
    { src: "/images/fishing-spots/dnipro-reservoir.jpg", alt: { uk: "Берег Дніпра у місті Дніпро", en: "Dnipro riverbank in the city of Dnipro" }, creator: "Alex Blokha", sourceUrl: `${commons}River_bank_in_Dnipro.jpg`, license: "CC BY-SA 4.0", licenseUrl: ccBySa4 },
  ],
};
