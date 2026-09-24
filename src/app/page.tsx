import Link from "next/link";
import { SiteHeader } from "@/components/site-header/site-header";
import styles from "./page.module.scss";

const featuredSpots = [
  { name: "Озеро Блакитне", region: "Київська область", fish: "Короп · щука · окунь" },
  { name: "Дністровські затоки", region: "Одеська область", fish: "Судак · лящ · сом" },
  { name: "Річка Ворскла", region: "Полтавська область", fish: "Голавль · окунь · щука" },
];

export default function Home() {
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
            <Link className={styles.primaryAction} href="#popular-spots">
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
          {featuredSpots.map((spot, index) => (
            <article className={styles.spotCard} key={spot.name}>
              <div
                className={`${styles.spotVisual} ${styles[`spotVisual${index + 1}`]}`}
                aria-hidden="true"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className={styles.spotContent}>
                <p>{spot.region}</p>
                <h3>{spot.name}</h3>
                <span>{spot.fish}</span>
              </div>
            </article>
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
