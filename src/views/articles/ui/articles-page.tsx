"use client";

import { useLocale, useTranslations } from "next-intl";
import { fishingArticles, FishingArticleCard } from "@/entities/fishing-article";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./articles-page.module.scss";

export function ArticlesPage() {
  const locale = useLocale();
  const t = useTranslations("articles");

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
      <section className={styles.library} aria-labelledby="articles-title">
        <div className={styles.heading}>
          <div>
            <p className={styles.sectionLabel}>{t("section")}</p>
            <h2 id="articles-title">{t("sectionTitle")}</h2>
          </div>
          <p className={styles.count}>{fishingArticles.length}</p>
        </div>
        <div className={styles.grid}>
          {fishingArticles.map((article) => (
            <FishingArticleCard
              key={article.slug}
              article={article}
              locale={locale}
              readTimeLabel={t("readTime", { minutes: article.readMinutes })}
              actionLabel={t("readArticle")}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
