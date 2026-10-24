import type { Metadata } from "next";
import { UserSpotFormPage } from "@/views/user-spot-form";
import { noIndexMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default async function Page(props: PageProps<"/[locale]/my-spots/[spotId]/edit">) {
  const { spotId } = await props.params;

  return <UserSpotFormPage mode="edit" spotId={spotId} />;
}
