// Server-only entry: reads the full open-data catalog (about 1.6 MB), so never import it from client code.
export { getAllFishingSpotSlugs, getCatalogStats, getFeaturedFishingSpots, getFishingSpotBySlug, getNearbyFishingSpots } from "./model/catalog-server";
export type { NearbySpot } from "./model/catalog-server";
