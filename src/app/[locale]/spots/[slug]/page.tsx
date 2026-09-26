import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFishingSpotBySlug, fishingSpots } from "@/entities/fishing-spot";
import { SpotDetailsPage } from "@/views/spot-details";

export function generateStaticParams() {
  return ["uk", "en"].flatMap((locale) => fishingSpots.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/spots/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const spot = getFishingSpotBySlug(slug);

  return spot
    ? { title: `${spot.name} — BiteMap`, description: `${spot.region}. ${spot.description}` }
    : { title: "BiteMap" };
}

export default async function SpotPage(props: PageProps<"/[locale]/spots/[slug]">) {
  const { slug } = await props.params;
  const spot = getFishingSpotBySlug(slug);

  if (!spot) {
    notFound();
  }

  return <SpotDetailsPage spot={spot} />;
}
