import { CommunitySpotDetailsPage } from "@/views/community-spot-details";

export default async function Page(props: PageProps<"/[locale]/community/[spotId]">) {
  const { spotId } = await props.params;

  return <CommunitySpotDetailsPage spotId={spotId} />;
}
