"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { FishingReportCard } from "@/entities/fishing-report";
import { useFollowingActivity, type FeedActivity } from "@/entities/activity-feed";
import { UserSpotCard } from "@/entities/user-spot";
import { ReportDiscussion } from "@/features/discuss-report";
import { ContentReactionButton } from "@/features/react-to-content";
import { ReportContentAction } from "@/features/content-report";
import { Link } from "@/shared/lib/i18n";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./activity-feed-page.module.scss";

function ActivityItem({ activity }: { activity: FeedActivity }) {
  const t = useTranslations("activityFeed");
  const locale = useLocale();
  const authorName = activity.author.name;
  const action = activity.type === "report"
    ? t("sharedReport")
    : activity.type === "spot"
      ? t("sharedSpot")
      : t("sharedPhoto");
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(activity.createdAt));

  return (
    <article className={styles.item}>
      <div className={styles.author}>
        <Link className={styles.avatar} href={`/anglers/${activity.author.id}`} aria-label={t("authorProfile", { name: authorName })}>
          {activity.author.photoURL
            ? <Image src={activity.author.photoURL} alt="" width={48} height={48} />
            : <span aria-hidden="true">{authorName.trim().slice(0, 1).toUpperCase()}</span>}
        </Link>
        <div className={styles.authorDetails}>
          <p><Link href={`/anglers/${activity.author.id}`}>{authorName}</Link> {action}</p>
          <time dateTime={new Date(activity.createdAt).toISOString()}>{date}</time>
        </div>
      </div>

      {activity.type === "report" ? (
        <FishingReportCard actions={<ReportContentAction authorId={activity.report.authorId} contextType={activity.report.targetType} parentId={activity.report.targetId} targetType="fishing-report" targetId={activity.report.id} />} discussion={<ReportDiscussion report={activity.report} />} hideAuthor reaction={<ContentReactionButton targetType="report" targetId={activity.report.id} />} report={activity.report} target={{ href: activity.targetHref, label: activity.targetName }} />
      ) : null}

      {activity.type === "spot" ? (
        <div className={styles.spotCard}>
          <UserSpotCard spot={activity.spot} href={`/community/${activity.spot.id}`} actionLabel={t("openSpot")} showVisibility={false} />
        </div>
      ) : null}

      {activity.type === "image" ? (
        <figure className={styles.photo}>
          <Link className={styles.photoLink} href={activity.targetHref} aria-label={t("openTarget", { name: activity.targetName })}>
            <Image fill unoptimized src={activity.image.url} alt={locale === "en" ? activity.image.caption.en || activity.image.caption.uk : activity.image.caption.uk} sizes="(max-width: 700px) 100vw, 680px" />
          </Link>
          <figcaption>
            <Link href={activity.targetHref}>{activity.targetName}</Link>
            <span>{locale === "en" ? activity.image.caption.en || activity.image.caption.uk : activity.image.caption.uk}</span>
          </figcaption>
          <div className={styles.photoReaction}><ContentReactionButton targetType="image" targetId={activity.image.id} /></div>
        </figure>
      ) : null}
    </article>
  );
}

export function ActivityFeedPage() {
  const t = useTranslations("activityFeed");
  const { activities, hasError, isAuthLoading, isLoading, user } = useFollowingActivity();

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

      <section className={styles.content} aria-labelledby="activity-feed-title">
        <div className={styles.heading}>
          <div><p className={styles.sectionLabel}>{t("section")}</p><h2 id="activity-feed-title">{t("sectionTitle")}</h2></div>
          {!isLoading && !hasError && user ? <p className={styles.count}>{t("count", { count: activities.length })}</p> : null}
        </div>

        {isAuthLoading ? <p className={styles.state} aria-live="polite">{t("loading")}</p> : null}
        {!isAuthLoading && !user ? (
          <div className={styles.empty}><p>{t("signInText")}</p><Link href="/login">{t("signIn")}</Link></div>
        ) : null}
        {user && isLoading ? <p className={styles.state} aria-live="polite">{t("loading")}</p> : null}
        {user && !isLoading && hasError ? <p className={styles.error} role="alert">{t("error")}</p> : null}
        {user && !isLoading && !hasError && activities.length === 0 ? (
          <div className={styles.empty}><p className={styles.sectionLabel}>{t("emptyEyebrow")}</p><h3>{t("emptyTitle")}</h3><p>{t("emptyText")}</p><Link href="/community">{t("findAnglers")}</Link></div>
        ) : null}
        {user && !isLoading && !hasError && activities.length > 0 ? (
          <ol className={styles.list} aria-label={t("listLabel")}>
            {activities.map((activity) => <li key={activity.id}><ActivityItem activity={activity} /></li>)}
          </ol>
        ) : null}
      </section>
    </main>
  );
}
