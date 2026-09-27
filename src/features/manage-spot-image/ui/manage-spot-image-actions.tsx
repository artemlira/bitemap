"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import type { SpotImage, SpotImageTargetType } from "@/entities/spot-image";
import { useAuth } from "@/shared/lib/auth";
import { deleteSpotImage, replaceSpotImage } from "../api/manage-spot-image";
import styles from "./manage-spot-image-actions.module.scss";

type ManageSpotImageActionsProps = {
  image: SpotImage;
  targetId: string;
  targetType: SpotImageTargetType;
};

export function ManageSpotImageActions({ image, targetId, targetType }: ManageSpotImageActionsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("gallery");
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [success, setSuccess] = useState("");

  if (!user || image.ownerId !== user.uid) {
    return null;
  }

  const imageOwner = user;

  async function handleDelete() {
    if (!window.confirm(t("deleteConfirmation"))) {
      return;
    }

    setError("");
    setSuccess("");
    setIsDeleting(true);

    try {
      await deleteSpotImage(image.id, await imageOwner.getIdToken());
      setSuccess(t("deleteSuccess"));
    } catch {
      setError(t("manageError"));
    } finally {
      setIsDeleting(false);
    }
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  async function handleReplace(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || isDeleting || isReplacing) {
      return;
    }

    setError("");
    setSuccess("");
    setIsReplacing(true);

    try {
      await replaceSpotImage({
        file,
        idToken: await imageOwner.getIdToken(),
        image,
        targetId,
        targetType,
      });
      setSuccess(t("replaceSuccess"));
    } catch {
      setError(t("manageError"));
    } finally {
      setIsReplacing(false);
    }
  }

  return (
    <div className={styles.controls}>
      <input
        ref={inputRef}
        accept="image/*"
        className={styles.fileInput}
        onChange={handleReplace}
        type="file"
      />
      <button
        disabled={isDeleting || isReplacing}
        className={styles.replace}
        onClick={openFilePicker}
        type="button"
      >
        {isReplacing ? t("replacing") : t("replace")}
      </button>
      <button disabled={isDeleting || isReplacing} onClick={handleDelete} type="button">
        {isDeleting ? t("deleting") : t("delete")}
      </button>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      {success ? <p className={styles.success} role="status">{success}</p> : null}
    </div>
  );
}
