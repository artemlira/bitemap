import type { Metadata } from "next";
import { FavoritesPage } from "@/views/favorites";

export const metadata: Metadata = {
  title: "Мої водойми — BiteMap",
  description: "Збережені водойми користувача BiteMap.",
};

export default function Page() {
  return <FavoritesPage />;
}
