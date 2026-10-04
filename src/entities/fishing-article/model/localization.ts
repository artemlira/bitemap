import { fishingArticles } from "./article-data";
import type { FishingArticle, FishingArticleTranslation } from "./types";

function hasHtmlContent(value?: string) {
  return Boolean(value?.replace(/<[^>]*>/g, " ").replaceAll("&nbsp;", " ").trim());
}

export function getFishingArticleTranslation(article: FishingArticle, locale: string): FishingArticleTranslation {
  if (locale !== "en") return article.translations.uk;

  const english = article.translations.en;
  const ukrainian = article.translations.uk;

  return {
    title: english.title.trim() || ukrainian.title,
    excerpt: english.excerpt.trim() || ukrainian.excerpt,
    category: english.category.trim() || ukrainian.category,
    sections: ukrainian.sections.map((section, index) => {
      const translatedSection = english.sections[index];

      return {
        heading: translatedSection?.heading.trim() || section.heading,
        paragraphs: translatedSection?.paragraphs?.length
          ? translatedSection.paragraphs.map((paragraph, paragraphIndex) => paragraph.trim() || section.paragraphs?.[paragraphIndex] || "")
          : section.paragraphs ?? [],
        contentHtml: hasHtmlContent(translatedSection?.contentHtml) ? translatedSection?.contentHtml : section.contentHtml,
        ...(section.tips
          ? {
              tips: section.tips.map((tip, tipIndex) => translatedSection?.tips?.[tipIndex]?.trim() || tip),
            }
          : {}),
      };
    }),
  };
}

export function calculateFishingArticleReadMinutes(translations: FishingArticle["translations"]) {
  const content = translations.uk;
  const text = [content.title, content.excerpt, ...content.sections.flatMap((section) => [
    section.heading,
    ...(section.paragraphs ?? []),
    ...(section.tips ?? []),
    section.contentHtml?.replace(/<[^>]*>/g, " ").replace(/&(?:nbsp|#160);/gi, " ") ?? "",
  ])].join(" ");
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function getFishingArticleBySlug(slug: string): FishingArticle | undefined {
  return fishingArticles.find((article) => article.slug === slug);
}
