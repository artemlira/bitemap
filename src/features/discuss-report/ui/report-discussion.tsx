"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useReportComments } from "@/entities/report-comment";
import type { FishingReport } from "@/entities/fishing-report";
import { Link } from "@/shared/lib/i18n";
import { useAuth } from "@/shared/lib/auth";
import { createReportComment, deleteReportComment } from "../api/report-comments";
import { ReportContentAction } from "@/features/content-report";
import styles from "./report-discussion.module.scss";

type ReportDiscussionProps = {
  report: FishingReport;
};

export function ReportDiscussion({ report }: ReportDiscussionProps) {
  const t = useTranslations("reportComments");
  const locale = useLocale();
  const { isLoading: isAuthLoading, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { comments, hasError, isLoading } = useReportComments(report.id, isOpen);
  const panelId = `report-discussion-${report.id}`;

  if (report.isPublic !== true) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || isSubmitting) return;

    setFormError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    const authorName = user.displayName?.trim() || user.email?.split("@")[0] || t("defaultAuthor");

    try {
      await createReportComment(report.id, user.uid, authorName, body);
      setBody("");
      setSuccessMessage(t("success"));
    } catch {
      setFormError(t("submitError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (!user || deletingCommentId) return;
    if (!window.confirm(t("deleteConfirmation"))) return;

    setFormError("");
    setDeletingCommentId(commentId);

    try {
      await deleteReportComment(report.id, commentId);
    } catch {
      setFormError(t("deleteError"));
    } finally {
      setDeletingCommentId(null);
    }
  }

  return (
    <section className={styles.discussion}>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className={styles.toggle}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span>{isOpen ? t("hide") : t("show")}</span>
        {isOpen && !isLoading && !hasError ? <span className={styles.count}>{comments.length}</span> : null}
      </button>

      <div className={styles.panel} hidden={!isOpen} id={panelId}>
        <h3>{t("title")}</h3>
        {isLoading ? <p className={styles.state} aria-live="polite">{t("loading")}</p> : null}
        {hasError ? <p className={styles.error} role="alert">{t("loadError")}</p> : null}
        {!isLoading && !hasError && comments.length === 0 ? <p className={styles.state}>{t("empty")}</p> : null}

        {comments.length > 0 ? (
          <ol className={styles.list} aria-label={t("listLabel")}>
            {comments.map((comment) => {
              const createdAt = comment.createdAt?.toDate();
              const date = createdAt ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(createdAt) : "";

              return (
                <li className={styles.comment} key={comment.id}>
                  <div className={styles.commentMeta}>
                    <Link href={`/anglers/${comment.authorId}`}>{comment.authorName}</Link>
                    {createdAt ? <time dateTime={createdAt.toISOString()}>{date}</time> : null}
                  </div>
                  <p>{comment.body}</p>
                  {user?.uid === comment.authorId ? (
                    <button
                      className={styles.delete}
                      disabled={deletingCommentId !== null}
                      onClick={() => void handleDelete(comment.id)}
                      type="button"
                    >
                      {deletingCommentId === comment.id ? t("deleting") : t("delete")}
                    </button>
                  ) : null}
                  {user?.uid !== comment.authorId ? <ReportContentAction contextId={report.targetId} contextType={report.targetType} parentId={report.id} targetType="comment" targetId={comment.id} /> : null}
                </li>
              );
            })}
          </ol>
        ) : null}

        {isAuthLoading ? <p className={styles.state} aria-live="polite">{t("authLoading")}</p> : null}
        {!isAuthLoading && !user ? (
          <p className={styles.signIn}>{t("signInText")} <Link href="/login">{t("signIn")}</Link></p>
        ) : null}
        {user ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor={`${panelId}-body`}>{t("label")}</label>
            <textarea
              id={`${panelId}-body`}
              maxLength={1200}
              onChange={(event) => setBody(event.target.value)}
              placeholder={t("placeholder")}
              required
              value={body}
            />
            <div className={styles.formFooter}>
              <span>{t("characterCount", { count: body.length })}</span>
              <button disabled={isSubmitting || body.trim().length === 0} type="submit">
                {isSubmitting ? t("submitting") : t("submit")}
              </button>
            </div>
          </form>
        ) : null}
        {successMessage ? <p className={styles.success} role="status">{successMessage}</p> : null}
        {formError ? <p className={styles.error} role="alert">{formError}</p> : null}
      </div>
    </section>
  );
}
