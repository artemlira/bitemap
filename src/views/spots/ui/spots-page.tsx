"use client";

import { useTranslations } from "next-intl";
import { FishingSpotCard, fishingSpots } from "@/entities/fishing-spot";
import { SpotFilterBar, useSpotFilters, type SpotFilters } from "@/features/filter-spots";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./spots-page.module.scss";

type SpotsPageProps = {
  initialFilters: SpotFilters;
};

export function SpotsPage({ initialFilters }: SpotsPageProps) {
  const t = useTranslations("spots");
  const {
    filters,
    filteredSpots,
    hasActiveFilters,
    options,
    resetFilters,
    setFilter,
  } = useSpotFilters(fishingSpots, initialFilters);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent}>
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
            {t("count", { count: filteredSpots.length })}
          </p>
        </div>

        <SpotFilterBar
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          options={options}
          onChange={setFilter}
          onReset={resetFilters}
        />

        {filteredSpots.length > 0 ? (
          <div className={styles.grid}>
            {filteredSpots.map((spot) => (
            <FishingSpotCard key={spot.id} spot={spot} href={`/spots/${spot.slug}`} />
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
