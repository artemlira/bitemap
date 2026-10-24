import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isSearchIndexingEnabled = process.env.BITEMAP_SEARCH_INDEXING_ENABLED === "true";

const nextConfig: NextConfig = {
  distDir: process.env.BITEMAP_NEXT_DIST_DIR ?? ".next",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          ...(!isSearchIndexingEnabled ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
        protocol: "https",
      },
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
