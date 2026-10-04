"use client";

import { useState, type FormEvent } from "react";
import { fishingArticles, type FishingArticle, type FishingArticleSection, type FishingArticleStatus } from "@/entities/fishing-article";
import { saveFishingArticle } from "../api/manage-fishing-article";
import styles from "./fishing-article-editor.module.scss";

type SectionDraft = {
  key: string;
  headingUk: string;
  headingEn: string;
  paragraphsUk: string;
  paragraphsEn: string;
  tipsUk: string;
  tipsEn: string;
};

type ArticleDraft = {
  slug: string;
  readMinutes: string;
  tone: FishingArticle["tone"];
  status: FishingArticleStatus;
  titleUk: string;
  excerptUk: string;
  categoryUk: string;
  titleEn: string;
  excerptEn: string;
  categoryEn: string;
  sections: SectionDraft[];
};

type FishingArticleEditorProps = {
  article?: FishingArticle & { status?: FishingArticleStatus };
  authorId: string;
  labels: Record<string, string>;
};

function toLines(value: string) {
  return value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
}

function toTips(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function sectionToDraft(section?: FishingArticleSection, translated?: FishingArticleSection, index = 0): SectionDraft {
  return {
    key: `section-${index + 1}`,
    headingUk: section?.heading ?? "",
    headingEn: translated?.heading ?? "",
    paragraphsUk: section?.paragraphs.join("\n\n") ?? "",
    paragraphsEn: translated?.paragraphs.join("\n\n") ?? "",
    tipsUk: section?.tips?.join("\n") ?? "",
    tipsEn: translated?.tips?.join("\n") ?? "",
  };
}

function initialDraft(article?: FishingArticle & { status?: FishingArticleStatus }): ArticleDraft {
  const english = article?.translations.en;

  return {
    slug: article?.slug ?? "",
    readMinutes: String(article?.readMinutes ?? 5),
    tone: article?.tone ?? "lagoon",
    status: article?.status ?? "draft",
    titleUk: article?.translations.uk.title ?? "",
    excerptUk: article?.translations.uk.excerpt ?? "",
    categoryUk: article?.translations.uk.category ?? "",
    titleEn: english?.title ?? "",
    excerptEn: english?.excerpt ?? "",
    categoryEn: english?.category ?? "",
    sections: article?.translations.uk.sections.map((section, index) =>
      sectionToDraft(section, english?.sections[index], index),
    ) ?? [sectionToDraft()],
  };
}

export function FishingArticleEditor({ article, authorId, labels }: FishingArticleEditorProps) {
  const [draft, setDraft] = useState(() => initialDraft(article));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isEditing = Boolean(article);

  function updateDraft<K extends keyof ArticleDraft>(key: K, value: ArticleDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateSection(key: string, field: keyof Omit<SectionDraft, "key">, value: string) {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section) => section.key === key ? { ...section, [field]: value } : section),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const translations = {
        uk: {
          title: draft.titleUk.trim(),
          excerpt: draft.excerptUk.trim(),
          category: draft.categoryUk.trim(),
          sections: draft.sections.map((section) => ({
            heading: section.headingUk.trim(),
            paragraphs: toLines(section.paragraphsUk),
            ...(toTips(section.tipsUk).length > 0 ? { tips: toTips(section.tipsUk) } : {}),
          })),
        },
        en: {
          title: draft.titleEn.trim(),
          excerpt: draft.excerptEn.trim(),
          category: draft.categoryEn.trim(),
          sections: draft.sections.map((section) => ({
            heading: section.headingEn.trim(),
            paragraphs: toLines(section.paragraphsEn),
            ...(toTips(section.tipsEn).length > 0 ? { tips: toTips(section.tipsEn) } : {}),
          })),
        },
      };

      await saveFishingArticle({
        slug: draft.slug.trim(),
        readMinutes: Number(draft.readMinutes),
        tone: draft.tone,
        translations,
      }, draft.status, authorId, Boolean(isEditing && fishingArticles.some((builtInArticle) => builtInArticle.slug === article?.slug)));
      setSuccess(labels.saved);
    } catch {
      setError(labels.saveError);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
      <section className={styles.panel} aria-labelledby="article-settings-title">
        <h2 id="article-settings-title">{labels.settings}</h2>
        <div className={styles.grid}>
          <label className={styles.field}>
            {labels.slug}
            <input
              autoComplete="off"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              required
              disabled={isEditing}
              value={draft.slug}
              onChange={(event) => updateDraft("slug", event.target.value)}
              placeholder="feeder-basics"
            />
            <span className={styles.hint}>{labels.slugHint}</span>
          </label>
          <label className={styles.field}>
            {labels.status}
            <select className={styles.status} value={draft.status} onChange={(event) => updateDraft("status", event.target.value as FishingArticleStatus)}>
              <option value="draft">{labels.draft}</option>
              <option value="published">{labels.published}</option>
            </select>
          </label>
          <label className={styles.field}>
            {labels.readMinutes}
            <input type="number" min="1" max="60" required value={draft.readMinutes} onChange={(event) => updateDraft("readMinutes", event.target.value)} />
          </label>
          <label className={styles.field}>
            {labels.tone}
            <select className={styles.status} value={draft.tone} onChange={(event) => updateDraft("tone", event.target.value as FishingArticle["tone"])}>
              <option value="lagoon">{labels.toneLagoon}</option>
              <option value="sunset">{labels.toneSunset}</option>
              <option value="river">{labels.toneRiver}</option>
            </select>
          </label>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="article-uk-title">
        <h2 id="article-uk-title">{labels.ukrainian}</h2>
        <label className={styles.field}>{labels.title}<input required value={draft.titleUk} onChange={(event) => updateDraft("titleUk", event.target.value)} /></label>
        <div className={styles.grid}>
          <label className={styles.field}>{labels.category}<input required value={draft.categoryUk} onChange={(event) => updateDraft("categoryUk", event.target.value)} /></label>
          <label className={styles.field}>{labels.excerpt}<textarea required value={draft.excerptUk} onChange={(event) => updateDraft("excerptUk", event.target.value)} /></label>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="article-en-title">
        <h2 id="article-en-title">{labels.english}</h2>
        <p className={styles.hint}>{labels.translationHint}</p>
        <label className={styles.field}>{labels.titleEn}<input value={draft.titleEn} onChange={(event) => updateDraft("titleEn", event.target.value)} /></label>
        <div className={styles.grid}>
          <label className={styles.field}>{labels.categoryEn}<input value={draft.categoryEn} onChange={(event) => updateDraft("categoryEn", event.target.value)} /></label>
          <label className={styles.field}>{labels.excerptEn}<textarea value={draft.excerptEn} onChange={(event) => updateDraft("excerptEn", event.target.value)} /></label>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="article-sections-title">
        <div className={styles.sectionHeader}>
          <h2 id="article-sections-title">{labels.sections}</h2>
          <button className={styles.secondary} type="button" onClick={() => setDraft((current) => ({
            ...current,
            sections: [...current.sections, { ...sectionToDraft(), key: `section-${crypto.randomUUID()}` }],
          }))}>{labels.addSection}</button>
        </div>
        <p className={styles.hint}>{labels.paragraphHint}</p>
        {draft.sections.map((section, index) => (
          <fieldset className={styles.section} key={section.key}>
            <legend className={styles.hint}>{labels.section} {index + 1}</legend>
            <div className={styles.sectionHeader}>
              <h3>{labels.ukrainian}</h3>
              {draft.sections.length > 1 ? <button className={styles.danger} type="button" onClick={() => setDraft((current) => ({ ...current, sections: current.sections.filter((item) => item.key !== section.key) }))}>{labels.removeSection}</button> : null}
            </div>
            <label className={styles.field}>{labels.heading}<input required value={section.headingUk} onChange={(event) => updateSection(section.key, "headingUk", event.target.value)} /></label>
            <label className={styles.field}>{labels.paragraphs}<textarea required value={section.paragraphsUk} onChange={(event) => updateSection(section.key, "paragraphsUk", event.target.value)} /></label>
            <label className={styles.field}>{labels.tips}<textarea value={section.tipsUk} onChange={(event) => updateSection(section.key, "tipsUk", event.target.value)} /></label>
            <div className={styles.sectionHeader}><h3>{labels.english}</h3></div>
            <label className={styles.field}>{labels.headingEn}<input value={section.headingEn} onChange={(event) => updateSection(section.key, "headingEn", event.target.value)} /></label>
            <label className={styles.field}>{labels.paragraphsEn}<textarea value={section.paragraphsEn} onChange={(event) => updateSection(section.key, "paragraphsEn", event.target.value)} /></label>
            <label className={styles.field}>{labels.tipsEn}<textarea value={section.tipsEn} onChange={(event) => updateSection(section.key, "tipsEn", event.target.value)} /></label>
          </fieldset>
        ))}
      </section>

      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      {success ? <p className={styles.message} role="status">{success}</p> : null}
      <div className={styles.actions}>
        <button className={styles.primary} type="submit" disabled={isSaving}>{isSaving ? labels.saving : isEditing ? labels.save : labels.create}</button>
      </div>
    </form>
  );
}
