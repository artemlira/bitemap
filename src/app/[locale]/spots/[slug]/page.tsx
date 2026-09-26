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

  return spot
    ? {
      title: `${getFishingSpotText(spot, "name", locale)} — BiteMap`,
      description: `${getFishingSpotText(spot, "region", locale)}. ${getFishingSpotText(spot, "description", locale)}`,
    }
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
