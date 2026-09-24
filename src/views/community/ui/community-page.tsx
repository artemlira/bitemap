"use client";

import { UserSpotCard, usePublishedUserSpots } from "@/entities/user-spot";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./community-page.module.scss";

export function CommunityPage() {
  const { error, isLoading, spots } = usePublishedUserSpots();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Від рибалок для рибалок</p>
          <h1>Водойми, якими діляться.</h1>
          <p>Тут з’являються локації, які учасники BiteMap вирішили відкрити для спільноти.</p>
        </div>
      </section>

      <section className={styles.content} aria-labelledby="community-title">
        <div className={styles.heading}>
          <div>
            <p className={styles.sectionLabel}>Спільні локації</p>
            <h2 id="community-title">Карта спільноти</h2>
          </div>
          <p className={styles.counter} aria-live="polite">{isLoading ? "Завантажуємо…" : `Локацій: ${spots.length}`}</p>
        </div>

        {error ? <p className={styles.error} role="alert">{error}</p> : null}

        {isLoading ? (
          <div className={styles.loading} aria-live="polite">Шукаємо опубліковані водойми…</div>
        ) : spots.length > 0 ? (
          <div className={styles.grid}>
            {spots.map((spot) => (
              <UserSpotCard key={spot.id} spot={spot} href={`/community/${spot.id}`} actionLabel="Відкрити" />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.sectionLabel}>Поки тихо</p>
            <h3>Тут з’являться перші історії.</h3>
            <p>Опублікуй власну водойму у «Моїх водоймах», щоб нею могли скористатися інші.</p>
          </div>
        )}
      </section>
    </main>
  );
}
