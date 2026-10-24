import type { MetadataRoute } from "next";
import { isSearchIndexingEnabled } from "@/shared/lib/seo";

const siteUrl = "https://bitemap.artemlira.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    ...(isSearchIndexingEnabled ? { sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl } : {}),
  };
}
