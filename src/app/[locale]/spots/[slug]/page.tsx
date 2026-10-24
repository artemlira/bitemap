import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFishingSpotBySlug, getFishingSpotText, fishingSpots } from "@/entities/fishing-spot";
import { SpotDetailsPage } from "@/views/spot-details";

export function generateStaticParams() {
  return ["uk", "en"].flatMap((locale) => fishingSpots.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/spots/[slug]">,
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const spot = getFishingSpotBySlug(slug);

  if (!spot) return { title: "BiteMap" };

  const title = `${getFishingSpotText(spot, "name", locale)} — BiteMap`;
  const description = `${getFishingSpotText(spot, "region", locale)}. ${getFishingSpotText(spot, "description", locale)}`;
  const url = `/${locale}/spots/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        uk: `/uk/spots/${slug}`,
        en: `/en/spots/${slug}`,
        "x-default": `/uk/spots/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "BiteMap",
      url,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "/opengraph-image", alt: title }],
    },
  };
}

export default async function SpotPage(props: PageProps<"/[locale]/spots/[slug]">) {
  const { slug } = await props.params;
  const spot = getFishingSpotBySlug(slug);

  if (!spot) {
    notFound();
  }

  return <SpotDetailsPage spot={spot} />;
}
