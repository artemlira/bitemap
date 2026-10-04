import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArticlesPage } from "@/views/articles";

export async function generateMetadata(props: PageProps<"/[locale]/articles">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "articles" });

  return { title: t("pageTitle"), description: t("pageDescription") };
}

export default function Page() {
  return <ArticlesPage />;
}
