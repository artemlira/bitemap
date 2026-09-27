"use client";

import { useLocale, useTranslations } from "next-intl";
import { getFishingReportFish, getFishingReportText } from "../model/localization";
import { useFishingReports } from "../model/use-fishing-reports";
import type { FishingReportTargetType } from "../model/types";
import styles from "./fishing-report-list.module.scss";

type FishingReportListProps = {
  targetId: string;
  targetType: FishingReportTargetType;
};

export function FishingReportList({ targetId, targetType }: FishingReportListProps) {
  const locale = useLocale();
  const t = useTranslations("reports");
  const { error, isLoading, reports } = useFishingReports(targetType, targetId);
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  if (isLoading) {
    return <p className={styles.state} aria-live="polite">{t("loading")}</p>;
  }

  if (error) {
    return <p className={styles.error} role="alert">{t("loadError")}</p>;
  }

  if (reports.length === 0) {
    return <p className={styles.state}>{t("empty")}</p>;
  }

  return (
    <ol className={styles.list} aria-label={t("listLabel")}>
      {reports.map((report) => (
        <li className={styles.item} key={report.id}>
          <div className={styles.meta}>
            <div>
              <p>{report.authorName}</p>
              <time dateTime={report.tripDate}>{dateFormatter.format(new Date(`${report.tripDate}T00:00:00`))}</time>
            </div>
            <span aria-label={t("ratingValue", { rating: report.rating })}>{"★".repeat(report.rating)}<i>{"★".repeat(5 - report.rating)}</i></span>
          </div>
          <p className={styles.impression}>{getFishingReportText(report, "impression", locale)}</p>
          <dl className={styles.facts}>
            <div>
              <dt>{t("fish")}</dt>
              <dd>{getFishingReportFish(report, locale).join(" · ") || t("noFish")}</dd>
            </div>
            <div>
              <dt>{t("method")}</dt>
              <dd>{getFishingReportText(report, "method", locale) || t("noMethod")}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ol>
  );
}
