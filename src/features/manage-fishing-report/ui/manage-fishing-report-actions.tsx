"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { FishingActivity, FishingReport } from "@/entities/fishing-report";
import { useAuth } from "@/shared/lib/auth";
import { deleteFishingReport, updateFishingReport, type FishingReportEditValues } from "../api/manage-fishing-report";
import styles from "./manage-fishing-report-actions.module.scss";

type ManageFishingReportActionsProps = {
  report: FishingReport;
};

function getLocalDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function getInitialValues(report: FishingReport): FishingReportEditValues {
  const english = report.translations?.en;

  return {
    activity: report.activity ?? "fair",
    bait: report.bait ?? "",
    baitEn: english?.bait ?? "",
    fish: report.fish.join(", "),
    fishEn: english?.fish?.join(", ") ?? "",
    impression: report.impression,
    impressionEn: english?.impression ?? "",
    method: report.method ?? "",
    methodEn: english?.method ?? "",
    rating: report.rating,
    tripDate: report.tripDate,
  };
}

export function ManageFishingReportActions({ report }: ManageFishingReportActionsProps) {
  const t = useTranslations("reports");
  const { isLoading, user } = useAuth();
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [values, setValues] = useState<FishingReportEditValues>(() => getInitialValues(report));
  const formId = `fishing-report-edit-${report.id}`;

  if (isLoading || !user || user.uid !== report.authorId) {
    return null;
  }

  function updateValue<Key extends keyof FishingReportEditValues>(key: Key, value: FishingReportEditValues[Key]) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
  }

  function cancelEditing() {
    setError("");
    setIsEditing(false);
    setValues(getInitialValues(report));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      await updateFishingReport(report.id, values);
      setIsEditing(false);
      setSuccess(t("updateSuccess"));
    } catch {
      setError(t("manageError"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(t("deleteConfirmation"))) {
      return;
    }

    setError("");
    setSuccess("");
    setIsDeleting(true);

    try {
      await deleteFishingReport(report.id);
    } catch {
      setError(t("manageError"));
      setIsDeleting(false);
    }
  }

  return (
    <section className={styles.controls}>
      <div className={styles.actions}>
        <button
          aria-controls={formId}
          aria-expanded={isEditing}
          disabled={isDeleting || isSaving}
          onClick={() => setIsEditing((currentValue) => !currentValue)}
          type="button"
        >
          {isEditing ? t("hideForm") : t("edit")}
        </button>
        <button disabled={isDeleting || isSaving} onClick={handleDelete} type="button">
          {isDeleting ? t("deleting") : t("delete")}
        </button>
      </div>

      {success ? <p className={styles.success} role="status">{success}</p> : null}
      {error ? <p className={styles.error} role="alert">{error}</p> : null}

      <div hidden={!isEditing} id={formId}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <h3>{t("editTitle")}</h3>
            <p>{t("formLead")}</p>
          </div>
          <div className={styles.grid}>
            <label>
              <span>{t("tripDate")}</span>
              <input max={getLocalDate()} onChange={(event) => updateValue("tripDate", event.target.value)} required type="date" value={values.tripDate} />
            </label>
            <label>
              <span>{t("rating")}</span>
              <select onChange={(event) => updateValue("rating", Number(event.target.value))} value={values.rating}>
                {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{t("ratingOption", { rating })}</option>)}
              </select>
            </label>
            <label>
              <span>{t("activity")}</span>
              <select onChange={(event) => updateValue("activity", event.target.value as FishingActivity)} value={values.activity}>
                {(["excellent", "good", "fair", "low"] as const).map((activity) => <option key={activity} value={activity}>{t(`activityOption.${activity}`)}</option>)}
              </select>
            </label>
          </div>
          <label>
            <span>{t("fish")}</span>
            <input onChange={(event) => updateValue("fish", event.target.value)} placeholder={t("fishPlaceholder")} value={values.fish} />
          </label>
          <label>
            <span>{t("method")}</span>
            <input onChange={(event) => updateValue("method", event.target.value)} placeholder={t("methodPlaceholder")} value={values.method} />
          </label>
          <label>
            <span>{t("bait")}</span>
            <input onChange={(event) => updateValue("bait", event.target.value)} placeholder={t("baitPlaceholder")} value={values.bait} />
          </label>
          <label>
            <span>{t("impression")}</span>
            <textarea onChange={(event) => updateValue("impression", event.target.value)} required value={values.impression} />
          </label>
          <fieldset>
            <legend>{t("translationLegend")}</legend>
            <p>{t("translationLead")}</p>
            <label>
              <span>{t("fishEn")}</span>
              <input onChange={(event) => updateValue("fishEn", event.target.value)} placeholder={t("fishPlaceholderEn")} value={values.fishEn} />
            </label>
            <label>
              <span>{t("methodEn")}</span>
              <input onChange={(event) => updateValue("methodEn", event.target.value)} placeholder={t("methodPlaceholderEn")} value={values.methodEn} />
            </label>
            <label>
              <span>{t("baitEn")}</span>
              <input onChange={(event) => updateValue("baitEn", event.target.value)} placeholder={t("baitPlaceholderEn")} value={values.baitEn} />
            </label>
            <label>
              <span>{t("impressionEn")}</span>
              <textarea onChange={(event) => updateValue("impressionEn", event.target.value)} value={values.impressionEn} />
            </label>
          </fieldset>
          <div className={styles.formActions}>
            <button disabled={isSaving} type="submit">{isSaving ? t("saving") : t("saveChanges")}</button>
            <button disabled={isSaving} onClick={cancelEditing} type="button">{t("cancel")}</button>
          </div>
        </form>
      </div>
    </section>
  );
}
