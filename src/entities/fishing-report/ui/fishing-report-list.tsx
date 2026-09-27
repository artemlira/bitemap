"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import { getFishingReportFish, getFishingReportText } from "../model/localization";
import { useFishingReports } from "../model/use-fishing-reports";
import type { FishingReport, FishingReportTargetType } from "../model/types";
import styles from "./fishing-report-list.module.scss";

type FishingReportListProps = {
  targetId: string;
  targetType: FishingReportTargetType;
};

type FishingReportCardProps = {
  report: FishingReport;
  showAuthor?: boolean;
  target?: { href: string; label: string };
};

export function FishingReportCard({ report, showAuthor = true, target }: FishingReportCardProps) {
  const locale = useLocale();
  const t = useTranslations("reports");
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const activity = report.activity ?? "fair";

  return (
    <article className={styles.item}>
      <div className={styles.meta}>
        <div>
          {showAuthor ? <Link className={styles.authorLink} href={`/anglers/${report.authorId}`}>{report.authorName}</Link> : <p>{report.authorName}</p>}
          <time dateTime={report.tripDate}>{dateFormatter.format(new Date(`${report.tripDate}T00:00:00`))}</time>
        </div>
        <span aria-label={t("ratingValue", { rating: report.rating })}>{"★".repeat(report.rating)}<i>{"★".repeat(5 - report.rating)}</i></span>
      </div>
      {target ? <Link className={styles.targetLink} href={target.href}>{target.label} <span aria-hidden="true">↗</span></Link> : null}
      <p className={styles.impression}>{getFishingReportText(report, "impression", locale)}</p>
      <dl className={styles.facts}>
        <div><dt>{t("fish")}</dt><dd>{getFishingReportFish(report, locale).join(" · ") || t("noFish")}</dd></div>
        <div><dt>{t("method")}</dt><dd>{getFishingReportText(report, "method", locale) || t("noMethod")}</dd></div>
        <div><dt>{t("bait")}</dt><dd>{getFishingReportText(report, "bait", locale) || t("noBait")}</dd></div>
        <div><dt>{t("activity")}</dt><dd><span className={styles.activity} data-level={activity}>{t(`activityOption.${activity}`)}</span></dd></div>
      </dl>
    </article>
  );
}

export function FishingReportList({ targetId, targetType }: FishingReportListProps) {
  const t = useTranslations("reports");
  const { error, isLoading, reports } = useFishingReports(targetType, targetId);

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
        <li key={report.id}><FishingReportCard report={report} /></li>
      ))}
    </ol>
  );
}
