import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArticlesPage } from "@/views/articles";

export async function generateMetadata(props: PageProps<"/[locale]/articles">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "articles" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: {
      canonical: `/${locale}/articles`,
      languages: { uk: "/uk/articles", en: "/en/articles", "x-default": "/uk/articles" },
    },
    openGraph: {
      title: `${t("pageTitle")} — BiteMap`,
      description: t("pageDescription"),
      url: `/${locale}/articles`,
      type: "website",
      siteName: "BiteMap",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("pageTitle")} — BiteMap`,
      description: t("pageDescription"),
      images: ["/opengraph-image"],
    },
  };
}

export default function Page() {
  return <ArticlesPage />;
}
