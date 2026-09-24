"use client";

import Link from "next/link";
import type { UserSpot, UserSpotFormValues } from "@/entities/user-spot";
import { UserSpotForm, useUserSpot } from "@/features/manage-user-spot";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./user-spot-form-page.module.scss";

type UserSpotFormPageProps = {
  mode: "create" | "edit";
  spotId?: string;
};

function toFormValues(spot: UserSpot): UserSpotFormValues {
  return {
    access: spot.access,
    description: spot.description,
    fish: spot.fish.join(", "),
    name: spot.name,
    region: spot.region,
    regionId: spot.regionId ?? "",
    community: spot.community ?? "",
    communityId: spot.communityId ?? "",
    settlement: spot.settlement ?? "",
    settlementId: spot.settlementId ?? "",
    tone: spot.tone,
    visibility: spot.visibility,
    waterType: spot.waterType,
  };
}

function EditUserSpotForm({ spotId }: { spotId: string }) {
  const { error, isAuthLoading, isLoading, spot, user } = useUserSpot(spotId);

  if (!user && !isAuthLoading) {
    return (
      <div className={styles.state}>
        <h2>Увійди, щоб редагувати водойму.</h2>
        <Link href="/login">Увійти в BiteMap</Link>
      </div>
    );
  }

  if (isAuthLoading || isLoading) {
    return <div className={styles.state} aria-live="polite">Відкриваємо картку водойми…</div>;
  }

  if (error || !spot) {
    return (
      <div className={styles.state}>
        <h2>Ця водойма недоступна.</h2>
        <p>{error || "Можливо, її не існує або вона належить іншому користувачу."}</p>
        <Link href="/my-spots">Повернутися до моїх водойм</Link>
      </div>
    );
  }

  return <UserSpotForm initialValues={toFormValues(spot)} mode="edit" spotId={spot.id} />;
}

export function UserSpotFormPage({ mode, spotId }: UserSpotFormPageProps) {
  const isEditing = mode === "edit";

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{isEditing ? "Твоя картка" : "Нова точка на карті"}</p>
          <h1>{isEditing ? "Уточни деталі." : "Додай свою водойму."}</h1>
          <p>{isEditing ? "Онови деталі місця або зміни його видимість для спільноти." : "Обери точне місце зі списку та виріши, залишити водойму приватною чи опублікувати."}</p>
        </div>
      </section>

      <section className={styles.content} aria-labelledby="user-spot-form-title">
        <div className={styles.intro}>
          <p className={styles.sectionLabel}>{isEditing ? "Редагування" : "Власна водойма"}</p>
          <h2 id="user-spot-form-title">{isEditing ? "Актуальна інформація" : "Коротко й по суті"}</h2>
          <p>Поля зі зірочкою не потрібні: достатньо заповнити всі основні деталі природною мовою.</p>
        </div>

        <div className={styles.panel}>
          {isEditing && spotId ? <EditUserSpotForm spotId={spotId} /> : <UserSpotForm mode="create" />}
        </div>
      </section>
    </main>
  );
}
