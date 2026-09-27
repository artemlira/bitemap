"use client";

import { useLocale, useTranslations } from "next-intl";
import { fishingSpots, getFishingSpotText } from "@/entities/fishing-spot";
import { FishingReportCard, useCommunityFishingReports } from "@/entities/fishing-report";
import { getUserSpotText, type UserSpot } from "@/entities/user-spot";
import styles from "./community-reports.module.scss";

type CommunityReportsProps = {
  spots: readonly UserSpot[];
};

type ReportTarget = {
  href: string;
  label: string;
};

export function CommunityReports({ spots }: CommunityReportsProps) {
  const locale = useLocale();
  const t = useTranslations("communityReports");
  const { error, isLoading, reports } = useCommunityFishingReports();
  const targets = new Map<string, ReportTarget>();

  fishingSpots.forEach((spot) => {
    targets.set(`catalog:${spot.id}`, {
      href: `/spots/${spot.slug}`,
      label: getFishingSpotText(spot, "name", locale),
    });
  });

  spots.forEach((spot) => {
    targets.set(`user-spot:${spot.id}`, {
      href: `/community/${spot.id}`,
      label: getUserSpotText(spot, "name", locale),
    });
  });

  const visibleReports = reports.flatMap((report) => {
    const target = targets.get(`${report.targetType}:${report.targetId}`);
    return target ? [{ report, target }] : [];
  });

  return (
    <section className={styles.section} aria-labelledby="community-reports-title">
      <div className={styles.heading}>
        <div>
          <p>{t("eyebrow")}</p>
          <h2 id="community-reports-title">{t("title")}</h2>
        </div>
        <p>{t("lead")}</p>
      </div>

      {isLoading ? <p className={styles.state} aria-live="polite">{t("loading")}</p> : null}
      {error ? <p className={styles.error} role="alert">{t("error")}</p> : null}
      {!isLoading && !error && visibleReports.length === 0 ? <p className={styles.state}>{t("empty")}</p> : null}

      {visibleReports.length > 0 ? (
        <ol className={styles.list} aria-label={t("listLabel")}>
          {visibleReports.map(({ report, target }) => (
            <li key={report.id}><FishingReportCard report={report} target={target} /></li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
