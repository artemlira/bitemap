"use client";

import { Link } from "@/shared/lib/i18n";
import { useTranslations } from "next-intl";
import { useAdminStatus } from "@/entities/admin";
import { useFishingArticle } from "@/entities/fishing-article";
import { FishingArticleEditor } from "@/features/manage-fishing-article";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./admin-article-editor-page.module.scss";

type AdminArticleEditorPageProps = { slug?: string };

export function AdminArticleEditorPage({ slug }: AdminArticleEditorPageProps) {
  const t = useTranslations("articleAdmin");
  const { isAdmin, isLoading: isAdminLoading, user } = useAdminStatus();
  const { article, error: articleError, isLoading: isArticleLoading } = useFishingArticle(slug ?? null);
  const isLoading = isAdminLoading || Boolean(slug && isArticleLoading);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent} data-page-hero>
          <Link className={styles.back} href="/admin/articles">← {t("backToList")}</Link>
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h1>{slug ? t("editTitle") : t("newTitle")}</h1>
          <p className={styles.lead}>{t("editorLead")}</p>
        </div>
      </section>
      <section className={styles.content}>
        {isLoading ? <p aria-live="polite">{t("checking")}</p> : null}
        {!isLoading && !user ? (
          <div className={styles.state}>
            <h2>{t("signInTitle")}</h2>
            <p>{t("signInText")}</p>
            <Link href="/login">{t("signInAction")}</Link>
          </div>
        ) : null}
        {!isLoading && user && !isAdmin ? (
          <div className={styles.state}>
            <h2>{t("accessTitle")}</h2>
            <p>{t("accessText")}</p>
            <code>{user.uid}</code>
          </div>
        ) : null}
        {!isLoading && isAdmin && user && slug && !article ? (
          <div className={styles.state}>
            <h2>{t("articleUnavailable")}</h2>
            <p>{articleError ? t("loadError") : t("articleUnavailableText")}</p>
            <Link href="/admin/articles">{t("backToList")}</Link>
          </div>
        ) : null}
        {!isLoading && isAdmin && user && (!slug || article) ? (
          <FishingArticleEditor article={article ?? undefined} authorId={user.uid} labels={t.raw("editor") as Record<string, string>} />
        ) : null}
      </section>
    </main>
  );
}
