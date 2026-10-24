import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CommunityPage } from "@/views/community";

export async function generateMetadata(props: PageProps<"/[locale]/community">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "community" });
  return {
    title: t("title"),
    description: t("lead"),
    alternates: {
      canonical: `/${locale}/community`,
      languages: { uk: "/uk/community", en: "/en/community", "x-default": "/uk/community" },
    },
    openGraph: {
      title: `${t("title")} — BiteMap`,
      description: t("lead"),
      url: `/${locale}/community`,
      type: "website",
      siteName: "BiteMap",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} — BiteMap`,
      description: t("lead"),
      images: ["/opengraph-image"],
    },
  };
}

export default function Page() {
  return <CommunityPage />;
}
