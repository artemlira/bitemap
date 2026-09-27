"use client";

import { useTranslations } from "next-intl";
import { FishingReportList, type FishingReportTargetType } from "@/entities/fishing-report";
import { CreateFishingReportForm } from "@/features/create-fishing-report";
import { ManageFishingReportActions } from "@/features/manage-fishing-report";
import styles from "./spot-reports.module.scss";

type SpotReportsProps = {
  isPublic?: boolean;
  targetId: string;
  targetType: FishingReportTargetType;
};

export function SpotReports({ isPublic, targetId, targetType }: SpotReportsProps) {
  const t = useTranslations("reports");
  const reportIsPublic = isPublic ?? targetType === "catalog";

  return (
    <section className={styles.section} aria-labelledby={`spot-reports-title-${targetType}-${targetId}`}>
      <div className={styles.heading}>
        <p>{t("eyebrow")}</p>
        <h2 id={`spot-reports-title-${targetType}-${targetId}`}>{t("title")}</h2>
      </div>
      <FishingReportList renderActions={(report) => <ManageFishingReportActions report={report} />} targetType={targetType} targetId={targetId} />
      <CreateFishingReportForm isPublic={reportIsPublic} targetType={targetType} targetId={targetId} />
    </section>
  );
}
