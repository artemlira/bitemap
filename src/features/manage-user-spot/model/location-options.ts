import { GeoAPI } from "ua-geo-set";

const geo = new GeoAPI();

export const regions = geo.getAllRegions().sort((first, second) => first.name.localeCompare(second.name, "uk"));

export function getCommunities(regionId: string) {
  return geo
    .getAllRegionDistricts(regionId)
    .flatMap((district) => geo.getAllCommunities(district.id))
    .sort((first, second) => first.name.localeCompare(second.name, "uk"));
}

export function getSettlements(communityId: string) {
  return geo
    .getAllSettlements({ communityId })
    .sort((first, second) => first.name.localeCompare(second.name, "uk"));
}
