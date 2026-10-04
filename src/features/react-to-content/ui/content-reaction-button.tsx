"use client";

import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import { Link } from "@/shared/lib/i18n";
import { useAuth } from "@/shared/lib/auth";
import styles from "./content-reaction-button.module.scss";

type ReactionTargetType = "image" | "report";
type ContentReactionButtonProps = { targetId: string; targetType: ReactionTargetType };
type ReactionState = { count: number; ids: string[]; targetKey: string };

export function ContentReactionButton({ targetId, targetType }: ContentReactionButtonProps) {
  const t = useTranslations("reactions");
  const { isLoading: isAuthLoading, user } = useAuth();
  const [reactionState, setReactionState] = useState<ReactionState | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const targetKey = `${targetType}:${targetId}`;
  const state = reactionState?.targetKey === targetKey ? reactionState : null;
  const isReacted = Boolean(user && state?.ids.includes(user.uid));

  useEffect(() => {
    const db = getFirebaseFirestore();
    const parentCollection = targetType === "report" ? "fishing-reports" : "spot-images";
    return onSnapshot(
      collection(db, parentCollection, targetId, "reactions"),
      (snapshot) => {
        setReactionState({ count: snapshot.size, ids: snapshot.docs.map((reaction) => reaction.id), targetKey });
        setHasError(false);
      },
      () => {
        setHasError(true);
      },
    );
  }, [targetId, targetKey, targetType]);

  async function toggleReaction() {
    if (!user || !state || isUpdating) return;
    setHasError(false);
    setIsUpdating(true);
    const parentCollection = targetType === "report" ? "fishing-reports" : "spot-images";
    const reactionReference = doc(getFirebaseFirestore(), parentCollection, targetId, "reactions", user.uid);
    try {
      if (isReacted) {
        await deleteDoc(reactionReference);
      } else {
        await setDoc(reactionReference, { userId: user.uid, createdAt: serverTimestamp() });
      }
    } catch {
      setHasError(true);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      {user ? (
        <button
          aria-label={isReacted ? t("unlike") : t("like")}
          aria-pressed={isReacted}
          className={styles.button}
          disabled={isAuthLoading || !state || isUpdating || hasError}
          onClick={() => void toggleReaction()}
          type="button"
        >
          <span aria-hidden="true">{isReacted ? "♥" : "♡"}</span>
          <span>{state?.count ?? "…"}</span>
        </button>
      ) : isAuthLoading ? (
        <span className={styles.state}>{t("loading")}</span>
      ) : (
        <span className={styles.guest}>
          <span aria-hidden="true">♡</span> {state?.count ?? "…"} · <Link href="/login">{t("signIn")}</Link>
        </span>
      )}
      {hasError ? <span className={styles.error} role="status">{t("error")}</span> : null}
    </div>
  );
}
