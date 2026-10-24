import type { Metadata } from "next";
import { UserSpotFormPage } from "@/views/user-spot-form";
import { noIndexMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default function Page() {
  return <UserSpotFormPage mode="create" />;
}
