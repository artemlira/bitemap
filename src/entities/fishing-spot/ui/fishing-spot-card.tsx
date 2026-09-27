"use client";

import { Link } from "@/shared/lib/i18n";
import { useLocale, useTranslations } from "next-intl";
import { getFishingSpotFish, getFishingSpotText } from "../model/localization";
import type { FishingSpot } from "../model/types";
import styles from "./fishing-spot-card.module.scss";

type FishingSpotCardProps = {
  spot: FishingSpot;
  href?: string;
};

export function FishingSpotCard({ spot, href }: FishingSpotCardProps) {
  const locale = useLocale();
  const t = useTranslations("spots");

  return (
    <article className={styles.card}>
      <div className={styles.visual} data-tone={spot.tone} aria-hidden="true">
        <span>{getFishingSpotText(spot, "waterType", locale)}</span>
        <i />
      </div>

      <div className={styles.content}>
        <p className={styles.region}>{getFishingSpotText(spot, "region", locale)}</p>
        <h2>{getFishingSpotText(spot, "name", locale)}</h2>
        <p className={styles.description}>{getFishingSpotText(spot, "description", locale)}</p>
        <p className={styles.fish}>{getFishingSpotFish(spot, locale).join(" · ")}</p>
        <div className={styles.footer}>
          <span>{getFishingSpotText(spot, "access", locale)}</span>
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
