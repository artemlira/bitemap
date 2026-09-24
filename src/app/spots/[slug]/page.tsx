import type { Metadata } from "next";
import { getFishingSpotBySlug, fishingSpots } from "@/entities/fishing-spot";
import { notFound } from "next/navigation";
import { SpotDetailsPage } from "@/views/spot-details";

export function generateStaticParams() {
  return fishingSpots.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/spots/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const spot = getFishingSpotBySlug(slug);

  if (!spot) {
    return { title: "Водойму не знайдено — BiteMap" };
  }

  return {
    title: `${spot.name} — BiteMap`,
    description: `${spot.region}. ${spot.description}`,
  };
}

export default async function SpotPage(props: PageProps<"/spots/[slug]">) {
  const { slug } = await props.params;
  const spot = getFishingSpotBySlug(slug);

  if (!spot) {
    notFound();
  }

  return <SpotDetailsPage spot={spot} />;
}
