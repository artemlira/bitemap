"use client";

import { Link } from "@/shared/lib/i18n";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getFishingSpotFish, getFishingSpotSettlement, getFishingSpotText } from "../model/localization";
import type { FishingSpot } from "../model/types";
import { WaterSilhouette } from "./water-silhouette";
import styles from "./fishing-spot-card.module.scss";

type FishingSpotCardProps = {
  spot: FishingSpot;
  href?: string;
};

const MAX_FISH = 3;

export function FishingSpotCard({ spot, href }: FishingSpotCardProps) {
  const locale = useLocale();
  const t = useTranslations("spots");
  const settlement = getFishingSpotSettlement(spot, locale);
  const region = getFishingSpotText(spot, "region", locale);
  const name = getFishingSpotText(spot, "name", locale);
  const description = getFishingSpotText(spot, "description", locale);
  const fish = getFishingSpotFish(spot, locale);
  const photo = spot.photos?.[0];
  const accessLabel = {
    free: t("accessFree"),
    paid: t("accessPaid"),
    restricted: t("accessRestricted"),
    unknown: "",
  }[spot.accessCategory ?? "unknown"];
  const numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const chips = [
    spot.facts?.lengthKm ? `${numberFormat.format(spot.facts.lengthKm)} ${t("unitKm")}` : null,
    spot.facts?.areaKm2 ? `${numberFormat.format(spot.facts.areaKm2)} ${t("unitKm2")}` : null,
    accessLabel || null,
  ].filter(Boolean);

  const title = href ? (
    <Link className={styles.link} href={href}>
      {name}
    </Link>
  ) : (
    name
  );

  return (
    <article className={styles.card} data-tilt>
      <figure className={styles.visual} data-tone={spot.tone} data-no-photo={!photo}>
        {photo ? (
          <Image
            className={styles.photo}
            src={photo.src}
            alt={photo.alt[locale === "en" ? "en" : "uk"]}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
        ) : spot.shape ? (
          <WaterSilhouette shape={spot.shape} className={styles.silhouette} />
        ) : null}
        <span className={styles.waterType}>{getFishingSpotText(spot, "waterType", locale)}</span>
        {photo ? (
          <figcaption className={styles.photoCredit}>
            <a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.creator}</a>
            {" · "}
            <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a>
          </figcaption>
        ) : null}
      </figure>

      <div className={styles.content}>
        <p className={styles.region}>{settlement && settlement !== region ? `${region} · ${settlement}` : region}</p>
        <h3>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}

        {chips.length > 0 || fish.length > 0 ? (
          <ul className={styles.chips}>
            {chips.map((chip) => (
              <li key={chip} className={styles.chip}>{chip}</li>
            ))}
            {fish.slice(0, MAX_FISH).map((item) => (
              <li key={item} className={styles.fishChip}>{item}</li>
            ))}
            {fish.length > MAX_FISH ? <li className={styles.chip}>+{fish.length - MAX_FISH}</li> : null}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
