"use client";

import { Link } from "@/shared/lib/i18n";
import { getFishingArticleTranslation, useFishingArticle } from "@/entities/fishing-article";
import { useLocale, useTranslations } from "next-intl";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./article-details-page.module.scss";

type ArticleDetailsPageProps = { slug: string };

export function ArticleDetailsPage({ slug }: ArticleDetailsPageProps) {
  const locale = useLocale();
  const t = useTranslations("articles");
  const { article, error, isLoading } = useFishingArticle(slug);

  if (isLoading && !article) {
    return <main className={styles.state} aria-live="polite">{t("loadingArticle")}</main>;
  }

  if (!article) {
    return (
      <main className={styles.state}>
        <SiteHeader />
        <h1>{error ? t("unavailableArticle") : t("notFound")}</h1>
        <Link href="/articles">{t("back")}</Link>
      </main>
    );
  }

  const content = getFishingArticleTranslation(article, locale);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent} data-page-hero>
          <Link className={styles.back} href="/articles"><span aria-hidden="true">←</span>{t("back")}</Link>
          <p className={styles.eyebrow}>{content.category} · {t("publishedLabel")}</p>
          <h1>{content.title}</h1>
          <p className={styles.lead}>{content.excerpt}</p>
          <span className={styles.readTime}>{t("readTime", { minutes: article.readMinutes })}</span>
        </div>
      </section>
      <div className={styles.articleLayout}>
        <nav className={styles.contents} aria-label={t("contents")}>
          <p className={styles.contentsTitle}>{t("contents")}</p>
          <ol>
            {content.sections.map((section, index) => (
              <li key={`${article.slug}-section-${index + 1}`}>
                <a href={`#article-section-${index + 1}`}>{section.heading}</a>
              </li>
            ))}
          </ol>
        </nav>
        <article className={styles.sections}>
          {content.sections.map((section, index) => (
            <section className={styles.section} id={`article-section-${index + 1}`} key={`${article.slug}-section-${index + 1}`}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={`${article.slug}-section-${index + 1}-paragraph-${paragraphIndex + 1}`}>{paragraph}</p>
              ))}
              {section.tips ? (
                <ul className={styles.tips}>
                  {section.tips.map((tip, tipIndex) => <li key={`${article.slug}-section-${index + 1}-tip-${tipIndex + 1}`}>{tip}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </div>
      <div className={styles.footer}>
        <Link className={styles.footerLink} href="/articles">{t("back")} <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}
