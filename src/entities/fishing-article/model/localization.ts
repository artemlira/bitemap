import { fishingArticles } from "./article-data";
import type { FishingArticle, FishingArticleTranslation } from "./types";

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
        paragraphs: section.paragraphs.map((paragraph, paragraphIndex) =>
          translatedSection?.paragraphs[paragraphIndex]?.trim() || paragraph,
        ),
        ...(section.tips
          ? {
              tips: section.tips.map((tip, tipIndex) => translatedSection?.tips?.[tipIndex]?.trim() || tip),
            }
          : {}),
      };
    }),
  };
}

export function getFishingArticleBySlug(slug: string): FishingArticle | undefined {
  return fishingArticles.find((article) => article.slug === slug);
}
