"use client";

import { Link } from "@/shared/lib/i18n";
import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { getUserSpotFish, getUserSpotText } from "../model/localization";
import type { UserSpot } from "../model/types";
import styles from "./user-spot-card.module.scss";

type UserSpotCardProps = {
  actionLabel?: string;
  footerActions?: ReactNode;
  href?: string;
  spot: UserSpot;
};

export function UserSpotCard({
  actionLabel = "Редагувати",
  footerActions,
  href,
  spot,
}: UserSpotCardProps) {
  const locale = useLocale();
  const destination = href ?? `/my-spots/${spot.id}/edit`;

  return (
    <article className={styles.card}>
      <div className={styles.visual} data-tone={spot.tone} aria-hidden="true">
        <span>{spot.waterType}</span>
        <i />
      </div>
      <div className={styles.content}>
        <p className={styles.region}>{spot.settlement ? `${spot.region} · ${spot.settlement}` : spot.region}</p>
        <h2>{getUserSpotText(spot, "name", locale)}</h2>
        <p className={styles.visibility}>{spot.visibility === "published" ? "Опубліковано для спільноти" : "Приватна водойма"}</p>
        <p className={styles.description}>{getUserSpotText(spot, "description", locale)}</p>
        <p className={styles.fish}>{getUserSpotFish(spot, locale).join(" · ")}</p>
        <div className={styles.footer}>
          <span>{getUserSpotText(spot, "access", locale)}</span>
          <div className={styles.actions}>
            {footerActions}
            <Link href={destination}>{actionLabel}</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
