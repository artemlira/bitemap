"use client";

import { Link } from "@/shared/lib/i18n";
import Image from "next/image";
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
              <p className={styles.description}>
                {getFishingSpotText(spot, "description", locale) || t("noDescription")}
              </p>
              {spot.descriptionSourceUrl && getFishingSpotText(spot, "description", locale) ? (
                <p className={styles.descriptionSource}>
                  <a href={spot.descriptionSourceUrl} target="_blank" rel="noreferrer">{t("descriptionSource")}</a>
                </p>
              ) : null}
              <FavoriteSpotButton spot={spot} />
            </div>
            <div className={styles.waterVisual} data-tone={spot.tone}>
              {spot.photos?.[0] ? (
                <Image
                  className={styles.heroPhoto}
                  src={spot.photos[0].src}
                  alt={spot.photos[0].alt[locale === "en" ? "en" : "uk"]}
                  fill
                  sizes="(max-width: 900px) 100vw, 42vw"
                  priority
                />
              ) : null}
              {!spot.photos?.length ? <span aria-hidden="true" /> : null}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.details} aria-labelledby="details-title">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>{t("overview")}</p>
          <h2 id="details-title">{t("overviewTitle")}</h2>
        </div>

        <dl className={styles.facts} data-stagger>
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
            <dd>{t("accessUnknown")}</dd>
          </div>
        </dl>
        <p className={styles.dataStatus}>
          {spot.verificationStatus === "verified" ? t("verificationVerified") : t("verificationUnverified")}
          {spot.sourceUrl ? (
            <>
              {" "}
              <a href={spot.sourceUrl} target="_blank" rel="noreferrer">
                {t("sourceLink")}
              </a>
            </>
          ) : null}
        </p>

        {spot.photos?.length ? (
          <section className={styles.editorialPhotos} aria-labelledby="editorial-photos-title">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionLabel}>{t("editorialPhotosEyebrow")}</p>
              <h2 id="editorial-photos-title">{t("editorialPhotosTitle")}</h2>
            </div>
            <div className={styles.editorialPhotoGrid}>
              {spot.photos.map((photo) => (
                <figure className={styles.editorialPhoto} key={photo.src}>
                  <Image src={photo.src} alt={photo.alt[locale === "en" ? "en" : "uk"]} fill sizes="(max-width: 700px) 100vw, 50vw" />
                  <figcaption>
                    <a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.creator}</a>
                    {" · "}
                    <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <SpotLocationPanel
          id={spot.id}
          latitude={spot.latitude}
          longitude={spot.longitude}
          locationLabel={`${getFishingSpotText(spot, "name", locale)}, ${getFishingSpotText(spot, "region", locale)}`}
        />

        <SpotWeather id={spot.id} latitude={spot.latitude} longitude={spot.longitude} targetType="catalog" />

        <div className={styles.fishSection}>
          <div>
            <p className={styles.sectionLabel}>{t("fishEyebrow")}</p>
            <h2>{t("fishTitle")}</h2>
            <p className={styles.fishSourceNote}>{t("fishSourceNote")}</p>
          </div>
          <ul className={styles.fishList} aria-label={t("fishList")}>
            {getFishingSpotFish(spot, locale).length ? getFishingSpotFish(spot, locale).map((fish) => (
              <li key={fish}>{fish}</li>
            )) : <li>{t("fishUnverified")}</li>}
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
