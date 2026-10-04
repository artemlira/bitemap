"use client";

import { useState } from "react";
import { Link } from "@/shared/lib/i18n";
import { useLocale, useTranslations } from "next-intl";
import { useAdminStatus } from "@/entities/admin";
import { getFishingArticleTranslation, useFishingArticles } from "@/entities/fishing-article";
import { removeFishingArticle } from "@/features/manage-fishing-article";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./admin-articles-page.module.scss";

export function AdminArticlesPage() {
  const t = useTranslations("articleAdmin");
  const { isAdmin, isLoading: isAdminLoading, user } = useAdminStatus();
  const { articles, error: articlesError, isLoading } = useFishingArticles();
  const [busySlug, setBusySlug] = useState("");
  const [actionError, setActionError] = useState("");
  const locale = useLocale();

  async function deleteArticle(slug: string, restoreBuiltIn = false) {
    const confirmation = restoreBuiltIn ? t("restoreConfirmation", { slug }) : t("deleteConfirmation", { slug });
    if (!window.confirm(confirmation)) return;

    setBusySlug(slug);
    setActionError("");
    try {
      await removeFishingArticle(slug);
    } catch {
      setActionError(t("actionError"));
    } finally {
      setBusySlug("");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent} data-page-hero>
          <div>
            <p className={styles.eyebrow}>{t("eyebrow")}</p>
            <h1>{t("title")}</h1>
            <p className={styles.lead}>{t("lead")}</p>
          </div>
        </div>
      </section>
      <section className={styles.content} aria-labelledby="article-admin-list-title">
        {isAdminLoading ? <p aria-live="polite">{t("checking")}</p> : null}
        {!isAdminLoading && !user ? (
          <aside className={styles.notice}>
            <h2>{t("signInTitle")}</h2>
            <p>{t("signInText")}</p>
            <Link className={styles.primary} href="/login">{t("signInAction")}</Link>
          </aside>
        ) : null}
        {!isAdminLoading && user && !isAdmin ? (
          <aside className={styles.notice}>
            <h2>{t("accessTitle")}</h2>
            <p>{t("accessText")}</p>
            <code>{user.uid}</code>
          </aside>
        ) : null}
        {!isAdminLoading && isAdmin ? (
          <>
            <div className={styles.toolbar}>
              <div>
                <p className={styles.sectionLabel}>{t("library")}</p>
                <h2 id="article-admin-list-title">{t("manageTitle")}</h2>
              </div>
              <Link className={styles.primary} href="/admin/articles/new">{t("create")}</Link>
            </div>
            {articlesError ? <p className={styles.error} role="alert">{t("loadError")}</p> : null}
            {isLoading ? <p className={styles.empty} aria-live="polite">{t("loading")}</p> : null}
            {!isLoading && articles.length === 0 ? <p className={styles.empty}>{t("empty")}</p> : null}
            <div className={styles.list}>
              {articles.map((article) => {
                const content = getFishingArticleTranslation(article, locale);
                const isBuiltIn = article.isBuiltIn === true;
                const hasOverride = isBuiltIn && article.authorId !== "bitemap";

                return (
                  <article className={styles.row} key={article.slug}>
                    <div>
                      <h3>{content.title}</h3>
                      <div className={styles.meta}>
                        <span>/{article.slug}</span>
                        <span className={styles.badge}>{article.status === "published" ? t("published") : t("draft")}</span>
                        {isBuiltIn ? <span>{t("builtIn")}</span> : null}
                      </div>
                    </div>
                    <div className={styles.controls}>
                      <Link className={styles.button} href={`/admin/articles/${article.slug}/edit`}>{t("edit")}</Link>
                      {isBuiltIn && hasOverride ? (
                        <button className={`${styles.button} ${styles.danger}`} type="button" disabled={busySlug === article.slug} onClick={() => void deleteArticle(article.slug, true)}>
                          {busySlug === article.slug ? t("deleting") : t("restore")}
                        </button>
                      ) : !isBuiltIn ? (
                        <button className={`${styles.button} ${styles.danger}`} type="button" disabled={busySlug === article.slug} onClick={() => void deleteArticle(article.slug)}>
                          {busySlug === article.slug ? t("deleting") : t("delete")}
                        </button>
                      ) : null}
                      {article.status === "published" ? <Link className={styles.button} href={`/articles/${article.slug}`}>{t("open")}</Link> : null}
                    </div>
                  </article>
                );
              })}
            </div>
            {actionError ? <p className={styles.error} role="alert">{actionError}</p> : null}
          </>
        ) : null}
      </section>
    </main>
  );
}
