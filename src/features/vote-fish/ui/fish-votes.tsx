"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import { FISH_SPECIES, getFishLabel } from "@/entities/fishing-spot";
import { useFishVotes } from "../model/use-fish-votes";
import styles from "./fish-votes.module.scss";

const CONFIRMED_AT = 2;

export function FishVotes({ spotId }: { spotId: string }) {
  const t = useTranslations("fishVotes");
  const locale = useLocale();
  const { counts, mine, status, isSignedIn, save } = useFishVotes(spotId);
  const [isEditing, setIsEditing] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  function startEditing() {
    setSelection(mine);
    setSaveError(false);
    setIsEditing(true);
  }

  function toggle(name: string) {
    setSelection((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : current.length < 12 ? [...current, name] : current,
    );
  }

  async function handleSave() {
    setIsSaving(true);
    setSaveError(false);
    try {
      await save(selection);
      setIsEditing(false);
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.block} id="spot-fish-votes">
      <h3>{t("title")}</h3>

      {status === "error" ? <p className={styles.note} role="alert">{t("loadError")}</p> : null}

      {counts.length > 0 ? (
        <ul className={styles.list}>
          {counts.map(({ name, count }) => (
            <li key={name} data-confirmed={count >= CONFIRMED_AT}>
              <span>{getFishLabel(name, locale)}</span>
              <b>{count}</b>
            </li>
          ))}
        </ul>
      ) : status === "ready" ? (
        <p className={styles.note}>{t("empty")}</p>
      ) : null}

      {counts.length > 0 ? <p className={styles.note}>{t("legend", { count: CONFIRMED_AT })}</p> : null}

      {isEditing ? (
        <div className={styles.editor}>
          <p>{t("pick")}</p>
          <div className={styles.options} role="group" aria-label={t("pick")}>
            {FISH_SPECIES.map((name) => (
              <button key={name} type="button" aria-pressed={selection.includes(name)} onClick={() => toggle(name)}>
                {getFishLabel(name, locale)}
              </button>
            ))}
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.primary} disabled={isSaving} onClick={() => void handleSave()}>
              {isSaving ? t("saving") : t("save")}
            </button>
            <button type="button" className={styles.secondary} onClick={() => setIsEditing(false)}>
              {t("cancel")}
            </button>
          </div>
          {saveError ? <p className={styles.note} role="alert">{t("saveError")}</p> : null}
        </div>
      ) : isSignedIn ? (
        <button type="button" className={styles.primary} data-ripple onClick={startEditing}>
          {mine.length > 0 ? t("edit") : t("add")}
        </button>
      ) : (
        <Link className={styles.primary} href="/login">
          {t("signIn")}
        </Link>
      )}
    </div>
  );
}
