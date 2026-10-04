import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const requiredConfigKeys = ["apiKey", "authDomain", "projectId", "appId"] as const;
const useFirebaseEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";
const emulatorProjectId = "demo-bitemap";
let emulatorConnectedFirestore: ReturnType<typeof getFirestore> | null = null;

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

  if (useFirebaseEmulators && firebaseConfig.projectId !== emulatorProjectId) {
    throw new Error(`Firebase Emulator mode requires NEXT_PUBLIC_FIREBASE_PROJECT_ID=${emulatorProjectId}.`);
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  const auth = getAuth(getFirebaseApp());

  if (useFirebaseEmulators && !auth.emulatorConfig) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  }

  return auth;
}

export function getFirebaseFirestore() {
  const firestore = getFirestore(getFirebaseApp());

  if (useFirebaseEmulators && emulatorConnectedFirestore !== firestore) {
    connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
    emulatorConnectedFirestore = firestore;
  }

  return firestore;
}
