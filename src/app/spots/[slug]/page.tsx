import { redirect } from "next/navigation";

export default async function SpotPage(props: PageProps<"/spots/[slug]">) {
  const { slug } = await props.params;
  redirect(`/uk/spots/${slug}`);
}
