export type FishingArticleSection = {
  heading: string;
  paragraphs: readonly string[];
  tips?: readonly string[];
};

export type FishingArticleTranslation = {
  title: string;
  excerpt: string;
  category: string;
  sections: readonly FishingArticleSection[];
};

export type FishingArticle = {
  slug: string;
  readMinutes: number;
  tone: "lagoon" | "sunset" | "river";
  translations: {
    uk: FishingArticleTranslation;
    en: FishingArticleTranslation;
  };
};

export type FishingArticleStatus = "draft" | "published";

export type ManagedFishingArticle = FishingArticle & {
  status: FishingArticleStatus;
  authorId: string;
  updatedAt?: number;
  isBuiltIn?: boolean;
};
