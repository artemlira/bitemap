import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSpotFiltersFromSearchParams } from "@/features/filter-spots";
import { SpotsPage } from "@/views/spots";

export async function generateMetadata(props: PageProps<"/[locale]/spots">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "spots" });
  return {
    title: t("seoTitle"),
    description: t("lead"),
    alternates: {
      canonical: `/${locale}/spots`,
      languages: { uk: "/uk/spots", en: "/en/spots", "x-default": "/uk/spots" },
    },
    openGraph: {
      title: t("seoTitle"),
      description: t("lead"),
      url: `/${locale}/spots`,
      type: "website",
      siteName: "BiteMap",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("seoTitle"),
      description: t("lead"),
      images: ["/opengraph-image"],
    },
  };
}

export default async function Page(props: PageProps<"/[locale]/spots">) {
  const searchParams = await props.searchParams;

  return <SpotsPage initialFilters={getSpotFiltersFromSearchParams(searchParams)} />;
}
