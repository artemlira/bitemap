import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getRegions } from "@/entities/fishing-spot/server";
import { RegionsPage } from "@/views/regions";

export async function generateMetadata(props: PageProps<"/[locale]/regions">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "regions" });
  return {
    title: `${t("title")} — Rybomapa`,
    description: t("lead"),
    alternates: { canonical: `/${locale}/regions`, languages: { uk: "/uk/regions", en: "/en/regions" } },
  };
}

export default function Page() {
  return <RegionsPage regions={getRegions()} />;
}
