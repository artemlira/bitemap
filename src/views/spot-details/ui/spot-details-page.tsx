"use client";

import { Link } from "@/shared/lib/i18n";
import Image from "next/image";
import { WaterSilhouette } from "@/entities/fishing-spot/ui/water-silhouette";
import { catalogWaterTypes, getFishingSpotFish, getFishingSpotText, type FishingSpot } from "@/entities/fishing-spot";
import type { NearbySpot } from "@/entities/fishing-spot/server";
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
  nearby?: readonly NearbySpot[];
};

export function SpotDetailsPage({ spot, nearby = [] }: SpotDetailsPageProps) {
  const locale = useLocale();
  const t = useTranslations("spotDetails");
  const lang = locale === "en" ? "en" : "uk";
  const facts = spot.facts;
  const factTiles = [
    { label: t("waterType"), value: getFishingSpotText(spot, "waterType", locale) },
    { label: t("region"), value: getFishingSpotText(spot, "region", locale) },
    facts?.district ? { label: t("factDistrict"), value: facts.district[lang] } : null,
    facts?.lengthKm ? { label: t("factLength"), value: t("unitKm", { value: facts.lengthKm.toLocaleString(locale) }) } : null,
    facts?.areaKm2 ? { label: t("factArea"), value: t("unitKm2", { value: facts.areaKm2.toLocaleString(locale) }) } : null,
    facts?.maxDepthM ? { label: t("factDepth"), value: t("unitM", { value: facts.maxDepthM.toLocaleString(locale) }) } : null,
    facts?.elevationM ? { label: t("factElevation"), value: t("unitM", { value: facts.elevationM.toLocaleString(locale) }) } : null,
    facts?.basin ? { label: t("factBasin"), value: facts.basin[lang] } : null,
    facts?.flowsInto ? { label: t("factFlowsInto"), value: facts.flowsInto[lang] } : null,
    { label: t("access"), value: t("accessUnknown") },
  ].filter((tile): tile is { label: string; value: string } => tile !== null);
  const fish = getFishingSpotFish(spot, locale);

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
              {!spot.photos?.length && spot.shape ? (
                <>
                  <WaterSilhouette shape={spot.shape} className={styles.silhouette} />
                  <p className={styles.visualNote}>{t("outlineNote")}</p>
                </>
              ) : null}
              {!spot.photos?.length && !spot.shape ? (
                <div className={styles.noPhoto}>
                  <span className={styles.noPhotoRings} aria-hidden="true" />
                  <p>{t("noPhotoTitle")}</p>
                  <a href="#spot-gallery" data-ripple>{t("noPhotoAction")}</a>
                </div>
              ) : null}
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
          {factTiles.map((tile) => (
            <div key={tile.label}>
              <dt>{tile.label}</dt>
              <dd>{tile.value}</dd>
            </div>
          ))}
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
          shape={spot.shape}
          isApproximate={spot.locationApprox}
          locationLabel={`${getFishingSpotText(spot, "name", locale)}, ${getFishingSpotText(spot, "region", locale)}`}
        />

        <SpotWeather id={spot.id} latitude={spot.latitude} longitude={spot.longitude} targetType="catalog" />

        <div className={styles.fishSection}>
          <div>
            <p className={styles.sectionLabel}>{t("fishEyebrow")}</p>
            <h2>{t("fishTitle")}</h2>
            {fish.length > 0 ? (
              <p className={styles.fishSourceNote}>
                {t("fishFromArticle")}
                {spot.fishSourceUrl ? (
                  <>
                    {" "}
                    <a href={spot.fishSourceUrl} target="_blank" rel="noreferrer">{t("sourceLink")}</a>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
          {fish.length > 0 ? (
            <ul className={styles.fishList} aria-label={t("fishList")} data-stagger>
              {fish.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          ) : (
            <div className={styles.fishEmpty}>
              <h3>{t("fishEmptyTitle")}</h3>
              <p>{t("fishEmptyText")}</p>
              <a href="#spot-reports" data-ripple>{t("fishEmptyAction")}</a>
            </div>
          )}
        </div>

        {nearby.length > 0 ? (
          <section className={styles.nearby} aria-labelledby="nearby-title">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionLabel}>{t("nearbyEyebrow")}</p>
              <h2 id="nearby-title">{t("nearbyTitle")}</h2>
            </div>
            <ul className={styles.nearbyList} data-stagger>
              {nearby.map((item) => (
                <li key={item.id}>
                  <Link href={`/spots/${item.id}`} data-tilt>
                    <strong>{item.name[lang]}</strong>
                    <span>
                      {catalogWaterTypes[item.type as keyof typeof catalogWaterTypes]?.[lang]} · {item.region[lang]}
                    </span>
                    <em>{t("nearbyDistance", { km: item.distanceKm })}</em>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className={styles.gallery} id="spot-gallery" aria-labelledby="spot-gallery-title">
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

        <div id="spot-reports">
          <SpotReports targetType="catalog" targetId={spot.id} />
        </div>

        <aside className={styles.note}>
          <p>{t("sourcesTitle")}</p>
          <span>{t("sourcesNote")}</span>
        </aside>
      </section>
    </main>
  );
}
