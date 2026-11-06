import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import { FishingSpotCard, catalogWaterTypes, type FishingSpot } from "@/entities/fishing-spot";
import type { RegionSummary } from "@/entities/fishing-spot/server";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./regions.module.scss";

type RegionPageProps = {
  region: RegionSummary;
  spots: readonly FishingSpot[];
};

export function RegionPage({ region, spots }: RegionPageProps) {
  const t = useTranslations("regions");
  const locale = useLocale() === "en" ? "en" : "uk";
  const name = region.name[locale];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent} data-page-hero>
          <p className={styles.eyebrow}>
            <Link href="/regions">{t("allRegions")}</Link>
          </p>
          <h1>{name}</h1>
          <p>{t("regionLead", { count: region.total })}</p>
        </div>
      </section>

      <section className={styles.content} aria-labelledby="region-stats-title">
        <h2 id="region-stats-title" className={styles.visuallyHidden}>{t("statsTitle")}</h2>
        <ul className={styles.stats} data-stagger>
          {Object.entries(region.byType)
            .sort((first, second) => second[1] - first[1])
            .map(([type, count]) => (
              <li key={type}>
                <strong>{count}</strong>
                <span>{catalogWaterTypes[type as keyof typeof catalogWaterTypes]?.[locale] ?? type}</span>
              </li>
            ))}
        </ul>

        <div className={styles.sectionHeading}>
          <h2>{t("bestTitle", { name })}</h2>
          <Link className={styles.allLink} href={`/spots?region=${encodeURIComponent(region.name.uk)}`}>
            {t("openCatalog", { count: region.total })}
          </Link>
        </div>

        <div className={styles.spots} data-stagger>
          {spots.map((spot) => (
            <FishingSpotCard key={spot.id} spot={spot} href={`/spots/${spot.slug}`} />
          ))}
        </div>
      </section>
    </main>
  );
}
