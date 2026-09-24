"use client";

import Link from "next/link";
import { UserSpotCard } from "@/entities/user-spot";
import { useUserSpots } from "@/features/manage-user-spot";
import { ShareUserSpotButton } from "@/features/share-user-spot";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./my-spots-page.module.scss";

export function MySpotsPage() {
  const { error, isAuthLoading, isLoading, spots, user } = useUserSpots();

  if (!user && !isAuthLoading) {
    return (
      <main className={styles.page}>
        <section className={styles.hero}>
          <SiteHeader />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Твоя карта</p>
            <h1>Місця, які знаєш ти.</h1>
            <p>Увійди, щоб додавати власні водойми, нотувати важливі деталі та повертатися до них перед виїздом.</p>
            <Link className={styles.primaryLink} href="/login">
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
          <p className={styles.eyebrow}>Твоя карта</p>
          <h1>Мої водойми.</h1>
          <p>Зберігай перевірені місця у власній добірці. Вони приватні — бачиш і редагуєш їх лише ти.</p>
        </div>
      </section>

      <section className={styles.content} aria-labelledby="my-spots-title">
        <div className={styles.heading}>
          <div>
            <p className={styles.sectionLabel}>Власні локації</p>
            <h2 id="my-spots-title">Твій атлас</h2>
          </div>
          <Link className={styles.addLink} href="/my-spots/new">
            Додати водойму <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        {isLoading || isAuthLoading ? (
          <div className={styles.loading} aria-live="polite">
            Завантажуємо твої водойми…
          </div>
        ) : spots.length > 0 ? (
          <div className={styles.grid}>
            {spots.map((spot) => (
              <UserSpotCard
                key={spot.id}
                spot={spot}
                footerActions={spot.visibility === "published" ? <ShareUserSpotButton spotId={spot.id} spotName={spot.name} /> : null}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.sectionLabel}>Почнімо з першої</p>
            <h3>Додай свою водойму.</h3>
            <p>Вкажи місце, тип водойми, рибу та власне враження — цього достатньо для корисної особистої картки.</p>
            <Link href="/my-spots/new">Створити першу картку</Link>
          </div>
        )}
      </section>
    </main>
  );
}
