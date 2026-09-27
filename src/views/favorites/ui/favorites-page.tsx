"use client";

import { Link } from "@/shared/lib/i18n";
import { FishingSpotCard, fishingSpots } from "@/entities/fishing-spot";
import { useTranslations } from "next-intl";
import { useFavoriteSpots } from "@/features/favorite-spot";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./favorites-page.module.scss";

export function FavoritesPage() {
  const t = useTranslations("favorites");
  const { error, isAuthLoading, isLoading, spotIds, user } = useFavoriteSpots();
  const favoriteSpots = fishingSpots.filter((spot) => spotIds.has(spot.id));

  if (!user && !isAuthLoading) {
    return (
      <main className={styles.page}>
        <section className={styles.hero}>
          <SiteHeader />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>{t("eyebrow")}</p>
            <h1>{t("signedOutTitle")}</h1>
            <p>{t("signedOutLead")}</p>
            <Link className={styles.signInLink} href="/login">
              {t("signIn")}
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
        <div className={styles.heroContent} data-page-hero>
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h1>{t("title")}</h1>
          <p>{t("lead")}</p>
        </div>
      </section>

      <section className={styles.content} aria-labelledby="favorites-title">
        <div className={styles.heading}>
          <div>
            <p className={styles.sectionLabel}>{t("section")}</p>
            <h2 id="favorites-title">{t("sectionTitle")}</h2>
          </div>
          <p aria-live="polite" className={styles.counter}>
            {isLoading ? t("loading") : t("count", { count: favoriteSpots.length })}
          </p>
        </div>

        {error ? (
          <p className={styles.error} role="alert">
            {t("loadError")}
          </p>
        ) : null}

        {isLoading ? (
          <div className={styles.loading} aria-live="polite">
            {t("loadingList")}
          </div>
        ) : favoriteSpots.length > 0 ? (
          <div className={styles.grid}>
            {favoriteSpots.map((spot) => (
              <FishingSpotCard key={spot.id} spot={spot} href={`/spots/${spot.slug}`} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.sectionLabel}>{t("emptyEyebrow")}</p>
            <h3>{t("emptyTitle")}</h3>
            <p>{t("emptyText")}</p>
            <Link href="/spots">{t("browse")}</Link>
          </div>
        )}
      </section>
    </main>
  );
}
