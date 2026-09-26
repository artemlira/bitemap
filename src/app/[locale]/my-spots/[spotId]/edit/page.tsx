import { UserSpotFormPage } from "@/views/user-spot-form";

export default async function Page(props: PageProps<"/[locale]/my-spots/[spotId]/edit">) {
  const { spotId } = await props.params;

  return <UserSpotFormPage mode="edit" spotId={spotId} />;
}
