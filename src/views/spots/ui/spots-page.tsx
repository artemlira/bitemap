"use client";

import { FishingSpotCard, fishingSpots } from "@/entities/fishing-spot";
import { SpotFilterBar, useSpotFilters, type SpotFilters } from "@/features/filter-spots";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./spots-page.module.scss";

type SpotsPageProps = {
  initialFilters: SpotFilters;
};

export function SpotsPage({ initialFilters }: SpotsPageProps) {
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
          <p className={styles.eyebrow}>Каталог водойм</p>
          <h1>Місця, куди хочеться вирушити ще до світанку.</h1>
          <p>
            Знаходь локації за регіоном, типом водойми або рибою. Карта, погода й відгуки
            спільноти з’являться після підключення бекенду.
          </p>
        </div>
      </section>

      <section className={styles.catalog} aria-labelledby="spots-title">
        <div className={styles.catalogHeading}>
          <div>
            <p className={styles.sectionLabel}>Обери напрямок</p>
            <h2 id="spots-title">Усі водойми</h2>
          </div>
          <p className={styles.counter} aria-live="polite">
            Локацій: {filteredSpots.length}
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
            <h3>Нічого не знайшли</h3>
            <p>Спробуй інше поєднання фільтрів або скинь поточний вибір.</p>
            <button type="button" onClick={resetFilters}>
              Скинути фільтри
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
