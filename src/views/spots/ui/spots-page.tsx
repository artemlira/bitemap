"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FishingSpotCard, useCatalogIndex, getFishingSpotFish, getFishingSpotSettlement, getFishingSpotText, type FishingSpot } from "@/entities/fishing-spot";
import { UserSpotCard, getUserSpotFish, getUserSpotText, usePublishedUserSpots, type UserSpot } from "@/entities/user-spot";
import { SpotFilterBar, useSpotFilters, type FilterableSpot, type SpotFilters } from "@/features/filter-spots";
import { getSpotCoordinates } from "@/entities/spot-location";
import { Link } from "@/shared/lib/i18n";
import { SiteHeader } from "@/widgets/site-header";
import { SpotsMap } from "./spots-map";
import styles from "./spots-page.module.scss";

const PAGE_SIZE = 24;

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
  const { spots: fishingSpots, isLoading: isCatalogLoading, error: catalogError } = useCatalogIndex();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [view, setView] = useState<"list" | "map">("list");
  const catalogSpots = useMemo<readonly CatalogSpot[]>(
    () => [
      ...fishingSpots.map((spot) => ({ kind: "catalog" as const, spot })),
      ...communitySpots.map((spot) => ({ kind: "community" as const, spot })),
    ],
    [communitySpots, fishingSpots],
  );
  const getFilterableSpot = useCallback(
    (entry: CatalogSpot): FilterableSpot => {
      if (entry.kind === "catalog") {
        const { spot } = entry;
        const name = getFishingSpotText(spot, "name", locale);
        const region = getFishingSpotText(spot, "region", locale);

        return {
          accessCategory: spot.accessCategory ?? "unknown",
          fish: getFishingSpotFish(spot, locale),
          region,
          searchText: [name, region, spot.name, spot.region, spot.settlement, getFishingSpotSettlement(spot, "en")]
            .filter(Boolean)
            .join(" "),
          waterType: getFishingSpotText(spot, "waterType", locale),
          updatedAt: spot.updatedAt ? new Date(spot.updatedAt) : undefined,
        };
      }

      const { spot } = entry;
      const name = getUserSpotText(spot, "name", locale);
      const waterType = getUserSpotText(spot, "waterType", locale);

      return {
        accessCategory: spot.accessCategory ?? "unknown",
        fish: getUserSpotFish(spot, locale),
        region: spot.region,
        searchText: [name, spot.name, spot.region, spot.community, spot.settlement, waterType, spot.waterType]
          .filter(Boolean)
          .join(" "),
        waterType,
        updatedAt: spot.updatedAt,
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
  const mapSpots = useMemo(
    () => filteredSpots.flatMap((entry) => {
      if (entry.kind === "catalog") {
        const coordinates = getSpotCoordinates(entry.spot);
        if (!coordinates) return [];

        return [{
          ...coordinates,
          href: `/spots/${entry.spot.slug}`,
          id: `catalog-${entry.spot.id}`,
          name: getFishingSpotText(entry.spot, "name", locale),
          region: getFishingSpotText(entry.spot, "region", locale),
        }];
      }

      const coordinates = getSpotCoordinates(entry.spot);
      if (!coordinates) return [];

      return [{
        ...coordinates,
        href: `/community/${entry.spot.id}`,
        id: `community-${entry.spot.id}`,
        name: getUserSpotText(entry.spot, "name", locale),
        region: entry.spot.settlement
          ? `${entry.spot.region} · ${entry.spot.settlement}`
          : entry.spot.region,
      }];
    }),
    [filteredSpots, locale],
  );

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
        <h2 id="spots-title" className={styles.visuallyHidden}>{t("all")}</h2>

        <div className={styles.toolbar}>
          <SpotFilterBar
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            options={options}
            onChange={setFilter}
            onReset={resetFilters}
          />
        </div>

        <div className={styles.summary}>
          <p className={styles.counter} aria-live="polite">
            {isCommunityLoading || isCatalogLoading ? t("loading") : t("count", { count: filteredSpots.length })}
          </p>
          <div className={styles.viewToggle} role="group" aria-label={t("viewLabel")}>
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>{t("viewList")}</button>
            <button type="button" aria-pressed={view === "map"} onClick={() => setView("map")}>{t("viewMap")}</button>
          </div>
        </div>

        {error ? <p className={styles.error} role="alert">{t("communityLoadError")}</p> : null}
        {catalogError ? <p className={styles.error} role="alert">{t("catalogLoadError")}</p> : null}

        <div className={styles.workspace} data-view={view}>
          <div className={styles.listPane}>
            {filteredSpots.length > 0 ? (
              <div className={styles.grid} data-stagger>
                {filteredSpots.slice(0, visibleCount).map((entry) => (
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

            {filteredSpots.length > visibleCount ? (
              <div className={styles.loadMore}>
                <p>{t("shown", { shown: visibleCount, total: filteredSpots.length })}</p>
                <button type="button" data-ripple onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                  {t("loadMore")}
                </button>
              </div>
            ) : null}
          </div>

          <aside className={styles.mapPane} aria-labelledby="spots-map-title">
            <h3 id="spots-map-title" className={styles.visuallyHidden}>{t("mapTitle")}</h3>
            <SpotsMap key={view} spots={mapSpots} />
            <p className={styles.mapNote}>
              {t("mapCount", { count: mapSpots.length })}
              {mapSpots.length < filteredSpots.length
                ? ` · ${t("mapMissingCoordinates", { count: filteredSpots.length - mapSpots.length })}`
                : ""}
            </p>
          </aside>
        </div>

        <aside className={styles.addSpot}>
          <div>
            <h3>{t("addSpotTitle")}</h3>
            <p>{t("addSpotText")}</p>
          </div>
          <Link href="/my-spots/new" data-ripple>{t("addSpot")}</Link>
        </aside>
        <p className={styles.dataSource}>{t("dataSource")}</p>
      </section>
    </main>
  );
}
