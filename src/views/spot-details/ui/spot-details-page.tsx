"use client";

import { Link } from "@/shared/lib/i18n";
import { getFishingSpotFish, getFishingSpotText, type FishingSpot } from "@/entities/fishing-spot";
import { SpotImageGallery } from "@/entities/spot-image";
import { SpotLocationPanel } from "@/entities/spot-location";
import { useLocale, useTranslations } from "next-intl";
import { FavoriteSpotButton } from "@/features/favorite-spot";
import { ManageSpotImageActions } from "@/features/manage-spot-image";
import { ContentReactionButton } from "@/features/react-to-content";
import { ReportContentAction } from "@/features/content-report";
import { SpotImageUpload } from "@/features/upload-spot-image";
import { SpotReports } from "@/widgets/spot-reports";
import { SpotWeather } from "@/widgets/spot-weather";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./spot-details-page.module.scss";

type SpotDetailsPageProps = {
  spot: FishingSpot;
};

export function SpotDetailsPage({ spot }: SpotDetailsPageProps) {
  const locale = useLocale();
  const t = useTranslations("spotDetails");
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent} data-page-hero>
          <nav className={styles.breadcrumbs} aria-label={t("breadcrumbs")}>
            <Link href="/">{t("home")}</Link>
            <span aria-hidden="true">/</span>
            <Link href="/spots">{t("spots")}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{getFishingSpotText(spot, "name", locale)}</span>
          </nav>

          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>{getFishingSpotText(spot, "waterType", locale)}</p>
              <h1>{getFishingSpotText(spot, "name", locale)}</h1>
              <p className={styles.region}>{getFishingSpotText(spot, "region", locale)}</p>
              <p className={styles.description}>{getFishingSpotText(spot, "description", locale)}</p>
              <FavoriteSpotButton spot={spot} />
            </div>
            <div className={styles.waterVisual} data-tone={spot.tone} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.details} aria-labelledby="details-title">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>{t("overview")}</p>
          <h2 id="details-title">{t("overviewTitle")}</h2>
        </div>

        <dl className={styles.facts}>
          <div>
            <dt>{t("waterType")}</dt>
            <dd>{getFishingSpotText(spot, "waterType", locale)}</dd>
          </div>
          <div>
            <dt>{t("region")}</dt>
            <dd>{getFishingSpotText(spot, "region", locale)}</dd>
          </div>
          <div>
            <dt>{t("access")}</dt>
            <dd>{getFishingSpotText(spot, "access", locale)}</dd>
          </div>
        </dl>

        <SpotLocationPanel
          id={spot.id}
          latitude={spot.latitude}
          longitude={spot.longitude}
          locationLabel={`${getFishingSpotText(spot, "name", locale)}, ${getFishingSpotText(spot, "region", locale)}`}
        />

        <SpotWeather id={spot.id} latitude={spot.latitude} longitude={spot.longitude} />

        <div className={styles.fishSection}>
          <div>
            <p className={styles.sectionLabel}>{t("fishEyebrow")}</p>
            <h2>{t("fishTitle")}</h2>
          </div>
          <ul className={styles.fishList} aria-label={t("fishList")}>
            {getFishingSpotFish(spot, locale).map((fish) => (
              <li key={fish}>{fish}</li>
            ))}
          </ul>
        </div>

        <section className={styles.gallery} aria-labelledby="spot-gallery-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>{t("galleryEyebrow")}</p>
            <h2 id="spot-gallery-title">{t("galleryTitle")}</h2>
          </div>
          <SpotImageGallery
            renderReaction={(image) => <ContentReactionButton targetType="image" targetId={image.id} />}
            renderActions={(image) => (
              <>
                <ManageSpotImageActions image={image} targetType="catalog" targetId={spot.id} />
                <ReportContentAction authorId={image.ownerId} contextType="catalog" parentId={spot.id} targetType="spot-image" targetId={image.id} />
              </>
            )}
            targetType="catalog"
            targetId={spot.id}
          />
          <SpotImageUpload targetType="catalog" targetId={spot.id} />
        </section>

        <SpotReports targetType="catalog" targetId={spot.id} />

        <aside className={styles.note}>
          <p>{t("mvp")}</p>
          <span>
            {t("mvpText")}
          </span>
        </aside>
      </section>
    </main>
  );
}
