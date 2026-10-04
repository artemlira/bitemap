"use client";

import Image from "next/image";
import { FishingReportCard, usePublicFishingReportsByAuthor } from "@/entities/fishing-report";
import { usePublicUserProfile } from "@/entities/user";
import { UserSpotCard, usePublishedUserSpotsByOwner } from "@/entities/user-spot";
import { AnglerSpotPhotoStrip } from "./angler-spot-photo-strip";
import { ManageFishingReportActions } from "@/features/manage-fishing-report";
import { ReportDiscussion } from "@/features/discuss-report";
import { ContentReactionButton } from "@/features/react-to-content";
import { AnglerFollowControl } from "@/features/follow-angler";
import { Link } from "@/shared/lib/i18n";
import { SiteHeader } from "@/widgets/site-header";
import { useTranslations } from "next-intl";
import styles from "./angler-profile-page.module.scss";

type AnglerProfilePageProps = {
  userId: string;
};

export function AnglerProfilePage({ userId }: AnglerProfilePageProps) {
  const t = useTranslations("anglerProfile");
  const { isLoading: isProfileLoading, profile } = usePublicUserProfile(userId);
  const { error: spotsError, isLoading: areSpotsLoading, spots } = usePublishedUserSpotsByOwner(userId);
  const { error: reportsError, isLoading: areReportsLoading, reports } = usePublicFishingReportsByAuthor(userId);

  if (isProfileLoading) {
    return <main className={styles.state} aria-live="polite">{t("loading")}</main>;
  }

  if (!profile) {
    return (
      <main className={styles.state}>
        <h1>{t("unavailableTitle")}</h1>
        <p>{t("unavailableText")}</p>
        <Link href="/community">{t("back")}</Link>
      </main>
    );
  }

  const name = profile.displayName || t("defaultName");
  const initial = name.trim().slice(0, 1).toUpperCase();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent} data-page-hero>
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <div className={styles.identity}>
            <div className={styles.avatar}>
              {profile.photoURL ? <Image src={profile.photoURL} alt={t("avatarAlt", { name })} width={128} height={128} /> : <span aria-hidden="true">{initial}</span>}
            </div>
            <div>
              <h1>{name}</h1>
              <p>{t("lead")}</p>
            </div>
          </div>
          <div className={styles.profileActions}>
            <AnglerFollowControl anglerId={userId} />
            <dl className={styles.stats}>
              <div><dt>{t("spotsStat")}</dt><dd>{areSpotsLoading ? "—" : spots.length}</dd></div>
              <div><dt>{t("reportsStat")}</dt><dd>{areReportsLoading ? "—" : reports.length}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className={styles.content} aria-labelledby="angler-spots-title">
        <div className={styles.heading}>
          <p className={styles.sectionLabel}>{t("spotsEyebrow")}</p>
          <h2 id="angler-spots-title">{t("spotsTitle")}</h2>
        </div>
        {spotsError ? <p className={styles.error} role="alert">{t("spotsError")}</p> : null}
        {areSpotsLoading ? <p className={styles.stateText} aria-live="polite">{t("spotsLoading")}</p> : null}
        {!areSpotsLoading && !spotsError && spots.length === 0 ? <p className={styles.stateText}>{t("spotsEmpty")}</p> : null}
        {spots.length > 0 ? (
          <ul className={styles.spotGrid} aria-label={t("spotsList")}>
            {spots.map((spot) => (
              <li className={styles.spotItem} key={spot.id}>
                <UserSpotCard spot={spot} href={`/community/${spot.id}`} actionLabel={t("openSpot")} showVisibility={false} />
                <AnglerSpotPhotoStrip spotId={spot.id} />
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className={styles.content} aria-labelledby="angler-reports-title">
        <div className={styles.heading}>
          <p className={styles.sectionLabel}>{t("reportsEyebrow")}</p>
          <h2 id="angler-reports-title">{t("reportsTitle")}</h2>
        </div>
        {reportsError ? <p className={styles.error} role="alert">{t("reportsError")}</p> : null}
        {areReportsLoading ? <p className={styles.stateText} aria-live="polite">{t("reportsLoading")}</p> : null}
        {!areReportsLoading && !reportsError && reports.length === 0 ? <p className={styles.stateText}>{t("reportsEmpty")}</p> : null}
        {reports.length > 0 ? (
          <ol className={styles.reportList} aria-label={t("reportsList")}>
            {reports.map((report) => <li key={report.id}><FishingReportCard actions={<ManageFishingReportActions report={report} />} discussion={<ReportDiscussion report={report} />} reaction={<ContentReactionButton targetType="report" targetId={report.id} />} report={report} showAuthor={false} /></li>)}
          </ol>
        ) : null}
      </section>
    </main>
  );
}
