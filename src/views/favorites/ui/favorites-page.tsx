"use client";

import { Link } from "@/shared/lib/i18n";
import { FishingSpotCard, fishingSpots } from "@/entities/fishing-spot";
import { useFavoriteSpots } from "@/features/favorite-spot";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./favorites-page.module.scss";

export function FavoritesPage() {
  const { error, isAuthLoading, isLoading, spotIds, user } = useFavoriteSpots();
  const favoriteSpots = fishingSpots.filter((spot) => spotIds.has(spot.id));

  if (!user && !isAuthLoading) {
    return (
      <main className={styles.page}>
        <section className={styles.hero}>
          <SiteHeader />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Твоя добірка</p>
            <h1>Збережені водойми.</h1>
            <p>Увійди, щоб побачити локації, які ти додав до власного списку.</p>
            <Link className={styles.signInLink} href="/login">
              Увійти в BiteMap
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Твоя добірка</p>
          <h1>Мої водойми.</h1>
          <p>Повертайся до локацій, які хочеш відвідати, коли з’явиться час для виїзду.</p>
        </div>
      </section>

      <section className={styles.content} aria-labelledby="favorites-title">
        <div className={styles.heading}>
          <div>
            <p className={styles.sectionLabel}>Збережене</p>
            <h2 id="favorites-title">Твій список</h2>
          </div>
          <p aria-live="polite" className={styles.counter}>
            {isLoading ? "Завантажуємо…" : `Локацій: ${favoriteSpots.length}`}
          </p>
        </div>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <div className={styles.loading} aria-live="polite">
            Завантажуємо твою добірку…
          </div>
        ) : favoriteSpots.length > 0 ? (
          <div className={styles.grid}>
            {favoriteSpots.map((spot) => (
              <FishingSpotCard key={spot.id} spot={spot} href={`/spots/${spot.slug}`} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.sectionLabel}>Поки порожньо</p>
            <h3>Тут з’являться твої водойми.</h3>
            <p>Відкрий сторінку локації та натисни «Зберегти водойму».</p>
            <Link href="/spots">Перейти до каталогу</Link>
          </div>
        )}
      </section>
    </main>
  );
}
