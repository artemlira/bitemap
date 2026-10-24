import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HomePage } from "@/views/home";

export async function generateMetadata(props: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { uk: "/uk", en: "/en", "x-default": "/uk" },
    },
  };
}

export default function Page() {
  return <HomePage />;
}
