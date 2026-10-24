import type { Metadata } from "next";
import { FavoritesPage } from "@/views/favorites";
import { noIndexMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default function Page() {
  return <FavoritesPage />;
}
