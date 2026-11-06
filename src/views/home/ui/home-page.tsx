import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import { FishingSpotCard } from "@/entities/fishing-spot";
import { getCatalogStats, getFeaturedFishingSpots } from "@/entities/fishing-spot/server";
import { Reveal } from "@/shared/ui/reveal";
import { SiteHeader } from "@/widgets/site-header";
import { HeroWater } from "./hero-water";
import styles from "./home-page.module.scss";

export function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const stats = getCatalogStats();
  const marquee = t.raw("marquee") as string[];

  const steps = [
    { title: t("stepExploreTitle"), text: t("stepExploreText"), action: t("stepExploreAction"), href: "/spots" as const },
    { title: t("stepPlanTitle"), text: t("stepPlanText") },
    { title: t("stepShareTitle"), text: t("stepShareText"), action: t("openCommunity"), href: "/community" as const },
  ];

  const statItems = [
    { value: stats.total, label: t("statsWater") },
    { value: stats.regions, label: t("statsRegions") },
    { value: stats.photos, label: t("statsPhotos") },
  ];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <HeroWater />
        <SiteHeader />

        <div className={styles.heroContent} data-page-hero>
          <h1>{t("title")}</h1>
          <p className={styles.lead}>{t("lead")}</p>

          <form className={styles.search} action={`/${locale}/spots`} method="get" role="search">
            <label className={styles.searchField}>
              <span className={styles.visuallyHidden}>{t("searchLabel")}</span>
              <input name="query" type="search" placeholder={t("searchPlaceholder")} autoComplete="off" />
            </label>
            <button type="submit" data-ripple>{t("searchAction")}</button>
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

      <section className={styles.marquee} aria-label={t("marqueeLabel")}>
        <div className={styles.marqueeTrack} aria-hidden="true">
          {[0, 1].map((copy) => (
            <ul key={copy} className={styles.marqueeList}>
              {marquee.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          ))}
        </div>
        <ul className={styles.visuallyHidden}>
          {marquee.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </section>

      <section className={styles.stats} aria-label={t("statsWater")}>
        {statItems.map((item) => (
          <div key={item.label} className={styles.stat}>
            <strong className={styles.counter} style={{ "--target": item.value } as React.CSSProperties}>
              <span className={styles.visuallyHidden}>{item.value}</span>
            </strong>
            <span>{item.label}</span>
          </div>
        ))}
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

        <div className={styles.spotGrid} data-stagger>
          {getFeaturedFishingSpots().map((spot) => (
            <FishingSpotCard key={spot.id} spot={spot} href={`/spots/${spot.slug}`} />
          ))}
        </div>
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

      <section className={styles.cta}>
        <div className={styles.ctaRings} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.ctaContent}>
          <h2>{t("ctaTitle")}</h2>
          <p>{t("ctaText")}</p>
          <Link className={styles.ctaButton} href="/my-spots/new" data-ripple>
            {t("ctaAction")}
          </Link>
        </div>
      </section>
    </main>
  );
}
