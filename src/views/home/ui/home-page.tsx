import { useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import { FishingSpotCard, featuredFishingSpots } from "@/entities/fishing-spot";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./home-page.module.scss";

export function HomePage() {
  const t = useTranslations("home");

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h1>
            {t("title")}
            <span>{t("titleAccent")}</span>
          </h1>
          <p className={styles.lead}>{t("lead")}</p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} href="/spots">
              {t("findSpot")}
              <span aria-hidden="true">↗</span>
            </Link>
            <a className={styles.secondaryAction} href="#how-it-works">
              {t("howItWorks")}
            </a>
          </div>
        </div>

        <div className={styles.waterTexture} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className={styles.spotsSection} id="popular-spots">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.sectionLabel}>{t("discover")}</p>
            <h2>{t("popular")}</h2>
          </div>
          <p className={styles.spotCount}>{t("spotCount")}</p>
        </div>

        <div className={styles.spotGrid}>
          {featuredFishingSpots.map((spot) => (
            <FishingSpotCard key={spot.id} spot={spot} href={`/spots/${spot.slug}`} />
          ))}
        </div>
      </section>

      <section className={styles.stepsSection} id="how-it-works">
        <p className={styles.sectionLabel}>{t("start")}</p>
        <h2>
          {t("moreTime")}
          <br />
          {t("lessSearch")}
        </h2>
      </section>
    </main>
  );
}
