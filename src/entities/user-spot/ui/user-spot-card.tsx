"use client";

import { Link } from "@/shared/lib/i18n";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getUserSpotAccessNote, getUserSpotFish, getUserSpotText } from "../model/localization";
import type { UserSpot, UserSpotAccessCategory, UserSpotVerificationStatus } from "../model/types";
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
  const accessNote = getUserSpotAccessNote(spot, locale);
  const accessKey: Record<UserSpotAccessCategory, string> = {
    free: "accessFree",
    paid: "accessPaid",
    restricted: "accessRestricted",
    unknown: "accessUnknown",
  };
  const verificationKey: Record<UserSpotVerificationStatus, string> = {
    "community-reported": "verificationCommunityReported",
    verified: "verificationVerified",
    unverified: "verificationUnverified",
  };

  return (
    <article className={styles.card} data-tilt>
      <div className={styles.visual} data-tone={spot.tone} aria-hidden="true">
        <span>{getUserSpotText(spot, "waterType", locale)}</span>
        <i />
      </div>
      <div className={styles.content}>
        <p className={styles.region}>{spot.settlement ? `${spot.region} · ${spot.settlement}` : spot.region}</p>
        <h3>{getUserSpotText(spot, "name", locale)}</h3>
        {showVisibility ? <p className={styles.visibility}>{spot.visibility === "published" ? t("published") : t("private")}</p> : null}
        <p className={styles.description}>{getUserSpotText(spot, "description", locale)}</p>
        <p className={styles.fish}>{getUserSpotFish(spot, locale).join(" · ")}</p>
        <p className={styles.dataStatus}>
          <span>{t(accessKey[spot.accessCategory ?? "unknown"])}</span>
          <span>{t(verificationKey[spot.verificationStatus ?? "unverified"])}</span>
          {spot.updatedAt ? <span>{t("updated", { date: new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(spot.updatedAt) })}</span> : null}
        </p>
        <div className={styles.footer}>
          {accessNote ? <span>{accessNote}</span> : null}
          <div className={styles.actions}>
            {footerActions}
            <Link href={destination}>{actionLabel ?? t("edit")}</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
