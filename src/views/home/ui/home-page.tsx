import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import { FishingSpotCard } from "@/entities/fishing-spot";
import { getFeaturedFishingSpots } from "@/entities/fishing-spot/server";
import { Reveal } from "@/shared/ui/reveal";
import { SiteHeader } from "@/widgets/site-header";
import { createContourPaths } from "../lib/contour-paths";
import { HeroMap } from "./hero-map";
import styles from "./home-page.module.scss";

const contourPaths = createContourPaths();

export function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();

  const steps = [
    { title: t("stepExploreTitle"), text: t("stepExploreText"), action: t("stepExploreAction"), href: "/spots" as const },
    { title: t("stepPlanTitle"), text: t("stepPlanText") },
    { title: t("stepShareTitle"), text: t("stepShareText"), action: t("openCommunity"), href: "/community" as const },
  ];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <HeroMap paths={contourPaths} readoutLabel={t("readoutLabel")} />
        <SiteHeader />

        <div className={styles.heroContent} data-page-hero>
          <h1>{t("title")}</h1>
          <p className={styles.lead}>{t("lead")}</p>

          <form className={styles.search} action={`/${locale}/spots`} method="get" role="search">
            <label className={styles.searchField}>
              <span className={styles.visuallyHidden}>{t("searchLabel")}</span>
              <input name="query" type="search" placeholder={t("searchPlaceholder")} autoComplete="off" />
            </label>
            <button type="submit">{t("searchAction")}</button>
          </form>

          <div className={styles.actions}>
            <Link className={styles.secondaryAction} href="/spots">
              {t("findSpot")}
            </Link>
            <a className={styles.secondaryAction} href="#how-it-works">
              {t("howItWorks")}
            </a>
          </div>
        </div>
      </section>

      <section className={styles.spotsSection} id="popular-spots">
        <Reveal>
          <div className={styles.sectionHeading}>
            <h2>{t("popular")}</h2>
            <Link className={styles.sectionLink} href="/spots">
              {t("allSpots")}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className={styles.spotGrid}>
            {getFeaturedFishingSpots().map((spot) => (
              <FishingSpotCard key={spot.id} spot={spot} href={`/spots/${spot.slug}`} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className={styles.stepsSection} id="how-it-works" aria-labelledby="how-it-works-title">
        <div className={styles.stepsIntro}>
          <h2 id="how-it-works-title">{t("howItWorksTitle")}</h2>
          <p className={styles.stepsLead}>{t("howItWorksLead")}</p>
        </div>

        <ol className={styles.timeline}>
          {steps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.stepMarker} aria-hidden="true">
                {index + 1}
              </span>
              <div className={styles.stepBody}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                {step.href ? (
                  <Link className={styles.stepLink} href={step.href}>
                    {step.action}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
