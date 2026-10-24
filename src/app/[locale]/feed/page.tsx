import type { Metadata } from "next";
import { ActivityFeedPage } from "@/views/activity-feed";
import { noIndexMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default function Page() {
  return <ActivityFeedPage />;
}
