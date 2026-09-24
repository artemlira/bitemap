"use client";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseConfigurationError, getFirebaseAuth } from "@/shared/api/firebase";

export type AuthMode = "login" | "register";

type AuthenticateWithEmailPasswordParams = {
  email: string;
  mode: AuthMode;
  password: string;
};

export async function authenticateWithEmailPassword({
  email,
  mode,
  password,
}: AuthenticateWithEmailPasswordParams) {
  const auth = getFirebaseAuth();

  if (mode === "register") {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  return signInWithEmailAndPassword(auth, email, password);
}

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof FirebaseConfigurationError) {
    return "Firebase ще не налаштований. Додай значення до .env.local за зразком .env.example.";
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Ця електронна пошта вже зареєстрована.";
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Не вдалося увійти. Перевір електронну пошту та пароль.";
      case "auth/weak-password":
        return "Пароль занадто слабкий. Використай щонайменше 8 символів.";
      case "auth/operation-not-allowed":
        return "У Firebase потрібно ввімкнути вхід за електронною поштою та паролем.";
      default:
        return "Не вдалося виконати авторизацію. Спробуй ще раз.";
    }
  }

  return "Не вдалося виконати авторизацію. Спробуй ще раз.";
}
