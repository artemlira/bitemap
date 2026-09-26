import { redirect } from "next/navigation";

export default async function Page(props: PageProps<"/my-spots/[spotId]/edit">) {
  const { spotId } = await props.params;
  redirect(`/uk/my-spots/${spotId}/edit`);
}
