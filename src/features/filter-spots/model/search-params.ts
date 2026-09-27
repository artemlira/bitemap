import type { SpotFilterSearchParams, SpotFilters } from "./types";

function getFirstSearchParamValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export function getSpotFiltersFromSearchParams(searchParams: SpotFilterSearchParams): SpotFilters {
  return {
    query: getFirstSearchParamValue(searchParams.query),
    region: getFirstSearchParamValue(searchParams.region),
    waterType: getFirstSearchParamValue(searchParams.waterType),
    fish: getFirstSearchParamValue(searchParams.fish),
  };
}
