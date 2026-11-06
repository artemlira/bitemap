import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFishingSpotText } from "@/entities/fishing-spot";
import { getFishingSpotBySlug, getNearbyFishingSpots } from "@/entities/fishing-spot/server";
import { SpotDetailsPage } from "@/views/spot-details";

export async function generateMetadata(
  props: PageProps<"/[locale]/spots/[slug]">,
): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const spot = getFishingSpotBySlug(slug);

  if (!spot) return { title: "Rybomapa" };

  const title = `${getFishingSpotText(spot, "name", locale)} — Rybomapa`;
  const description = [getFishingSpotText(spot, "waterType", locale), getFishingSpotText(spot, "region", locale), getFishingSpotText(spot, "description", locale)].filter(Boolean).join(". ");
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
      siteName: "Rybomapa",
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

  return <SpotDetailsPage spot={spot} nearby={getNearbyFishingSpots(slug)} />;
}
