"use client";

import { Link } from "@/shared/lib/i18n";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getUserSpotFish, getUserSpotText } from "../model/localization";
import type { UserSpot } from "../model/types";
import styles from "./user-spot-card.module.scss";

type UserSpotCardProps = {
  actionLabel?: string;
  footerActions?: ReactNode;
  href?: string;
  showVisibility?: boolean;
  spot: UserSpot;
};

export function UserSpotCard({
  actionLabel,
  footerActions,
  href,
  showVisibility = true,
  spot,
}: UserSpotCardProps) {
  const locale = useLocale();
  const t = useTranslations("userSpotCard");
  const destination = href ?? `/my-spots/${spot.id}/edit`;

  return (
    <article className={styles.card}>
      <div className={styles.visual} data-tone={spot.tone} aria-hidden="true">
        <span>{getUserSpotText(spot, "waterType", locale)}</span>
        <i />
      </div>
      <div className={styles.content}>
        <p className={styles.region}>{spot.settlement ? `${spot.region} · ${spot.settlement}` : spot.region}</p>
        <h2>{getUserSpotText(spot, "name", locale)}</h2>
        {showVisibility ? <p className={styles.visibility}>{spot.visibility === "published" ? t("published") : t("private")}</p> : null}
        <p className={styles.description}>{getUserSpotText(spot, "description", locale)}</p>
        <p className={styles.fish}>{getUserSpotFish(spot, locale).join(" · ")}</p>
        <div className={styles.footer}>
          <span>{getUserSpotText(spot, "access", locale)}</span>
          <div className={styles.actions}>
            {footerActions}
            <Link href={destination}>{actionLabel ?? t("edit")}</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
