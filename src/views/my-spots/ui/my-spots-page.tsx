"use client";

import { Link } from "@/shared/lib/i18n";
import { UserSpotCard } from "@/entities/user-spot";
import { useTranslations } from "next-intl";
import { useUserSpots } from "@/features/manage-user-spot";
import { ShareUserSpotButton } from "@/features/share-user-spot";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./my-spots-page.module.scss";

export function MySpotsPage() {
  const t = useTranslations("mySpots");
  const { error, isAuthLoading, isLoading, spots, user } = useUserSpots();

  if (!user && !isAuthLoading) {
    return (
      <main className={styles.page}>
        <section className={styles.hero}>
          <SiteHeader />
          <div className={styles.heroContent} data-page-hero>
            <p className={styles.eyebrow}>{t("eyebrow")}</p>
            <h1>{t("signedOutTitle")}</h1>
            <p>{t("signedOutLead")}</p>
            <Link className={styles.primaryLink} href="/login">
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

      <section className={styles.content} aria-labelledby="my-spots-title">
        <div className={styles.heading}>
          <div>
            <p className={styles.sectionLabel}>{t("section")}</p>
            <h2 id="my-spots-title">{t("sectionTitle")}</h2>
          </div>
          <Link className={styles.addLink} href="/my-spots/new">
            {t("add")} <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {error ? (
          <p className={styles.error} role="alert">
            {t("loadError")}
          </p>
        ) : null}

        {isLoading || isAuthLoading ? (
          <div className={styles.loading} aria-live="polite">
            {t("loading")}
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
            <p className={styles.sectionLabel}>{t("emptyEyebrow")}</p>
            <h3>{t("emptyTitle")}</h3>
            <p>{t("emptyText")}</p>
            <Link href="/my-spots/new">{t("create")}</Link>
          </div>
        )}
      </section>
    </main>
  );
}
