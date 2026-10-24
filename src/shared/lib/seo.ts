import type { Metadata } from "next";

export const isSearchIndexingEnabled = process.env.BITEMAP_SEARCH_INDEXING_ENABLED === "true";

export const siteRobotsMetadata: Pick<Metadata, "robots"> = {
  robots: isSearchIndexingEnabled
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export const noIndexMetadata: Pick<Metadata, "robots"> = {
  robots: { index: false, follow: false },
};
