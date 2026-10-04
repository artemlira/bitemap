"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useLocale, useTranslations } from "next-intl";
import { useAdminStatus } from "@/entities/admin";
import { Link } from "@/shared/lib/i18n";
import { SiteHeader } from "@/widgets/site-header";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import { moderateContentReport, subscribeToOpenContentReports, type ContentReport } from "@/features/content-report/api/content-reports";
import styles from "./admin-moderation-page.module.scss";

function getTargetHref(report: ContentReport) {
  if (report.targetType === "user-spot") return `/community/${report.targetId}`;
  if (report.targetType === "spot-image") return report.parentId ? `${report.contextType === "catalog" ? "/spots" : "/community"}/${report.parentId}` : "/spots";
  if (report.targetType === "fishing-report") return report.parentId ? `${report.contextType === "catalog" ? "/spots" : "/community"}/${report.parentId}` : "/community";
  if (report.targetType === "comment") return report.contextId ? `${report.contextType === "catalog" ? "/spots" : "/community"}/${report.contextId}` : "/community";
  return `/articles/${report.targetId}`;
}

export function AdminModerationPage() {
  const t = useTranslations("contentReports");
  const { isAdmin, isLoading: isAdminLoading, user } = useAdminStatus();
  const [reports, setReports] = useState<readonly ContentReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [reporterNames, setReporterNames] = useState<Readonly<Record<string, string>>>({});
  const locale = useLocale();

  useEffect(() => {
    if (!isAdmin || isAdminLoading) return;
    return subscribeToOpenContentReports((next) => {
      setReports(next);
      setHasError(false);
      setIsLoading(false);
    }, () => {
      setHasError(true);
      setIsLoading(false);
    });
  }, [isAdmin, isAdminLoading]);

  useEffect(() => {
    if (!isAdmin || reports.length === 0) return;
    let isActive = true;
    const reporterIds = [...new Set(reports.map((report) => report.reporterId))];

    void Promise.all(reporterIds.map(async (reporterId) => {
      try {
        const profile = await getDoc(doc(getFirebaseFirestore(), "public-profiles", reporterId));
        const displayName = profile.data()?.displayName;
        return [reporterId, typeof displayName === "string" && displayName.trim() ? displayName.trim() : ""] as const;
      } catch {
        return [reporterId, ""] as const;
      }
    })).then((entries) => {
      if (isActive) setReporterNames((current) => ({ ...current, ...Object.fromEntries(entries) }));
    });

    return () => { isActive = false; };
  }, [isAdmin, reports]);

  async function handleAction(report: ContentReport, action: "dismiss" | "hide") {
    if (!user || busyId) return;
    setBusyId(report.id);
    setActionError("");
    try {
      await moderateContentReport(report, action, user.uid, await user.getIdToken());
    } catch {
      setActionError(t("actionError"));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent} data-page-hero>
          <p className={styles.eyebrow}>{t("adminEyebrow")}</p>
          <h1>{t("adminTitle")}</h1>
          <p className={styles.lead}>{t("adminLead")}</p>
        </div>
      </section>
      <section className={styles.content} aria-labelledby="moderation-list-title">
        {isAdminLoading ? <p aria-live="polite">{t("checking")}</p> : null}
        {!isAdminLoading && !user ? <aside className={styles.notice}><h2>{t("signInTitle")}</h2><p>{t("signInPrompt")}</p><Link className={styles.primary} href="/login">{t("signIn")}</Link></aside> : null}
        {!isAdminLoading && user && !isAdmin ? <aside className={styles.notice}><h2>{t("accessTitle")}</h2><p>{t("accessPrompt")}</p><code>{user.uid}</code></aside> : null}
        {!isAdminLoading && isAdmin ? <>
          <div className={styles.toolbar}>
            <div><p className={styles.sectionLabel}>{t("queueLabel")}</p><h2 id="moderation-list-title">{t("openTitle", { count: reports.length })}</h2></div>
            <Link className={styles.primary} href="/admin/articles">{t("articlesAdmin")}</Link>
          </div>
          {hasError ? <p className={styles.error} role="alert">{t("loadError")}</p> : null}
          {actionError ? <p className={styles.error} role="alert">{actionError}</p> : null}
          {isLoading ? <p className={styles.empty} aria-live="polite">{t("loading")}</p> : null}
          {!isLoading && !hasError && reports.length === 0 ? <p className={styles.empty}>{t("emptyQueue")}</p> : null}
          <ol className={styles.list}>
            {reports.map((report) => {
              const createdAt = report.createdAt?.toDate();
              const date = createdAt ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(createdAt) : t("justNow");
              return <li className={styles.card} key={report.id}>
                <div className={styles.cardHeader}>
                  <div><span className={styles.badge}>{t(`targetTypes.${report.targetType}`)}</span><span className={styles.badge}>{t(`reasons.${report.reason}`)}</span></div>
                  <time dateTime={createdAt?.toISOString()}>{date}</time>
                </div>
                <p className={styles.details}>{report.details || t("noDetails")}</p>
                <p className={styles.meta}>{t("reporter", { name: reporterNames[report.reporterId] || t("unknownReporter") })} · {t("targetId", { id: report.targetId })}</p>
                <div className={styles.actions}>
                  <Link className={styles.button} href={getTargetHref(report)} rel="noreferrer" target="_blank">{t("openTarget")}</Link>
                  <button className={styles.button} type="button" disabled={busyId !== null} onClick={() => void handleAction(report, "dismiss")}>{busyId === report.id ? t("saving") : t("dismiss")}</button>
                  <button className={`${styles.button} ${styles.danger}`} type="button" disabled={busyId !== null} onClick={() => void handleAction(report, "hide")}>{busyId === report.id ? t("saving") : t("hideContent")}</button>
                </div>
              </li>;
            })}
          </ol>
        </> : null}
      </section>
    </main>
  );
}
