import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const requiredConfigKeys = ["apiKey", "authDomain", "projectId", "appId"] as const;

export class FirebaseConfigurationError extends Error {
  constructor() {
    super("Firebase configuration is missing.");
    this.name = "FirebaseConfigurationError";
  }
}

export function hasFirebaseConfiguration() {
  return requiredConfigKeys.every((key) => Boolean(firebaseConfig[key]));
}

export function getFirebaseApp(): FirebaseApp {
  if (!hasFirebaseConfiguration()) {
    throw new FirebaseConfigurationError();
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getFirebaseFirestore() {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorage() {
  if (!firebaseConfig.storageBucket) {
    throw new FirebaseConfigurationError();
  }

  return getStorage(getFirebaseApp());
}
