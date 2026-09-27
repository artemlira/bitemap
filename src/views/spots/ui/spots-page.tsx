"use client";

import { useCallback, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FishingSpotCard, fishingSpots, getFishingSpotFish, getFishingSpotText, type FishingSpot } from "@/entities/fishing-spot";
import { UserSpotCard, getUserSpotFish, getUserSpotText, usePublishedUserSpots, type UserSpot } from "@/entities/user-spot";
import { SpotFilterBar, useSpotFilters, type FilterableSpot, type SpotFilters } from "@/features/filter-spots";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./spots-page.module.scss";

type SpotsPageProps = {
  initialFilters: SpotFilters;
};

type CatalogSpot =
  | { kind: "catalog"; spot: FishingSpot }
  | { kind: "community"; spot: UserSpot };

export function SpotsPage({ initialFilters }: SpotsPageProps) {
  const locale = useLocale();
  const t = useTranslations("spots");
  const { error, isLoading: isCommunityLoading, spots: communitySpots } = usePublishedUserSpots();
  const catalogSpots = useMemo<readonly CatalogSpot[]>(
    () => [
      ...fishingSpots.map((spot) => ({ kind: "catalog" as const, spot })),
      ...communitySpots.map((spot) => ({ kind: "community" as const, spot })),
    ],
    [communitySpots],
  );
  const getFilterableSpot = useCallback(
    (entry: CatalogSpot): FilterableSpot => {
      if (entry.kind === "catalog") {
        const { spot } = entry;
        const name = getFishingSpotText(spot, "name", locale);
        const region = getFishingSpotText(spot, "region", locale);

        return {
          fish: getFishingSpotFish(spot, locale),
          region,
          searchText: [name, region, spot.name, spot.region].join(" "),
          waterType: getFishingSpotText(spot, "waterType", locale),
        };
      }

      const { spot } = entry;
      const name = getUserSpotText(spot, "name", locale);
      const waterType = getUserSpotText(spot, "waterType", locale);

      return {
        fish: getUserSpotFish(spot, locale),
        region: spot.region,
        searchText: [name, spot.name, spot.region, spot.community, spot.settlement, waterType, spot.waterType]
          .filter(Boolean)
          .join(" "),
        waterType,
      };
    },
    [locale],
  );
  const {
    filters,
    filteredSpots,
    hasActiveFilters,
    options,
    resetFilters,
    setFilter,
  } = useSpotFilters(catalogSpots, getFilterableSpot, initialFilters);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent} data-page-hero>
          <p className={styles.eyebrow}>{t("catalog")}</p>
          <h1>{t("title")}</h1>
          <p>{t("lead")}</p>
        </div>
      </section>

      <section className={styles.catalog} aria-labelledby="spots-title">
        <div className={styles.catalogHeading}>
          <div>
            <p className={styles.sectionLabel}>{t("direction")}</p>
            <h2 id="spots-title">{t("all")}</h2>
          </div>
          <p className={styles.counter} aria-live="polite">
            {isCommunityLoading ? t("loading") : t("count", { count: filteredSpots.length })}
          </p>
        </div>

        <SpotFilterBar
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          options={options}
          onChange={setFilter}
          onReset={resetFilters}
        />

        {error ? <p className={styles.error} role="alert">{t("communityLoadError")}</p> : null}

        {filteredSpots.length > 0 ? (
          <div className={styles.grid}>
            {filteredSpots.map((entry) => (
              entry.kind === "catalog" ? (
                <FishingSpotCard key={`catalog-${entry.spot.id}`} spot={entry.spot} href={`/spots/${entry.spot.slug}`} />
              ) : (
                <UserSpotCard
                  key={`community-${entry.spot.id}`}
                  spot={entry.spot}
                  href={`/community/${entry.spot.id}`}
                  actionLabel={t("openCommunitySpot")}
                  showVisibility={false}
                />
              )
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <h3>{t("noResults")}</h3>
            <p>{t("noResultsText")}</p>
            <button type="button" onClick={resetFilters}>
              {t("resetFilters")}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
