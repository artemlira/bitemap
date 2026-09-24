import type { Metadata } from "next";
import { UserSpotFormPage } from "@/views/user-spot-form";

export const metadata: Metadata = {
  title: "Редагувати водойму — BiteMap",
};

export default async function Page(props: PageProps<"/my-spots/[spotId]/edit">) {
  const { spotId } = await props.params;

  return <UserSpotFormPage mode="edit" spotId={spotId} />;
}
