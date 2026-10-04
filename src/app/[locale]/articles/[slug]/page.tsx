import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  return { title: `${content.title} — BiteMap`, description: content.excerpt };
}

export default async function Page(props: PageProps<"/[locale]/articles/[slug]">) {
  const { slug } = await props.params;
  const article = getFishingArticleBySlug(slug);

  if (!article) notFound();

  return <ArticleDetailsPage article={article} />;
}
