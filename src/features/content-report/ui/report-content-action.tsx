"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import { useAuth } from "@/shared/lib/auth";
import { submitContentReport, type ContentReportReason, type ReportableContentType } from "../api/content-reports";
import styles from "./report-content-action.module.scss";

type ReportContentActionProps = {
  authorId?: string;
  contextType?: "catalog" | "user-spot";
  contextId?: string;
  parentId?: string;
  targetId: string;
  targetType: ReportableContentType;
};

const reasons: ContentReportReason[] = ["spam", "abuse", "inaccurate", "privacy", "other"];

export function ReportContentAction({ authorId, contextId, contextType, parentId, targetId, targetType }: ReportContentActionProps) {
  const t = useTranslations("contentReports");
  const { isLoading, user } = useAuth();
  const formId = useId();
  const [reason, setReason] = useState<ContentReportReason>("inaccurate");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user && authorId === user.uid) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    setMessage("");
    try {
      await submitContentReport({ contextId, contextType, details, parentId, reason, reporterId: user.uid, targetId, targetType });
      setMessage(t("submitted"));
      setDetails("");
    } catch {
      setError(t("submitError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <details className={styles.disclosure}>
      <summary>{t("report")}</summary>
      {isLoading ? <p className={styles.note} aria-live="polite">{t("authChecking")}</p> : null}
      {!isLoading && !user ? <p className={styles.note}>{t("signInPrompt")} <Link href="/login">{t("signIn")}</Link></p> : null}
      {user ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor={`${formId}-reason`}>{t("reasonLabel")}</label>
          <select id={`${formId}-reason`} onChange={(event) => setReason(event.target.value as ContentReportReason)} value={reason}>
            {reasons.map((value) => <option key={value} value={value}>{t(`reasons.${value}`)}</option>)}
          </select>
          <label htmlFor={`${formId}-details`}>{t("detailsLabel")}</label>
          <textarea id={`${formId}-details`} maxLength={1200} onChange={(event) => setDetails(event.target.value)} value={details} />
          <button disabled={isSubmitting} type="submit">{isSubmitting ? t("sending") : t("submit")}</button>
        </form>
      ) : null}
      {message ? <p className={styles.success} role="status">{message}</p> : null}
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
    </details>
  );
}
