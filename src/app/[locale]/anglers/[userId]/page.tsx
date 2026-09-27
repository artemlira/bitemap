import { AnglerProfilePage } from "@/views/angler-profile";

export default async function Page(props: PageProps<"/[locale]/anglers/[userId]">) {
  const { userId } = await props.params;

  return <AnglerProfilePage userId={userId} />;
}
