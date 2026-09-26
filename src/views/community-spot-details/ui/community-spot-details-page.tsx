"use client";

import { Link } from "@/shared/lib/i18n";
import { useLocale } from "next-intl";
import { getUserSpotFish, getUserSpotText, usePublishedUserSpot } from "@/entities/user-spot";
import { SpotImageGallery } from "@/entities/spot-image";
import { ShareUserSpotButton } from "@/features/share-user-spot";
import { SpotImageUpload } from "@/features/upload-spot-image";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./community-spot-details-page.module.scss";

type CommunitySpotDetailsPageProps = { spotId: string };

export function CommunitySpotDetailsPage({ spotId }: CommunitySpotDetailsPageProps) {
  const locale = useLocale();
  const { error, isLoading, spot } = usePublishedUserSpot(spotId);

  if (isLoading) {
    return <main className={styles.state} aria-live="polite">Відкриваємо водойму…</main>;
  }

  if (error || !spot) {
    return (
      <main className={styles.state}>
        <h1>Водойма недоступна.</h1>
        <p>{error || "Можливо, автор зробив її приватною."}</p>
        <Link href="/community">Повернутися до спільноти</Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent}>
          <nav className={styles.breadcrumbs} aria-label="Навігація шляхом">
            <Link href="/">Головна</Link><span aria-hidden="true">/</span><Link href="/community">Спільнота</Link><span aria-hidden="true">/</span><span aria-current="page">{getUserSpotText(spot, "name", locale)}</span>
          </nav>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>Від спільноти BiteMap</p>
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
        <div><p className={styles.sectionLabel}>Коротко про локацію</p><h2 id="community-spot-details-title">Плануй виїзд впевненіше</h2></div>
        <dl className={styles.facts}>
          <div><dt>Тип водойми</dt><dd>{getUserSpotText(spot, "waterType", locale)}</dd></div>
          <div><dt>Локація</dt><dd>{spot.settlement || spot.community || spot.region}</dd></div>
          <div><dt>Доступ</dt><dd>{getUserSpotText(spot, "access", locale)}</dd></div>
        </dl>
        <div className={styles.fishSection}><div><p className={styles.sectionLabel}>Що можна зустріти</p><h2>Риба у водоймі</h2></div><ul className={styles.fishList} aria-label="Види риби">{getUserSpotFish(spot, locale).map((fish) => <li key={fish}>{fish}</li>)}</ul></div>
        <section className={styles.gallery} aria-labelledby="community-gallery-title">
          <div><p className={styles.sectionLabel}>Фотографії спільноти</p><h2 id="community-gallery-title">Вода очима рибалок</h2></div>
          <SpotImageGallery targetType="user-spot" targetId={spot.id} />
          <SpotImageUpload targetType="user-spot" targetId={spot.id} />
        </section>
      </section>
    </main>
  );
}
