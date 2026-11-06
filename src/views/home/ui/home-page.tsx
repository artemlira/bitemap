import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import { FishingSpotCard } from "@/entities/fishing-spot";
import { getCatalogStats, getFeaturedFishingSpots } from "@/entities/fishing-spot/server";
import { Reveal } from "@/shared/ui/reveal";
import { SiteHeader } from "@/widgets/site-header";
import { HeroWater } from "./hero-water";
import styles from "./home-page.module.scss";

// Wavy line through the three step nodes (x = 200, 600, 1000 of 1200).
const JOURNEY_PATH = "M0 70C100 30 160 30 200 60S300 100 400 70 500 30 600 60 700 100 800 70 900 30 1000 60 1100 100 1200 70";

function ExploreIcon() {
  return (
    <svg className={styles.stepIcon} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M6 16l16-6 20 6 16-6v38l-16 6-20-6-16 6z" className={styles.fillSonar} />
      <path d="M22 10v38M42 16v38" />
      <g className={styles.pin}>
        <path d="M32 6c-6 0-10 4.4-10 9.6C22 22.6 32 34 32 34s10-11.400 10-18.400C42 10.400 38 6 32 6z" className={styles.accent} />
        <circle cx="32" cy="15.500" r="3.500" className={styles.fillAccent} />
      </g>
    </svg>
  );
}

function PlanIcon() {
  return (
    <svg className={styles.stepIcon} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <g className={styles.rays}>
        <path d="M32 6v6M32 52v6M6 32h6M52 32h6M13.600 13.600l4.200 4.200M46.200 46.200l4.200 4.200M13.600 50.400l4.200-4.200M46.200 17.800l4.200-4.200" className={styles.accent} />
      </g>
      <circle cx="32" cy="32" r="11" className={styles.fillSonar} />
      <path d="M20 44c3-3 6 3 9 0s6 3 9 0 6 3 9 0" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className={styles.stepIcon} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M6 44c6-4 10 4 16 0s10 4 16 0 10 4 16 0" />
      <ellipse cx="44" cy="44" rx="14" ry="4" className={`${styles.splash} ${styles.accent}`} />
      <g className={styles.jumpFish}>
        <path d="M18 32c6-8 16-8 22 0-6 8-16 8-22 0zM38 32l8-6v12z" className={styles.accent} />
        <circle cx="24" cy="31" r="1.400" className={styles.fillAccent} />
      </g>
    </svg>
  );
}

export function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const stats = getCatalogStats();
  const marquee = t.raw("marquee") as string[];

  const steps = [
    { title: t("stepExploreTitle"), text: t("stepExploreText"), action: t("stepExploreAction"), href: "/spots" as const, icon: <ExploreIcon /> },
    { title: t("stepPlanTitle"), text: t("stepPlanText"), icon: <PlanIcon /> },
    { title: t("stepShareTitle"), text: t("stepShareText"), action: t("openCommunity"), href: "/community" as const, icon: <ShareIcon /> },
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
        <SiteHeader backdrop={false} />

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
            <strong className={styles.counter} role="img" aria-label={String(item.value)} style={{ "--target": item.value } as React.CSSProperties} />
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

        <div className={styles.journey}>
          <svg className={styles.journeyPath} viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path className={styles.journeyTrack} d={JOURNEY_PATH} />
            <path className={styles.journeyDraw} d={JOURNEY_PATH} pathLength={1} />
          </svg>

          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNode} aria-hidden="true">
                  {index + 1}
                </span>
                {step.icon}
                <div className={styles.stepBody}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  {step.href ? (
                    <Link className={styles.stepLink} href={step.href}>
                      <span>{step.action}</span>
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
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
