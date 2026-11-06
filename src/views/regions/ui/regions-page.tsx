import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import type { RegionSummary } from "@/entities/fishing-spot/server";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./regions.module.scss";

type RegionsPageProps = {
  regions: readonly RegionSummary[];
};

export function RegionsPage({ regions }: RegionsPageProps) {
  const t = useTranslations("regions");
  const locale = useLocale() === "en" ? "en" : "uk";
  const max = Math.max(...regions.map((region) => region.total), 1);

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

      <section className={styles.content} aria-labelledby="regions-list-title">
        <h2 id="regions-list-title" className={styles.visuallyHidden}>{t("listTitle")}</h2>
        <ul className={styles.grid} data-stagger>
          {regions.map((region) => (
            <li key={region.slug}>
              <Link className={styles.card} href={`/regions/${region.slug}`} data-tilt>
                <strong>{region.name[locale]}</strong>
                <span>{t("waterCount", { count: region.total })}</span>
                <i className={styles.bar} style={{ "--fill": `${Math.round((region.total / max) * 100)}%` } as React.CSSProperties} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
