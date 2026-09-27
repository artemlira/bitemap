"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { FishingActivity, FishingReportTargetType } from "@/entities/fishing-report";
import { useAuth } from "@/shared/lib/auth";
import { createFishingReport, type FishingReportFormValues } from "../api/create-fishing-report";
import styles from "./create-fishing-report-form.module.scss";

type CreateFishingReportFormProps = {
  isPublic: boolean;
  targetId: string;
  targetType: FishingReportTargetType;
};

function getLocalDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

const initialValues: FishingReportFormValues = {
  activity: "good",
  bait: "",
  baitEn: "",
  fish: "",
  fishEn: "",
  impression: "",
  impressionEn: "",
  method: "",
  methodEn: "",
  rating: 5,
  tripDate: "",
};

export function CreateFishingReportForm({ isPublic, targetId, targetType }: CreateFishingReportFormProps) {
  const t = useTranslations("reports");
  const { isLoading: isAuthLoading, user } = useAuth();
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [values, setValues] = useState<FishingReportFormValues>({ ...initialValues, tripDate: getLocalDate() });
  const formId = `fishing-report-form-${targetType}-${targetId}`;

  function updateValue<Key extends keyof FishingReportFormValues>(key: Key, value: FishingReportFormValues[Key]) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError(t("signIn"));
      return;
    }

    setIsSubmitting(true);

    try {
      await createFishingReport({
        ...values,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split("@")[0] || t("defaultAuthor"),
        isPublic,
        targetId,
        targetType,
      });
      setValues({ ...initialValues, tripDate: getLocalDate() });
      setSuccess(t("success"));
      setIsOpen(false);
    } catch {
      setError(t("submissionError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAuthLoading) {
    return <p className={styles.authState} aria-live="polite">{t("authLoading")}</p>;
  }

  return (
    <section className={styles.disclosure}>
      <button
        aria-controls={formId}
        aria-expanded={isOpen}
        className={styles.trigger}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        type="button"
      >
        {isOpen ? t("hideForm") : t("openForm")}
      </button>
      {success ? <p className={styles.success} role="status">{success}</p> : null}
      <div hidden={!isOpen} id={formId}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <h3>{t("formTitle")}</h3>
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
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <button disabled={isSubmitting} type="submit">{isSubmitting ? t("submitting") : t("submit")}</button>
        </form>
      </div>
    </section>
  );
}
