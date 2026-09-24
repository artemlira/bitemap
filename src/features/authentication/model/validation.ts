import type { AuthMode } from "../api/email-password";

export type AuthFormValues = {
  confirmPassword: string;
  email: string;
  password: string;
};

export type AuthFormErrors = Partial<Record<keyof AuthFormValues, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthForm(mode: AuthMode, values: AuthFormValues): AuthFormErrors {
  const errors: AuthFormErrors = {};

  if (!emailPattern.test(values.email.trim())) {
    errors.email = "Введи коректну електронну пошту.";
  }

  if (values.password.length < 8) {
    errors.password = "Пароль має містити щонайменше 8 символів.";
  }

  if (mode === "register" && values.password !== values.confirmPassword) {
    errors.confirmPassword = "Паролі не збігаються.";
  }

  return errors;
}
