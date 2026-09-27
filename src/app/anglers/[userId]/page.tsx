import { redirect } from "next/navigation";

export default async function Page(props: PageProps<"/anglers/[userId]">) {
  const { userId } = await props.params;
  redirect(`/uk/anglers/${userId}`);
}
