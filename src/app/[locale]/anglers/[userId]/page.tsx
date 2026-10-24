import type { Metadata } from "next";
import { AnglerProfilePage } from "@/views/angler-profile";
import { noIndexMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default async function Page(props: PageProps<"/[locale]/anglers/[userId]">) {
  const { userId } = await props.params;

  return <AnglerProfilePage userId={userId} />;
}
