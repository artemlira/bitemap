"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut as signOutFromFirebase, type User } from "firebase/auth";
import { getFirebaseAuth, hasFirebaseConfiguration } from "@/shared/api/firebase";

type AuthContextValue = {
  isLoading: boolean;
  signOut: () => Promise<void>;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(hasFirebaseConfiguration);

  useEffect(() => {
    if (!hasFirebaseConfiguration()) {
      return;
    }

    return onAuthStateChanged(getFirebaseAuth(), (nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });
  }, []);

  async function signOut() {
    await signOutFromFirebase(getFirebaseAuth());
  }

  return <AuthContext value={{ isLoading, signOut, user }}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
