"use client";

import type { User } from "firebase/auth";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { SpotImageTargetType } from "@/entities/spot-image";
import { useAuth } from "@/shared/lib/auth";
import { Link } from "@/shared/lib/i18n";
import { uploadSpotImage } from "../api/upload-spot-image";
import styles from "./spot-image-upload.module.scss";

type SpotImageUploadProps = {
  targetId: string;
  targetType: SpotImageTargetType;
};

export function SpotImageUpload({ targetId, targetType }: SpotImageUploadProps) {
  const t = useTranslations("imageUpload");
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <p className={styles.authState} aria-live="polite">{t("authLoading")}</p>;
  }

  if (!user) {
    return (
      <section className={styles.authPrompt}>
        <p>{t("signInLead")}</p>
        <Link href="/login">{t("signInAction")}</Link>
      </section>
    );
  }

  return <AuthenticatedSpotImageUpload key={user.uid} targetId={targetId} targetType={targetType} user={user} />;
}

type AuthenticatedSpotImageUploadProps = SpotImageUploadProps & {
  user: User;
};

function AuthenticatedSpotImageUpload({ targetId, targetType, user }: AuthenticatedSpotImageUploadProps) {
  const t = useTranslations("imageUpload");
  const [captionEn, setCaptionEn] = useState("");
  const [captionUk, setCaptionUk] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const formId = `spot-image-upload-${targetType}-${targetId}`;
  const fileInputId = `${formId}-file`;
  const fileLabelId = `${formId}-file-label`;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

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
          <div className={styles.fileField}>
            <span id={fileLabelId}>{t("file")}</span>
            <div className={styles.fileControl}>
              <input
                aria-labelledby={fileLabelId}
                accept="image/*"
                className={styles.fileInput}
                id={fileInputId}
                onChange={handleFileChange}
                type="file"
              />
              <label className={styles.filePicker} htmlFor={fileInputId}>{t("chooseFile")}</label>
              <span className={styles.fileName} aria-live="polite">{file?.name ?? t("noFileSelected")}</span>
            </div>
          </div>
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
