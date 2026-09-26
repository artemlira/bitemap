import type { AuthMode } from "../api/email-password";

export type AuthFormValues = {
  confirmPassword: string;
  email: string;
  password: string;
};

export type AuthFormErrors = Partial<Record<keyof AuthFormValues, string>>;

export type AuthValidationMessages = {
  emailInvalid: string;
  passwordMismatch: string;
  passwordShort: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthForm(
  mode: AuthMode,
  values: AuthFormValues,
  messages: AuthValidationMessages,
): AuthFormErrors {
  const errors: AuthFormErrors = {};

  if (!emailPattern.test(values.email.trim())) {
    errors.email = messages.emailInvalid;
  }

  if (values.password.length < 8) {
    errors.password = messages.passwordShort;
  }

  if (mode === "register" && values.password !== values.confirmPassword) {
    errors.confirmPassword = messages.passwordMismatch;
  }

  return errors;
}
