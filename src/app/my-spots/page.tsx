import type { Metadata } from "next";
import { MySpotsPage } from "@/views/my-spots";

export const metadata: Metadata = {
  title: "Мої водойми — BiteMap",
  description: "Приватні водойми, додані користувачем у BiteMap.",
};

export default function Page() {
  return <MySpotsPage />;
}
