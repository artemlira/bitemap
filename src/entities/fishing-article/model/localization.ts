import { fishingArticles } from "./article-data";
import type { FishingArticle, FishingArticleTranslation } from "./types";

export function getFishingArticleTranslation(article: FishingArticle, locale: string): FishingArticleTranslation {
  return locale === "en" ? article.translations.en : article.translations.uk;
}

export function getFishingArticleBySlug(slug: string): FishingArticle | undefined {
  return fishingArticles.find((article) => article.slug === slug);
}
