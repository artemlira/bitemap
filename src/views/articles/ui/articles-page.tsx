"use client";

import { useLocale, useTranslations } from "next-intl";
import { FishingArticleCard, useFishingArticles, type ManagedFishingArticle } from "@/entities/fishing-article";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./articles-page.module.scss";

export function ArticlesPage({ extraArticles = [] }: { extraArticles?: readonly ManagedFishingArticle[] }) {
  const locale = useLocale();
  const t = useTranslations("articles");
  const { articles: ownArticles, error, isLoading } = useFishingArticles();
  const articles = [...extraArticles, ...ownArticles];

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
          <p className={styles.count}>{t("count", { count: articles.length })}</p>
        </div>
        {error ? <p role="status">{t("loadError")}</p> : null}
        {isLoading ? <p aria-live="polite">{t("loadingArticles")}</p> : null}
        <div className={styles.grid} data-stagger>
          {articles.map((article) => (
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
