"use client";

import Link from "next/link";
import { usePublishedUserSpot } from "@/entities/user-spot";
import { ShareUserSpotButton } from "@/features/share-user-spot";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./community-spot-details-page.module.scss";

type CommunitySpotDetailsPageProps = { spotId: string };

export function CommunitySpotDetailsPage({ spotId }: CommunitySpotDetailsPageProps) {
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
            <Link href="/">Головна</Link><span aria-hidden="true">/</span><Link href="/community">Спільнота</Link><span aria-hidden="true">/</span><span aria-current="page">{spot.name}</span>
          </nav>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>Від спільноти BiteMap</p>
              <h1>{spot.name}</h1>
              <p className={styles.region}>{spot.settlement ? `${spot.region} · ${spot.settlement}` : spot.region}</p>
              <p className={styles.description}>{spot.description}</p>
              <ShareUserSpotButton spotId={spot.id} spotName={spot.name} />
            </div>
            <div className={styles.visual} data-tone={spot.tone} aria-hidden="true"><span /><span /><span /></div>
          </div>
        </div>
      </section>
      <section className={styles.details} aria-labelledby="community-spot-details-title">
        <div><p className={styles.sectionLabel}>Коротко про локацію</p><h2 id="community-spot-details-title">Плануй виїзд впевненіше</h2></div>
        <dl className={styles.facts}>
          <div><dt>Тип водойми</dt><dd>{spot.waterType}</dd></div>
          <div><dt>Локація</dt><dd>{spot.settlement || spot.community || spot.region}</dd></div>
          <div><dt>Доступ</dt><dd>{spot.access}</dd></div>
        </dl>
        <div className={styles.fishSection}><div><p className={styles.sectionLabel}>Що можна зустріти</p><h2>Риба у водоймі</h2></div><ul className={styles.fishList} aria-label="Види риби">{spot.fish.map((fish) => <li key={fish}>{fish}</li>)}</ul></div>
      </section>
    </main>
  );
}
