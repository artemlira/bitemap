"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { SpotImageTargetType } from "@/entities/spot-image";
import { useAuth } from "@/shared/lib/auth";
import { uploadSpotImage } from "../api/upload-spot-image";
import styles from "./spot-image-upload.module.scss";

type SpotImageUploadProps = {
  targetId: string;
  targetType: SpotImageTargetType;
};

export function SpotImageUpload({ targetId, targetType }: SpotImageUploadProps) {
  const t = useTranslations("imageUpload");
  const { user } = useAuth();
  const [captionEn, setCaptionEn] = useState("");
  const [captionUk, setCaptionUk] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const formId = `spot-image-upload-${targetType}-${targetId}`;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError(t("signIn"));
      return;
    }

    if (!file) {
      setError(t("chooseImage"));
      return;
    }

    setIsUploading(true);

    try {
      const idToken = await user.getIdToken();
      await uploadSpotImage({ captionEn, captionUk, file, idToken, ownerId: user.uid, targetId, targetType });
      setCaptionEn("");
      setCaptionUk("");
      setFile(null);
      setSuccess(t("success"));
      event.currentTarget.reset();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : t("error"));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className={styles.disclosure}>
      <button
        aria-controls={formId}
        aria-expanded={isOpen}
        className={styles.trigger}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        type="button"
      >
        {isOpen ? t("hideForm") : t("openForm")}
      </button>
      <div hidden={!isOpen} id={formId}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>{t("title")}</h3>
          <p>{t("description")}</p>
          <label>
            <span>{t("file")}</span>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          <label>
            <span>{t("captionUk")}</span>
            <input value={captionUk} onChange={(event) => setCaptionUk(event.target.value)} />
          </label>
          <label>
            <span>{t("captionEn")}</span>
            <input value={captionEn} onChange={(event) => setCaptionEn(event.target.value)} />
          </label>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          {success ? <p className={styles.success} role="status">{success}</p> : null}
          <button type="submit" disabled={isUploading}>{isUploading ? t("uploading") : t("openForm")}</button>
        </form>
      </div>
    </section>
  );
}
