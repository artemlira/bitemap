import { redirect } from "next/navigation";

export default async function Page(props: PageProps<"/community/[spotId]">) {
  const { spotId } = await props.params;
  redirect(`/uk/community/${spotId}`);
}
