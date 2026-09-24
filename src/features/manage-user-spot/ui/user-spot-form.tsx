"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { UserSpotFormValues } from "@/entities/user-spot";
import { useAuth } from "@/shared/lib/auth";
import { createUserSpot, updateUserSpot } from "../api/user-spots";
import { validateUserSpot, type UserSpotFormErrors } from "../model/validation";
import styles from "./user-spot-form.module.scss";

type UserSpotFormProps = {
  initialValues?: UserSpotFormValues;
  mode: "create" | "edit";
  spotId?: string;
};

const defaultValues: UserSpotFormValues = {
  access: "Вільний доступ",
  description: "",
  fish: "",
  name: "",
  region: "",
  tone: "lagoon",
  waterType: "",
};

const tones = [
  { value: "lagoon", label: "Блакитна вода" },
  { value: "sunset", label: "Теплий захід" },
  { value: "river", label: "Річкові береги" },
  { value: "reeds", label: "Очерет і зелень" },
] as const;

export function UserSpotForm({ initialValues = defaultValues, mode, spotId }: UserSpotFormProps) {
  const { isLoading: isAuthLoading, user } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState<UserSpotFormValues>(initialValues);
  const [errors, setErrors] = useState<UserSpotFormErrors>({});
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = mode === "edit";

  function updateValue(name: keyof UserSpotFormValues, value: string) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionError("");

    const nextErrors = validateUserSpot(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !user) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && spotId) {
        await updateUserSpot(spotId, values);
      } else {
        await createUserSpot(user.uid, values);
      }

      router.push("/my-spots");
    } catch {
      setSubmissionError("Не вдалося зберегти водойму. Перевір з’єднання та спробуй ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user && !isAuthLoading) {
    return (
      <div className={styles.signInNotice}>
        <p>Увійди, щоб додавати власні водойми.</p>
        <Link href="/login">Увійти в BiteMap</Link>
      </div>
    );
  }

  if (!user) {
    return <p className={styles.loading}>Перевіряємо акаунт…</p>;
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit} aria-busy={isSubmitting}>
      <div className={styles.grid}>
        <label className={styles.field} htmlFor="user-spot-name">
          <span>Назва водойми</span>
          <input
            id="user-spot-name"
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={errors.name ? "user-spot-name-error" : undefined}
          />
          {errors.name ? <small id="user-spot-name-error">{errors.name}</small> : null}
        </label>

        <label className={styles.field} htmlFor="user-spot-region">
          <span>Область або населений пункт</span>
          <input
            id="user-spot-region"
            value={values.region}
            onChange={(event) => updateValue("region", event.target.value)}
            aria-invalid={Boolean(errors.region) || undefined}
            aria-describedby={errors.region ? "user-spot-region-error" : undefined}
          />
          {errors.region ? <small id="user-spot-region-error">{errors.region}</small> : null}
        </label>

        <label className={styles.field} htmlFor="user-spot-water-type">
          <span>Тип водойми</span>
          <input
            id="user-spot-water-type"
            placeholder="Наприклад, озеро або річка"
            value={values.waterType}
            onChange={(event) => updateValue("waterType", event.target.value)}
            aria-invalid={Boolean(errors.waterType) || undefined}
            aria-describedby={errors.waterType ? "user-spot-water-type-error" : undefined}
          />
          {errors.waterType ? <small id="user-spot-water-type-error">{errors.waterType}</small> : null}
        </label>

        <label className={styles.field} htmlFor="user-spot-access">
          <span>Доступ</span>
          <select
            id="user-spot-access"
            value={values.access}
            onChange={(event) => updateValue("access", event.target.value)}
          >
            <option>Вільний доступ</option>
            <option>Платна водойма</option>
            <option>Уточнюйте правила</option>
          </select>
        </label>

        <label className={styles.field} htmlFor="user-spot-fish">
          <span>Риба</span>
          <input
            id="user-spot-fish"
            placeholder="Щука, окунь, короп"
            value={values.fish}
            onChange={(event) => updateValue("fish", event.target.value)}
            aria-invalid={Boolean(errors.fish) || undefined}
            aria-describedby={errors.fish ? "user-spot-fish-error" : undefined}
          />
          {errors.fish ? <small id="user-spot-fish-error">{errors.fish}</small> : null}
        </label>

        <label className={styles.field} htmlFor="user-spot-tone">
          <span>Настрій картки</span>
          <select
            id="user-spot-tone"
            value={values.tone}
            onChange={(event) => updateValue("tone", event.target.value)}
          >
            {tones.map((tone) => (
              <option key={tone.value} value={tone.value}>
                {tone.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.field} htmlFor="user-spot-description">
        <span>Короткий опис</span>
        <textarea
          id="user-spot-description"
          rows={5}
          value={values.description}
          onChange={(event) => updateValue("description", event.target.value)}
          aria-invalid={Boolean(errors.description) || undefined}
          aria-describedby={errors.description ? "user-spot-description-error" : undefined}
        />
        {errors.description ? <small id="user-spot-description-error">{errors.description}</small> : null}
      </label>

      {submissionError ? <p className={styles.error} role="alert">{submissionError}</p> : null}

      <div className={styles.actions}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Зберігаємо…" : isEditing ? "Зберегти зміни" : "Додати водойму"}
        </button>
        <Link href="/my-spots">Скасувати</Link>
      </div>
    </form>
  );
}
