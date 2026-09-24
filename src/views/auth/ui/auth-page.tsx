import Link from "next/link";
import { AuthForm, type AuthMode } from "@/features/authentication";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./auth-page.module.scss";

type AuthPageProps = {
  mode: AuthMode;
};

const contentByMode = {
  login: {
    eyebrow: "Повертаєшся до води",
    title: "Радий бачити знову.",
    description: "Увійди, щоб зберігати локації й пізніше вести власний щоденник уловів.",
    secondaryAction: "Створити акаунт",
    secondaryHref: "/register",
    secondaryLead: "Ще не маєш акаунта?",
  },
  register: {
    eyebrow: "Почни свою карту",
    title: "Створи акаунт рибалки.",
    description: "Зберігай водойми, плануй виїзди й поступово збирай власну історію уловів.",
    secondaryAction: "Увійти",
    secondaryHref: "/login",
    secondaryLead: "Вже маєш акаунт?",
  },
} as const;

export function AuthPage({ mode }: AuthPageProps) {
  const content = contentByMode[mode];

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
            <p className={styles.sectionLabel}>BiteMap account</p>
            <h2 id="auth-form-title">{mode === "register" ? "Реєстрація" : "Вхід"}</h2>
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
