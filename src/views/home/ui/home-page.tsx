import Link from "next/link";
import { FishingSpotCard, featuredFishingSpots } from "@/entities/fishing-spot";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./home-page.module.scss";

export function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Риболовля ближче до природи</p>
          <h1>
            Знайди своє
            <span> місце для улову.</span>
          </h1>
          <p className={styles.lead}>
            BiteMap допомагає обрати водойму, перевірити умови та зберегти найкращі
            моменти риболовлі.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} href="/spots">
              Знайти водойму
              <span aria-hidden="true">↗</span>
            </Link>
            <a className={styles.secondaryAction} href="#how-it-works">
              Як це працює
            </a>
          </div>
        </div>

        <div className={styles.waterTexture} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className={styles.spotsSection} id="popular-spots">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.sectionLabel}>Відкривай нове</p>
            <h2>Популярні водойми</h2>
          </div>
          <p className={styles.spotCount}>3 локації у добірці</p>
        </div>

        <div className={styles.spotGrid}>
          {featuredFishingSpots.map((spot) => (
            <FishingSpotCard key={spot.id} spot={spot} href={`/spots/${spot.slug}`} />
          ))}
        </div>
      </section>

      <section className={styles.stepsSection} id="how-it-works">
        <p className={styles.sectionLabel}>Просто почати</p>
        <h2>
          Більше часу біля води.
          <br />
          Менше — на пошук.
        </h2>
      </section>
    </main>
  );
}
