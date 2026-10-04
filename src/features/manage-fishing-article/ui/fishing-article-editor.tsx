"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { User } from "firebase/auth";
import DOMPurify from "isomorphic-dompurify";
import { calculateFishingArticleReadMinutes, fishingArticles, type FishingArticle, type FishingArticleSection, type FishingArticleStatus } from "@/entities/fishing-article";
import { saveFishingArticle } from "../api/manage-fishing-article";
import { RichTextField } from "./rich-text-field";
import styles from "./fishing-article-editor.module.scss";

type SectionDraft = { key: string; headingUk: string; headingEn: string; contentUk: string; contentEn: string };
type ArticleDraft = {
  slug: string;
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
type FishingArticleEditorProps = { article?: FishingArticle & { status?: FishingArticleStatus }; authorId: string; labels: Record<string, string>; user: User | null };

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function sectionContent(section?: FishingArticleSection) {
  if (!section) return "<p></p>";
  if (section.contentHtml) return section.contentHtml;
  const paragraphs = (section.paragraphs ?? []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const tips = section.tips?.length ? `<ul>${section.tips.map((tip) => `<li><p>${escapeHtml(tip)}</p></li>`).join("")}</ul>` : "";
  return paragraphs + tips || "<p></p>";
}

function sectionToDraft(section?: FishingArticleSection, translated?: FishingArticleSection, index = 0): SectionDraft {
  return {
    key: `section-${index + 1}`,
    headingUk: section?.heading ?? "",
    headingEn: translated?.heading ?? "",
    contentUk: sectionContent(section),
    contentEn: sectionContent(translated),
  };
}

function initialDraft(article?: FishingArticle & { status?: FishingArticleStatus }): ArticleDraft {
  const english = article?.translations.en;
  return {
    slug: article?.slug ?? "",
    tone: article?.tone ?? "lagoon",
    status: article?.status ?? "draft",
    titleUk: article?.translations.uk.title ?? "",
    excerptUk: article?.translations.uk.excerpt ?? "",
    categoryUk: article?.translations.uk.category ?? "",
    titleEn: english?.title ?? "",
    excerptEn: english?.excerpt ?? "",
    categoryEn: english?.category ?? "",
    sections: article?.translations.uk.sections.map((section, index) => sectionToDraft(section, english?.sections[index], index)) ?? [sectionToDraft()],
  };
}

function textFromHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/&(?:nbsp|#160);/gi, " ").trim();
}

function cleanHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "h2", "h3", "ul", "ol", "li", "strong", "em", "s", "blockquote", "hr", "br", "img", "a"],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel"],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|\/(?!\/)|#)/i,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["style", "script", "iframe", "object", "embed"],
  });
}

export function FishingArticleEditor({ article, authorId, labels, user }: FishingArticleEditorProps) {
  const [draft, setDraft] = useState(() => initialDraft(article));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isEditing = Boolean(article);
  const estimatedMinutes = useMemo(() => {
    return calculateFishingArticleReadMinutes({
      uk: { title: draft.titleUk, excerpt: draft.excerptUk, category: draft.categoryUk, sections: draft.sections.map((section) => ({ heading: section.headingUk, contentHtml: section.contentUk })) },
      en: { title: draft.titleEn, excerpt: draft.excerptEn, category: draft.categoryEn, sections: draft.sections.map((section) => ({ heading: section.headingEn, contentHtml: section.contentEn })) },
    });
  }, [draft]);

  function updateDraft<K extends keyof ArticleDraft>(key: K, value: ArticleDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateSection(key: string, field: keyof Omit<SectionDraft, "key">, value: string) {
    setDraft((current) => ({ ...current, sections: current.sections.map((section) => section.key === key ? { ...section, [field]: value } : section) }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      if (draft.sections.some((section) => !textFromHtml(section.contentUk).trim())) throw new Error("missing-content");
      const translations = {
        uk: {
          title: draft.titleUk.trim(),
          excerpt: draft.excerptUk.trim(),
          category: draft.categoryUk.trim(),
          sections: draft.sections.map((section) => ({ heading: section.headingUk.trim(), paragraphs: [], contentHtml: cleanHtml(section.contentUk) })),
        },
        en: {
          title: draft.titleEn.trim(),
          excerpt: draft.excerptEn.trim(),
          category: draft.categoryEn.trim(),
          sections: draft.sections.map((section) => ({ heading: section.headingEn.trim(), paragraphs: [], contentHtml: cleanHtml(section.contentEn) })),
        },
      };

      await saveFishingArticle({ slug: draft.slug.trim(), readMinutes: estimatedMinutes, tone: draft.tone, translations }, draft.status, authorId,
        Boolean(isEditing && fishingArticles.some((builtInArticle) => builtInArticle.slug === article?.slug)));
      setSuccess(labels.saved);
    } catch (caught) {
      setError(caught instanceof Error && caught.message === "missing-content" ? labels.requiredContent : labels.saveError);
    } finally {
      setIsSaving(false);
    }
  }

  const richTextProps = {
    user,
    slug: draft.slug,
    imageLabel: labels.insertImage,
    imageAltPrompt: labels.imageAltPrompt,
    linkLabel: labels.insertLink,
    imageButtonLabel: labels.imageButton,
    uploadingLabel: labels.uploading,
    uploadErrorLabel: labels.uploadError,
    toolbarLabels: labels.toolbar as unknown as Record<string, string>,
  };

  return (
    <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
      <section className={styles.panel} aria-labelledby="article-settings-title">
        <h2 id="article-settings-title">{labels.settings}</h2>
        <div className={styles.grid}>
          <label className={styles.field}>{labels.slug}<input autoComplete="off" pattern="[a-z0-9]+(-[a-z0-9]+)*" required disabled={isEditing} value={draft.slug} onChange={(event) => updateDraft("slug", event.target.value)} placeholder="feeder-basics" /><span className={styles.hint}>{labels.slugHint}</span></label>
          <label className={styles.field}>{labels.status}<select className={styles.status} value={draft.status} onChange={(event) => updateDraft("status", event.target.value as FishingArticleStatus)}><option value="draft">{labels.draft}</option><option value="published">{labels.published}</option></select></label>
          <label className={styles.field}>{labels.tone}<select className={styles.status} value={draft.tone} onChange={(event) => updateDraft("tone", event.target.value as FishingArticle["tone"])}><option value="lagoon">{labels.toneLagoon}</option><option value="sunset">{labels.toneSunset}</option><option value="river">{labels.toneRiver}</option></select></label>
          <div className={styles.readingTime}><span>{labels.readMinutes}</span><strong>{estimatedMinutes} {labels.minutes}</strong><small>{labels.readingTimeHint}</small></div>
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
        <div className={styles.sectionHeader}><h2 id="article-sections-title">{labels.sections}</h2><button className={styles.secondary} type="button" onClick={() => setDraft((current) => ({ ...current, sections: [...current.sections, { ...sectionToDraft(), key: `section-${crypto.randomUUID()}` }] }))}>{labels.addSection}</button></div>
        <p className={styles.hint}>{labels.paragraphHint}</p>
        {draft.sections.map((section, index) => (
          <fieldset className={styles.section} key={section.key}>
            <legend className={styles.hint}>{labels.section} {index + 1}</legend>
            <div className={styles.sectionHeader}><h3>{labels.ukrainian}</h3>{draft.sections.length > 1 ? <button className={styles.danger} type="button" onClick={() => setDraft((current) => ({ ...current, sections: current.sections.filter((item) => item.key !== section.key) }))}>{labels.removeSection}</button> : null}</div>
            <label className={styles.field}>{labels.heading}<input required value={section.headingUk} onChange={(event) => updateSection(section.key, "headingUk", event.target.value)} /></label>
            <RichTextField {...richTextProps} label={labels.contentUk} value={section.contentUk} onChange={(value) => updateSection(section.key, "contentUk", value)} />
            <div className={styles.sectionHeader}><h3>{labels.english}</h3></div>
            <label className={styles.field}>{labels.headingEn}<input value={section.headingEn} onChange={(event) => updateSection(section.key, "headingEn", event.target.value)} /></label>
            <RichTextField {...richTextProps} label={labels.contentEn} value={section.contentEn} onChange={(value) => updateSection(section.key, "contentEn", value)} />
          </fieldset>
        ))}
      </section>

      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      {success ? <p className={styles.message} role="status">{success}</p> : null}
      <div className={styles.actions}><button className={styles.primary} type="submit" disabled={isSaving}>{isSaving ? labels.saving : isEditing ? labels.save : labels.create}</button></div>
    </form>
  );
}
