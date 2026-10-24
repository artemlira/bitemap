import type { Metadata } from "next";
import { MySpotsPage } from "@/views/my-spots";
import { noIndexMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default function Page() {
  return <MySpotsPage />;
}
