"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import type { ReactNode } from "react";
import { Link } from "@/shared/lib/i18n";
import { getFishingReportFish, getFishingReportText } from "../model/localization";
import { useFishingReports } from "@/entities/fishing-report";
import type { FishingReport, FishingReportTargetType } from "../model/types";
import styles from "./fishing-report-list.module.scss";

type FishingReportListProps = {
  renderDiscussion?: (report: FishingReport) => ReactNode;
  renderActions?: (report: FishingReport) => ReactNode;
  renderReaction?: (report: FishingReport) => ReactNode;
  targetId: string;
  targetType: FishingReportTargetType;
};

type FishingReportCardProps = {
  actions?: ReactNode;
  discussion?: ReactNode;
  reaction?: ReactNode;
  hideAuthor?: boolean;
  report: FishingReport;
  showAuthor?: boolean;
  target?: { href: string; label: string };
};

export function FishingReportCard({ actions, discussion, hideAuthor = false, reaction, report, showAuthor = true, target }: FishingReportCardProps) {
  const locale = useLocale();
  const t = useTranslations("reports");
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const activity = report.activity ?? "fair";

  return (
    <article className={styles.item}>
      <div className={styles.meta}>
        <div>
          {!hideAuthor ? (showAuthor ? <Link className={styles.authorLink} href={`/anglers/${report.authorId}`}>{report.authorName}</Link> : <p>{report.authorName}</p>) : null}
          <time dateTime={report.tripDate}>{dateFormatter.format(new Date(`${report.tripDate}T00:00:00`))}</time>
        </div>
        <span aria-label={t("ratingValue", { rating: report.rating })}>{"★".repeat(report.rating)}<i>{"★".repeat(5 - report.rating)}</i></span>
      </div>
      {target ? <Link className={styles.targetLink} href={target.href}>{target.label} <span aria-hidden="true">↗</span></Link> : null}
      <p className={styles.impression}>{getFishingReportText(report, "impression", locale)}</p>
      {report.photo?.url ? <figure className={styles.photo}><Image alt={t("catchPhotoAlt", { author: report.authorName })} fill sizes="(max-width: 768px) 100vw, 720px" src={report.photo.url} unoptimized /></figure> : null}
      <dl className={styles.facts}>
        <div><dt>{t("fish")}</dt><dd>{getFishingReportFish(report, locale).join(" · ") || t("noFish")}</dd></div>
        <div><dt>{t("method")}</dt><dd>{getFishingReportText(report, "method", locale) || t("noMethod")}</dd></div>
        <div><dt>{t("bait")}</dt><dd>{getFishingReportText(report, "bait", locale) || t("noBait")}</dd></div>
        <div><dt>{t("activity")}</dt><dd><span className={styles.activity} data-level={activity}>{t(`activityOption.${activity}`)}</span></dd></div>
        {report.catchWeightKg ? <div><dt>{t("catchWeight")}</dt><dd>{t("weightValue", { value: report.catchWeightKg })}</dd></div> : null}
        {report.catchLengthCm ? <div><dt>{t("catchLength")}</dt><dd>{t("lengthValue", { value: report.catchLengthCm })}</dd></div> : null}
        {typeof report.waterTemperatureC === "number" ? <div><dt>{t("waterTemperature")}</dt><dd>{t("waterTemperatureValue", { value: report.waterTemperatureC })}</dd></div> : null}
        {getFishingReportText(report, "rodSetup", locale) ? <div><dt>{t("rodSetup")}</dt><dd>{getFishingReportText(report, "rodSetup", locale)}</dd></div> : null}
        {getFishingReportText(report, "conditions", locale) ? <div><dt>{t("conditions")}</dt><dd>{getFishingReportText(report, "conditions", locale)}</dd></div> : null}
      </dl>
      {reaction}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
      {discussion}
    </article>
  );
}

export function FishingReportList({ renderActions, renderDiscussion, renderReaction, targetId, targetType }: FishingReportListProps) {
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
        <li key={report.id}><FishingReportCard actions={renderActions?.(report)} discussion={renderDiscussion?.(report)} reaction={renderReaction?.(report)} report={report} /></li>
      ))}
    </ol>
  );
}
