import type { Metadata } from "next";
import { CommunitySpotDetailsPage } from "@/views/community-spot-details";

export const metadata: Metadata = { title: "Водойма спільноти — BiteMap" };

export default async function Page(props: PageProps<"/community/[spotId]">) {
  const { spotId } = await props.params;
  return <CommunitySpotDetailsPage spotId={spotId} />;
}
