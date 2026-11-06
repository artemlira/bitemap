"use client";

import { Link } from "@/shared/lib/i18n";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getFishingSpotFish, getFishingSpotSettlement, getFishingSpotText } from "../model/localization";
import type { FishingSpot } from "../model/types";
import styles from "./fishing-spot-card.module.scss";

type FishingSpotCardProps = {
  spot: FishingSpot;
  href?: string;
};

export function FishingSpotCard({ spot, href }: FishingSpotCardProps) {
  const locale = useLocale();
  const t = useTranslations("spots");
  const settlement = getFishingSpotSettlement(spot, locale);
  const region = getFishingSpotText(spot, "region", locale);
  const accessKey = {
    free: "accessFree",
    paid: "accessPaid",
    restricted: "accessRestricted",
    unknown: "accessUnknown",
  }[spot.accessCategory ?? "unknown"] as "accessFree" | "accessPaid" | "accessRestricted" | "accessUnknown";
  const isVerified = spot.verificationStatus === "verified";
  const freshness = spot.verifiedAt ?? spot.updatedAt;

  return (
    <article className={styles.card}>
      <figure className={styles.visual} data-tone={spot.tone} data-no-photo={!spot.photos?.[0]}>
        {spot.photos?.[0] ? (
          <Image
            className={styles.photo}
            src={spot.photos[0].src}
            alt={spot.photos[0].alt[locale === "en" ? "en" : "uk"]}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
        ) : null}
        <span className={styles.waterType}>{getFishingSpotText(spot, "waterType", locale)}</span>
        {spot.photos?.[0] ? (
          <figcaption className={styles.photoCredit}>
            <a href={spot.photos[0].sourceUrl} target="_blank" rel="noreferrer">{spot.photos[0].creator}</a>
            {" · "}
            <a href={spot.photos[0].licenseUrl} target="_blank" rel="noreferrer">{spot.photos[0].license}</a>
          </figcaption>
        ) : <figcaption className={styles.photoCredit}>{t("photoMissing")}</figcaption>}
      </figure>

      <div className={styles.content}>
        <p className={styles.region}>{settlement && settlement !== region ? `${region} · ${settlement}` : region}</p>
        <h2>{getFishingSpotText(spot, "name", locale)}</h2>
        {getFishingSpotText(spot, "description", locale) ? (
          <p className={styles.description}>{getFishingSpotText(spot, "description", locale)}</p>
        ) : null}
        <p className={styles.fish}>
          {getFishingSpotFish(spot, locale).length ? getFishingSpotFish(spot, locale).join(" · ") : t("fishUnverified")}
        </p>
        <ul className={styles.badges}>
          <li className={styles.badge} data-access={spot.accessCategory ?? "unknown"}>{t(accessKey)}</li>
          <li className={styles.badge} data-verified={isVerified}>
            {isVerified ? t("verificationVerified") : t("verificationUnverified")}
          </li>
        </ul>
        <div className={styles.footer}>
          <span>{freshness ? t("updated", { date: new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(freshness)) }) : null}</span>
          {href ? (
            <div className={styles.actions}>
              <Link href={href}>{t("open")}</Link>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
