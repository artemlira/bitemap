"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { syncUserProfile } from "@/entities/user";
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
  const credential =
    mode === "register"
      ? await createUserWithEmailAndPassword(auth, email, password)
      : await signInWithEmailAndPassword(auth, email, password);

  await syncUserProfile(credential.user);

  return credential;
}

export async function authenticateWithGoogle() {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({ prompt: "select_account" });

  const credential = await signInWithPopup(auth, provider);

  await syncUserProfile(credential.user);

  return credential;
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
      case "auth/popup-blocked":
        return "Браузер заблокував вікно Google. Дозволь pop-up і спробуй ще раз.";
      case "auth/popup-closed-by-user":
        return "Вхід через Google скасовано.";
      case "auth/account-exists-with-different-credential":
        return "Для цієї пошти вже використовується інший спосіб входу.";
      case "permission-denied":
        return "Вхід виконано, але Firestore не дозволив створити профіль. Перевір Rules.";
      default:
        return "Не вдалося виконати авторизацію. Спробуй ще раз.";
    }
  }

  return "Не вдалося виконати авторизацію. Спробуй ще раз.";
}
