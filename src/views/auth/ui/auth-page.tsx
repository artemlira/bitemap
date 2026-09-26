import { useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import { AuthForm, type AuthMode } from "@/features/authentication";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./auth-page.module.scss";

type AuthPageProps = {
  mode: AuthMode;
};

export function AuthPage({ mode }: AuthPageProps) {
  const t = useTranslations("auth");
  const isRegistration = mode === "register";
  const content = isRegistration
    ? {
        description: t("register.description"),
        eyebrow: t("register.eyebrow"),
        heading: t("register.heading"),
        secondaryAction: t("register.secondaryAction"),
        secondaryHref: "/login",
        secondaryLead: t("register.secondaryLead"),
        title: t("register.title"),
      }
    : {
        description: t("login.description"),
        eyebrow: t("login.eyebrow"),
        heading: t("login.heading"),
        secondaryAction: t("login.secondaryAction"),
        secondaryHref: "/register",
        secondaryLead: t("login.secondaryLead"),
        title: t("login.title"),
      };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>
      </section>

      <section className={styles.authSection} aria-labelledby="auth-form-title">
        <div className={styles.formCard}>
          <div className={styles.formHeading}>
            <p className={styles.sectionLabel}>{t("account")}</p>
            <h2 id="auth-form-title">{content.heading}</h2>
          </div>
          <AuthForm mode={mode} />
          <p className={styles.secondaryAction}>
            {content.secondaryLead} <Link href={content.secondaryHref}>{content.secondaryAction}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
