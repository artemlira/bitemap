"use client";

import { useState, type FormEvent } from "react";
import {
  authenticateWithGoogle,
  authenticateWithEmailPassword,
  getAuthErrorMessage,
  type AuthMode,
} from "../api/email-password";
import { validateAuthForm, type AuthFormErrors, type AuthFormValues } from "../model/validation";
import styles from "./auth-form.module.scss";

type AuthFormProps = {
  mode: AuthMode;
};

const emptyValues: AuthFormValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

export function AuthForm({ mode }: AuthFormProps) {
  const [values, setValues] = useState<AuthFormValues>(emptyValues);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [submissionError, setSubmissionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submissionMethod, setSubmissionMethod] = useState<"email" | "google" | null>(null);

  const isRegistration = mode === "register";
  const submitLabel = isRegistration ? "Створити акаунт" : "Увійти";
  const isSubmitting = submissionMethod !== null;

  function updateValue(name: keyof AuthFormValues, value: string) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionError("");
    setSuccessMessage("");

    const nextErrors = validateAuthForm(mode, values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmissionMethod("email");

    try {
      const credential = await authenticateWithEmailPassword({
        email: values.email.trim(),
        mode,
        password: values.password,
      });

      setSuccessMessage(
        isRegistration
          ? `Акаунт ${credential.user.email ?? ""} створено. Тепер ти можеш додавати власні записи.`
          : `Ти увійшов як ${credential.user.email ?? ""}.`,
      );
    } catch (error) {
      setSubmissionError(getAuthErrorMessage(error));
    } finally {
      setSubmissionMethod(null);
    }
  }

  async function handleGoogleSignIn() {
    setSubmissionError("");
    setSuccessMessage("");
    setSubmissionMethod("google");

    try {
      const credential = await authenticateWithGoogle();

      setSuccessMessage(`Ти увійшов як ${credential.user.email ?? "користувач"}.`);
    } catch (error) {
      setSubmissionError(getAuthErrorMessage(error));
    } finally {
      setSubmissionMethod(null);
    }
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit} aria-busy={isSubmitting}>
      <label className={styles.field} htmlFor="auth-email">
        <span>Електронна пошта</span>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => updateValue("email", event.target.value)}
          aria-invalid={Boolean(errors.email) || undefined}
          aria-describedby={errors.email ? "auth-email-error" : undefined}
        />
        {errors.email ? (
          <small id="auth-email-error" role="alert">
            {errors.email}
          </small>
        ) : null}
      </label>

      <label className={styles.field} htmlFor="auth-password">
        <span>Пароль</span>
        <input
          id="auth-password"
          type="password"
          autoComplete={isRegistration ? "new-password" : "current-password"}
          value={values.password}
          onChange={(event) => updateValue("password", event.target.value)}
          aria-invalid={Boolean(errors.password) || undefined}
          aria-describedby={errors.password ? "auth-password-error" : undefined}
        />
        {errors.password ? (
          <small id="auth-password-error" role="alert">
            {errors.password}
          </small>
        ) : null}
      </label>

      {isRegistration ? (
        <label className={styles.field} htmlFor="auth-confirm-password">
          <span>Повтори пароль</span>
          <input
            id="auth-confirm-password"
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(event) => updateValue("confirmPassword", event.target.value)}
            aria-invalid={Boolean(errors.confirmPassword) || undefined}
            aria-describedby={errors.confirmPassword ? "auth-confirm-password-error" : undefined}
          />
          {errors.confirmPassword ? (
            <small id="auth-confirm-password-error" role="alert">
              {errors.confirmPassword}
            </small>
          ) : null}
        </label>
      ) : null}

      {submissionError ? (
        <p className={styles.errorMessage} role="alert">
          {submissionError}
        </p>
      ) : null}

      {successMessage ? (
        <p className={styles.successMessage} role="status">
          {successMessage}
        </p>
      ) : null}

      <button type="submit" disabled={isSubmitting}>
        {submissionMethod === "email" ? "Зачекай…" : submitLabel}
      </button>

      <p className={styles.divider}>або</p>

      <button
        className={styles.googleButton}
        type="button"
        disabled={isSubmitting}
        onClick={handleGoogleSignIn}
      >
        <span aria-hidden="true">G</span>
        {submissionMethod === "google" ? "Відкриваємо Google…" : "Продовжити з Google"}
      </button>
    </form>
  );
}
