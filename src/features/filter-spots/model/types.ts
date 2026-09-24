export type SpotFilterName = "region" | "waterType" | "fish";

export type SpotFilters = Record<SpotFilterName, string>;

export type SpotFilterOptions = Record<SpotFilterName, readonly string[]>;

export type SpotFilterSearchParams = Record<string, string | string[] | undefined>;
