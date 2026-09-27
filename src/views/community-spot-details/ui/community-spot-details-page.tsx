"use client";

import { Link } from "@/shared/lib/i18n";
import { useLocale, useTranslations } from "next-intl";
import { getUserSpotFish, getUserSpotText, usePublishedUserSpot } from "@/entities/user-spot";
import { SpotImageGallery } from "@/entities/spot-image";
import { SpotLocationPanel } from "@/entities/spot-location";
import { ShareUserSpotButton } from "@/features/share-user-spot";
import { SpotImageUpload } from "@/features/upload-spot-image";
import { SpotReports } from "@/widgets/spot-reports";
import { SpotWeather } from "@/widgets/spot-weather";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./community-spot-details-page.module.scss";

type CommunitySpotDetailsPageProps = { spotId: string };

export function CommunitySpotDetailsPage({ spotId }: CommunitySpotDetailsPageProps) {
  const locale = useLocale();
  const t = useTranslations("communitySpotDetails");
  const { isLoading, spot } = usePublishedUserSpot(spotId);

  if (isLoading) {
    return <main className={styles.state} aria-live="polite">{t("loading")}</main>;
  }

  if (!spot) {
    return (
      <main className={styles.state}>
        <h1>{t("unavailableTitle")}</h1>
        <p>{t("unavailableFallback")}</p>
        <Link href="/community">{t("back")}</Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent}>
          <nav className={styles.breadcrumbs} aria-label={t("breadcrumbs")}>
            <Link href="/">{t("home")}</Link><span aria-hidden="true">/</span><Link href="/community">{t("community")}</Link><span aria-hidden="true">/</span><span aria-current="page">{getUserSpotText(spot, "name", locale)}</span>
          </nav>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>{t("eyebrow")}</p>
              <h1>{getUserSpotText(spot, "name", locale)}</h1>
              <p className={styles.region}>{spot.settlement ? `${spot.region} · ${spot.settlement}` : spot.region}</p>
              <p className={styles.description}>{getUserSpotText(spot, "description", locale)}</p>
              <div className={styles.shareAction}>
                <ShareUserSpotButton spotId={spot.id} spotName={getUserSpotText(spot, "name", locale)} />
              </div>
            </div>
            <div className={styles.visual} data-tone={spot.tone} aria-hidden="true"><span /><span /><span /></div>
          </div>
        </div>
      </section>
      <section className={styles.details} aria-labelledby="community-spot-details-title">
        <div><p className={styles.sectionLabel}>{t("overview")}</p><h2 id="community-spot-details-title">{t("overviewTitle")}</h2></div>
        <dl className={styles.facts}>
          <div><dt>{t("waterType")}</dt><dd>{getUserSpotText(spot, "waterType", locale)}</dd></div>
          <div><dt>{t("location")}</dt><dd>{spot.settlement || spot.community || spot.region}</dd></div>
          <div><dt>{t("access")}</dt><dd>{getUserSpotText(spot, "access", locale)}</dd></div>
        </dl>
        <SpotLocationPanel
          id={spot.id}
          latitude={spot.latitude}
          longitude={spot.longitude}
          locationLabel={[getUserSpotText(spot, "name", locale), spot.settlement, spot.community, spot.region].filter(Boolean).join(", ")}
        />
        <SpotWeather id={spot.id} latitude={spot.latitude} longitude={spot.longitude} />
        <div className={styles.fishSection}><div><p className={styles.sectionLabel}>{t("fishEyebrow")}</p><h2>{t("fishTitle")}</h2></div><ul className={styles.fishList} aria-label={t("fishList")}>{getUserSpotFish(spot, locale).map((fish) => <li key={fish}>{fish}</li>)}</ul></div>
        <section className={styles.gallery} aria-labelledby="community-gallery-title">
          <div><p className={styles.sectionLabel}>{t("galleryEyebrow")}</p><h2 id="community-gallery-title">{t("galleryTitle")}</h2></div>
          <SpotImageGallery targetType="user-spot" targetId={spot.id} />
          <SpotImageUpload targetType="user-spot" targetId={spot.id} />
        </section>
        <SpotReports targetType="user-spot" targetId={spot.id} />
      </section>
    </main>
  );
}
