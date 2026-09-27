"use client";

import { Link } from "@/shared/lib/i18n";
import { useTranslations } from "next-intl";
import type { UserSpot, UserSpotFormValues } from "@/entities/user-spot";
import { SpotImageGallery } from "@/entities/spot-image";
import { ManageSpotImageActions } from "@/features/manage-spot-image";
import { UserSpotForm, useUserSpot } from "@/features/manage-user-spot";
import { SpotImageUpload } from "@/features/upload-spot-image";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./user-spot-form-page.module.scss";

type UserSpotFormPageProps = {
  mode: "create" | "edit";
  spotId?: string;
};

function toFormValues(spot: UserSpot): UserSpotFormValues {
  return {
    access: spot.access,
    accessEn: spot.translations?.en?.access ?? "",
    description: spot.description,
    descriptionEn: spot.translations?.en?.description ?? "",
    fish: spot.fish.join(", "),
    fishEn: spot.translations?.en?.fish?.join(", ") ?? "",
    latitude: spot.latitude ?? null,
    longitude: spot.longitude ?? null,
    name: spot.name,
    nameEn: spot.translations?.en?.name ?? "",
    region: spot.region,
    regionId: spot.regionId ?? "",
    community: spot.community ?? "",
    communityId: spot.communityId ?? "",
    settlement: spot.settlement ?? "",
    settlementId: spot.settlementId ?? "",
    tone: spot.tone,
    visibility: spot.visibility,
    waterType: spot.waterType,
    waterTypeEn: spot.translations?.en?.waterType ?? "",
  };
}

function EditUserSpotForm({ spotId }: { spotId: string }) {
  const t = useTranslations("userSpotEditor");
  const { isAuthLoading, isLoading, spot, user } = useUserSpot(spotId);

  if (!user && !isAuthLoading) {
    return (
      <div className={styles.state}>
        <h2>{t("signInTitle")}</h2>
        <Link href="/login">{t("signIn")}</Link>
      </div>
    );
  }

  if (isAuthLoading || isLoading) {
    return <div className={styles.state} aria-live="polite">{t("loading")}</div>;
  }

  if (!spot) {
    return (
      <div className={styles.state}>
        <h2>{t("unavailableTitle")}</h2>
        <p>{t("unavailableFallback")}</p>
        <Link href="/my-spots">{t("back")}</Link>
      </div>
    );
  }

  return (
    <>
      <UserSpotForm initialValues={toFormValues(spot)} mode="edit" spotId={spot.id} />
      <section className={styles.gallery} aria-labelledby="owner-gallery-title">
        <div>
          <p className={styles.sectionLabel}>{t("galleryEyebrow")}</p>
          <h3 id="owner-gallery-title">{t("galleryTitle")}</h3>
        </div>
        <SpotImageGallery
          targetType="user-spot"
          targetId={spot.id}
          renderActions={(image) => <ManageSpotImageActions image={image} targetType="user-spot" targetId={spot.id} />}
        />
        <SpotImageUpload targetType="user-spot" targetId={spot.id} />
      </section>
    </>
  );
}

export function UserSpotFormPage({ mode, spotId }: UserSpotFormPageProps) {
  const isEditing = mode === "edit";
  const t = useTranslations("userSpotEditor");

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{isEditing ? t("editEyebrow") : t("newEyebrow")}</p>
          <h1>{isEditing ? t("editTitle") : t("newTitle")}</h1>
          <p>{isEditing ? t("editLead") : t("newLead")}</p>
        </div>
      </section>

      <section className={styles.content} aria-labelledby="user-spot-form-title">
        <div className={styles.intro}>
          <p className={styles.sectionLabel}>{isEditing ? t("editSection") : t("newSection")}</p>
          <h2 id="user-spot-form-title">{isEditing ? t("editSectionTitle") : t("newSectionTitle")}</h2>
          <p>{t("formLead")}</p>
        </div>

        <div className={styles.panel}>
          {isEditing && spotId ? <EditUserSpotForm spotId={spotId} /> : <UserSpotForm mode="create" />}
        </div>
      </section>
    </main>
  );
}
