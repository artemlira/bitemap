"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { SpotImageTargetType } from "@/entities/spot-image";
import { useAuth } from "@/shared/lib/auth";
import { uploadSpotImage } from "../api/upload-spot-image";
import styles from "./spot-image-upload.module.scss";

type SpotImageUploadProps = {
  targetId: string;
  targetType: SpotImageTargetType;
};

export function SpotImageUpload({ targetId, targetType }: SpotImageUploadProps) {
  const { user } = useAuth();
  const [captionEn, setCaptionEn] = useState("");
  const [captionUk, setCaptionUk] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Увійди, щоб додати фотографію.");
      return;
    }

    if (!file) {
      setError("Обери зображення.");
      return;
    }

    setIsUploading(true);

    try {
      const idToken = await user.getIdToken();
      await uploadSpotImage({ captionEn, captionUk, file, idToken, ownerId: user.uid, targetId, targetType });
      setCaptionEn("");
      setCaptionUk("");
      setFile(null);
      setSuccess("Фотографію додано до галереї.");
      event.currentTarget.reset();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Не вдалося додати фотографію.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Додати фотографію</h3>
      <p>До 5 МБ. Український підпис є основним, англійський — необов’язковий.</p>
      <label>
        <span>Зображення</span>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>
      <label>
        <span>Підпис українською</span>
        <input value={captionUk} onChange={(event) => setCaptionUk(event.target.value)} />
      </label>
      <label>
        <span>Caption in English</span>
        <input value={captionEn} onChange={(event) => setCaptionEn(event.target.value)} />
      </label>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      {success ? <p className={styles.success} role="status">{success}</p> : null}
      <button type="submit" disabled={isUploading}>{isUploading ? "Завантажуємо…" : "Додати фото"}</button>
    </form>
  );
}
