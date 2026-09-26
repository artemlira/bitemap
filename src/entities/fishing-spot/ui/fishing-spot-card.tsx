"use client";

import { Link } from "@/shared/lib/i18n";
import { useLocale } from "next-intl";
import { getFishingSpotFish, getFishingSpotText } from "../model/localization";
import type { FishingSpot } from "../model/types";
import styles from "./fishing-spot-card.module.scss";

type FishingSpotCardProps = {
  spot: FishingSpot;
  href?: string;
};

export function FishingSpotCard({ spot, href }: FishingSpotCardProps) {
  const locale = useLocale();
  const content = (
    <article className={styles.card}>
      <div className={styles.visual} data-tone={spot.tone} aria-hidden="true">
        <span>{getFishingSpotText(spot, "waterType", locale)}</span>
        <i />
      </div>

      <div className={styles.content}>
        <p className={styles.region}>{getFishingSpotText(spot, "region", locale)}</p>
        <h3>{getFishingSpotText(spot, "name", locale)}</h3>
        <p className={styles.description}>{getFishingSpotText(spot, "description", locale)}</p>
        <div className={styles.meta}>
          <span>{getFishingSpotFish(spot, locale).join(" · ")}</span>
          <span>{getFishingSpotText(spot, "access", locale)}</span>
        </div>
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link className={styles.link} href={href}>
      {content}
    </Link>
  );
}
