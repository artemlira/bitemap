import type { MetadataRoute } from "next";
import { fishingArticles } from "@/entities/fishing-article";
import { fishingSpots } from "@/entities/fishing-spot";
import { isSearchIndexingEnabled } from "@/shared/lib/seo";

const siteUrl = "https://bitemap.artemlira.com";
const locales = ["uk", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isSearchIndexingEnabled) return [];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const languages = {
      uk: `${siteUrl}/uk`,
      en: `${siteUrl}/en`,
      "x-default": `${siteUrl}/uk`,
    };

    for (const path of ["", "/spots", "/community", "/articles"]) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        alternates: {
          languages: Object.fromEntries(
            Object.entries(languages).map(([language, base]) => [language, `${base}${path}`]),
          ),
        },
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const { slug } of fishingArticles) {
      entries.push({
        url: `${siteUrl}/${locale}/articles/${slug}`,
        alternates: {
          languages: {
            uk: `${siteUrl}/uk/articles/${slug}`,
            en: `${siteUrl}/en/articles/${slug}`,
            "x-default": `${siteUrl}/uk/articles/${slug}`,
          },
        },
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    for (const { slug } of fishingSpots) {
      entries.push({
        url: `${siteUrl}/${locale}/spots/${slug}`,
        alternates: {
          languages: {
            uk: `${siteUrl}/uk/spots/${slug}`,
            en: `${siteUrl}/en/spots/${slug}`,
            "x-default": `${siteUrl}/uk/spots/${slug}`,
          },
        },
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
