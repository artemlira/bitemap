import type { Metadata } from "next";
import { UserSpotFormPage } from "@/views/user-spot-form";

export const metadata: Metadata = {
  title: "Додати водойму — BiteMap",
  description: "Створи приватну картку власної водойми в BiteMap.",
};

export default function Page() {
  return <UserSpotFormPage mode="create" />;
}
