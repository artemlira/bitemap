import type { Metadata } from "next";
import { getFishingArticleBySlug, getFishingArticleTranslation, fishingArticles } from "@/entities/fishing-article";
import { ArticleDetailsPage } from "@/views/article-details";

export function generateStaticParams() {
  return ["uk", "en"].flatMap((locale) => fishingArticles.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata(props: PageProps<"/[locale]/articles/[slug]">): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const article = getFishingArticleBySlug(slug);

  if (!article) return { title: "BiteMap" };

  const content = getFishingArticleTranslation(article, locale);
  return {
    title: `${content.title} — BiteMap`,
    description: content.excerpt,
    alternates: {
      canonical: `/${locale}/articles/${slug}`,
      languages: {
        uk: `/uk/articles/${slug}`,
        en: `/en/articles/${slug}`,
        "x-default": `/uk/articles/${slug}`,
      },
    },
    openGraph: {
      title: `${content.title} — BiteMap`,
      description: content.excerpt,
      type: "article",
      siteName: "BiteMap",
      url: `/${locale}/articles/${slug}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${content.title} — BiteMap`,
      description: content.excerpt,
      images: ["/opengraph-image"],
    },
  };
}

export default async function Page(props: PageProps<"/[locale]/articles/[slug]">) {
  const { slug } = await props.params;
  return <ArticleDetailsPage slug={slug} />;
}
