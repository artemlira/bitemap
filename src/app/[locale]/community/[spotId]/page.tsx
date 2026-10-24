import type { Metadata } from "next";
import { CommunitySpotDetailsPage } from "@/views/community-spot-details";
import { noIndexMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default async function Page(props: PageProps<"/[locale]/community/[spotId]">) {
  const { spotId } = await props.params;

  return <CommunitySpotDetailsPage spotId={spotId} />;
}
