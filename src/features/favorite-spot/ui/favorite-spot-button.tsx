"use client";

import { Link } from "@/shared/lib/i18n";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import type { FishingSpot } from "@/entities/fishing-spot";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import { useAuth } from "@/shared/lib/auth";
import styles from "./favorite-spot-button.module.scss";

type FavoriteSnapshot = {
  isFavorite: boolean;
  ownerId: string | null;
};

type FavoriteSpotButtonProps = {
  spot: FishingSpot;
};

const initialSnapshot: FavoriteSnapshot = {
  isFavorite: false,
  ownerId: null,
};

export function FavoriteSpotButton({ spot }: FavoriteSpotButtonProps) {
  const t = useTranslations("favorite");
  const { isLoading: isAuthLoading, user } = useAuth();
  const [favoriteSnapshot, setFavoriteSnapshot] = useState<FavoriteSnapshot>(initialSnapshot);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const userId = user?.uid;
  const isFavorite = favoriteSnapshot.ownerId === userId && favoriteSnapshot.isFavorite;
  const isFavoriteLoading = Boolean(userId && favoriteSnapshot.ownerId !== userId);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const favoriteReference = doc(getFirebaseFirestore(), "users", userId, "favorites", spot.id);

    return onSnapshot(
      favoriteReference,
      (snapshot) => {
        setFavoriteSnapshot({ isFavorite: snapshot.exists(), ownerId: userId });
        setError("");
      },
      () => {
        setFavoriteSnapshot({ isFavorite: false, ownerId: userId });
        setError(t("loadError"));
      },
    );
  }, [spot.id, t, userId]);

  if (!user && !isAuthLoading) {
    return (
      <Link className={styles.signInLink} href="/login">
        {t("signIn")}
      </Link>
    );
  }

  if (!user) {
    return <span className={styles.loadingLabel}>{t("checking")}</span>;
  }

  async function toggleFavorite() {
    if (!user) {
      return;
    }

    const favoriteReference = doc(getFirebaseFirestore(), "users", user.uid, "favorites", spot.id);

    setError("");
    setIsUpdating(true);

    try {
      if (isFavorite) {
        await deleteDoc(favoriteReference);
      } else {
        await setDoc(favoriteReference, {
          createdAt: serverTimestamp(),
          spotId: spot.id,
        });
      }
    } catch {
      setError(t("updateError"));
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
        type="button"
        aria-pressed={isFavorite}
        disabled={isUpdating || isFavoriteLoading}
        onClick={() => void toggleFavorite()}
      >
        <span aria-hidden="true">{isFavorite ? "♥" : "♡"}</span>
        {isUpdating ? t("updating") : isFavorite ? t("saved") : t("save")}
      </button>
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
