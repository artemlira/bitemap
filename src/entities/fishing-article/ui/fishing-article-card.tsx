import { Link } from "@/shared/lib/i18n";
import { fishingArticles } from "../model/article-data";
import type { FishingArticle } from "../model/types";
import { getFishingArticleTranslation } from "../model/localization";
import styles from "./fishing-article-card.module.scss";

type FishingArticleCardProps = {
  article: FishingArticle;
  locale: string;
  readTimeLabel: string;
  actionLabel: string;
};

export function FishingArticleCard({ article, locale, readTimeLabel, actionLabel }: FishingArticleCardProps) {
  const content = getFishingArticleTranslation(article, locale);

  return (
    <Link className={styles.card} href={`/articles/${article.slug}`}>
      <div className={styles.visual} data-tone={article.tone} aria-hidden="true">
        <span className={styles.category}>{content.category}</span>
        <span className={styles.number}>{String(fishingArticlesIndex(article.slug)).padStart(2, "0")}</span>
      </div>
      <div className={styles.content}>
        <p className={styles.meta}>{readTimeLabel}</p>
        <h3 className={styles.title}>{content.title}</h3>
        <p className={styles.excerpt}>{content.excerpt}</p>
        <span className={styles.action}>{actionLabel} <span aria-hidden="true">↗</span></span>
      </div>
    </Link>
  );
}

function fishingArticlesIndex(slug: string) {
  const newestFirst = [
    "feeder-paternoster-rig",
    "flat-feeder-hair-rig",
    "shock-leader-to-mainline",
    "weather-and-fishing-plan",
    "accurate-feeder-groundbaiting",
    "choose-a-fishing-spot",
  ];
  const editorialIndex = newestFirst.indexOf(slug);
  return editorialIndex >= 0 ? editorialIndex + 1 : fishingArticles.findIndex((article) => article.slug === slug) + 1;
}
