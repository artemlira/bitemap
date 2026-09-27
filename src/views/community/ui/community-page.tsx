"use client";

import { UserSpotCard, usePublishedUserSpots } from "@/entities/user-spot";
import { useTranslations } from "next-intl";
import { SiteHeader } from "@/widgets/site-header";
import { CommunityReports } from "@/widgets/community-reports";
import styles from "./community-page.module.scss";

export function CommunityPage() {
  const t = useTranslations("community");
  const { error, isLoading, spots } = usePublishedUserSpots();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h1>{t("title")}</h1>
          <p>{t("lead")}</p>
        </div>
      </section>

      <section className={styles.content} aria-labelledby="community-title">
        <div className={styles.heading}>
          <div>
            <p className={styles.sectionLabel}>{t("section")}</p>
            <h2 id="community-title">{t("sectionTitle")}</h2>
          </div>
          <p className={styles.counter} aria-live="polite">{isLoading ? t("loading") : t("count", { count: spots.length })}</p>
        </div>

        {error ? <p className={styles.error} role="alert">{t("loadError")}</p> : null}

        {isLoading ? (
          <div className={styles.loading} aria-live="polite">{t("searching")}</div>
        ) : spots.length > 0 ? (
          <div className={styles.grid}>
            {spots.map((spot) => (
              <UserSpotCard key={spot.id} spot={spot} href={`/community/${spot.id}`} actionLabel={t("open")} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.sectionLabel}>{t("emptyEyebrow")}</p>
            <h3>{t("emptyTitle")}</h3>
            <p>{t("emptyText")}</p>
          </div>
        )}

        <CommunityReports spots={spots} />
      </section>
    </main>
  );
}
