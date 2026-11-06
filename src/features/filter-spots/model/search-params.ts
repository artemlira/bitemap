import type { SpotFilterSearchParams, SpotFilters } from "./types";

function getFirstSearchParamValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export function getSpotFiltersFromSearchParams(searchParams: SpotFilterSearchParams): SpotFilters {
  const access = getFirstSearchParamValue(searchParams.access);
  const sort = getFirstSearchParamValue(searchParams.sort);

  return {
    query: getFirstSearchParamValue(searchParams.query),
    region: getFirstSearchParamValue(searchParams.region),
    waterType: getFirstSearchParamValue(searchParams.waterType),
    fish: getFirstSearchParamValue(searchParams.fish),
    access: ["free", "paid", "restricted", "unknown"].includes(access) ? access : "",
    sort: ["recommended", "name", "updated"].includes(sort) ? sort : "recommended",
  };
}
