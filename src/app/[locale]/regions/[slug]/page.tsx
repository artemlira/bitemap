import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRegionBySlug } from "@/entities/fishing-spot/server";
import { RegionPage } from "@/views/regions";

export async function generateMetadata(props: PageProps<"/[locale]/regions/[slug]">): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const region = getRegionBySlug(slug, 0);
  if (!region) return { title: "Rybomapa" };
  const name = region.summary.name[locale === "en" ? "en" : "uk"];
  return {
    title: `${name} — Rybomapa`,
    alternates: { canonical: `/${locale}/regions/${slug}`, languages: { uk: `/uk/regions/${slug}`, en: `/en/regions/${slug}` } },
  };
}

export default async function Page(props: PageProps<"/[locale]/regions/[slug]">) {
  const { slug } = await props.params;
  const region = getRegionBySlug(slug);
  if (!region) notFound();
  return <RegionPage region={region.summary} spots={region.spots} />;
}
