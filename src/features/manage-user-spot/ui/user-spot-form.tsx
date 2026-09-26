"use client";

import { Link, useRouter } from "@/shared/lib/i18n";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { UserSpotFormValues } from "@/entities/user-spot";
import { useAuth } from "@/shared/lib/auth";
import { createUserSpot, updateUserSpot } from "../api/user-spots";
import { getCommunities, getSettlements, regions } from "../model/location-options";
import { validateUserSpot, type UserSpotFormErrors } from "../model/validation";
import styles from "./user-spot-form.module.scss";

type UserSpotFormProps = {
  initialValues?: UserSpotFormValues;
  mode: "create" | "edit";
  spotId?: string;
};

const defaultValues: UserSpotFormValues = {
  access: "Вільний доступ",
  description: "",
  fish: "",
  name: "",
  region: "",
  regionId: "",
  community: "",
  communityId: "",
  settlement: "",
  settlementId: "",
  tone: "lagoon",
  visibility: "private",
  waterType: "",
  accessEn: "",
  descriptionEn: "",
  fishEn: "",
  nameEn: "",
  waterTypeEn: "",
};

const tones = [
  { value: "lagoon", labelKey: "toneLagoon" },
  { value: "sunset", labelKey: "toneSunset" },
  { value: "river", labelKey: "toneRiver" },
  { value: "reeds", labelKey: "toneReeds" },
] as const;

const accessOptions = [
  { value: "Вільний доступ", labelKey: "freeAccess" },
  { value: "Платна водойма", labelKey: "paidAccess" },
  { value: "Уточнюйте правила", labelKey: "checkRules" },
] as const;

export function UserSpotForm({ initialValues = defaultValues, mode, spotId }: UserSpotFormProps) {
  const { isLoading: isAuthLoading, user } = useAuth();
  const router = useRouter();
  const t = useTranslations("userSpotForm");
  const [values, setValues] = useState<UserSpotFormValues>(initialValues);
  const [errors, setErrors] = useState<UserSpotFormErrors>({});
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = mode === "edit";
  const communities = values.regionId ? getCommunities(values.regionId) : [];
  const settlements = values.communityId ? getSettlements(values.communityId) : [];

  function updateValue(name: keyof UserSpotFormValues, value: string) {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  function updateRegion(regionId: string) {
    const region = regions.find((item) => item.id === regionId);

    setValues((currentValues) => ({
      ...currentValues,
      community: "",
      communityId: "",
      region: region?.name ?? "",
      regionId,
      settlement: "",
      settlementId: "",
    }));
  }

  function updateCommunity(communityId: string) {
    const community = communities.find((item) => item.id === communityId);

    setValues((currentValues) => ({
      ...currentValues,
      community: community?.nameFull ?? "",
      communityId,
      settlement: "",
      settlementId: "",
    }));
  }

  function updateSettlement(settlementId: string) {
    const settlement = settlements.find((item) => item.id === settlementId);

    setValues((currentValues) => ({
      ...currentValues,
      settlement: settlement?.nameFull ?? "",
      settlementId,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionError("");

    const nextErrors = validateUserSpot(values, {
      name: t("validationName"),
      region: t("validationRegion"),
      community: t("validationCommunity"),
      settlement: t("validationSettlement"),
      waterType: t("validationWaterType"),
      fish: t("validationFish"),
      description: t("validationDescription"),
    });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !user) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && spotId) {
        await updateUserSpot(spotId, values);
      } else {
        await createUserSpot(user.uid, values);
      }

      router.push("/my-spots");
    } catch {
      setSubmissionError(t("submissionError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user && !isAuthLoading) {
    return (
      <div className={styles.signInNotice}>
        <p>{t("signIn")}</p>
        <Link href="/login">{t("signInLink")}</Link>
      </div>
    );
  }

  if (!user) {
    return <p className={styles.loading}>{t("checking")}</p>;
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit} aria-busy={isSubmitting}>
      <div className={styles.grid}>
        <label className={styles.field} htmlFor="user-spot-name">
          <span>{t("name")}</span>
          <input
            id="user-spot-name"
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={errors.name ? "user-spot-name-error" : undefined}
          />
          {errors.name ? <small id="user-spot-name-error">{errors.name}</small> : null}
        </label>

        <label className={styles.field} htmlFor="user-spot-region">
          <span>{t("region")}</span>
          <select
            id="user-spot-region"
            value={values.regionId}
            onChange={(event) => updateRegion(event.target.value)}
            aria-invalid={Boolean(errors.region) || undefined}
            aria-describedby={errors.region ? "user-spot-region-error" : undefined}
          >
            <option value="">{t("regionPlaceholder")}</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.nameFull}
              </option>
            ))}
          </select>
          {errors.region ? <small id="user-spot-region-error">{errors.region}</small> : null}
        </label>

        <label className={styles.field} htmlFor="user-spot-community">
          <span>{t("community")}</span>
          <select
            id="user-spot-community"
            value={values.communityId}
            onChange={(event) => updateCommunity(event.target.value)}
            disabled={!values.regionId}
            aria-invalid={Boolean(errors.community) || undefined}
            aria-describedby={errors.community ? "user-spot-community-error" : undefined}
          >
            <option value="">{values.regionId ? t("communityPlaceholder") : t("chooseRegionFirst")}</option>
            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.nameFull}
              </option>
            ))}
          </select>
          {errors.community ? <small id="user-spot-community-error">{errors.community}</small> : null}
        </label>

        <label className={styles.field} htmlFor="user-spot-settlement">
          <span>{t("settlement")}</span>
          <select
            id="user-spot-settlement"
            value={values.settlementId}
            onChange={(event) => updateSettlement(event.target.value)}
            disabled={!values.communityId}
            aria-invalid={Boolean(errors.settlement) || undefined}
            aria-describedby={errors.settlement ? "user-spot-settlement-error" : undefined}
          >
            <option value="">{values.communityId ? t("settlementPlaceholder") : t("chooseCommunityFirst")}</option>
            {settlements.map((settlement) => (
              <option key={settlement.id} value={settlement.id}>
                {settlement.nameFull}
              </option>
            ))}
          </select>
          {errors.settlement ? <small id="user-spot-settlement-error">{errors.settlement}</small> : null}
        </label>

        <label className={styles.field} htmlFor="user-spot-water-type">
          <span>{t("waterType")}</span>
          <input
            id="user-spot-water-type"
            placeholder={t("waterTypePlaceholder")}
            value={values.waterType}
            onChange={(event) => updateValue("waterType", event.target.value)}
            aria-invalid={Boolean(errors.waterType) || undefined}
            aria-describedby={errors.waterType ? "user-spot-water-type-error" : undefined}
          />
          {errors.waterType ? <small id="user-spot-water-type-error">{errors.waterType}</small> : null}
        </label>

        <label className={styles.field} htmlFor="user-spot-access">
          <span>{t("access")}</span>
          <select
            id="user-spot-access"
            value={values.access}
            onChange={(event) => updateValue("access", event.target.value)}
          >
            {accessOptions.map((access) => (
              <option key={access.value} value={access.value}>{t(access.labelKey)}</option>
            ))}
          </select>
        </label>

        <label className={styles.field} htmlFor="user-spot-fish">
          <span>{t("fish")}</span>
          <input
            id="user-spot-fish"
            placeholder={t("fishPlaceholder")}
            value={values.fish}
            onChange={(event) => updateValue("fish", event.target.value)}
            aria-invalid={Boolean(errors.fish) || undefined}
            aria-describedby={errors.fish ? "user-spot-fish-error" : undefined}
          />
          {errors.fish ? <small id="user-spot-fish-error">{errors.fish}</small> : null}
        </label>

        <label className={styles.field} htmlFor="user-spot-tone">
          <span>{t("tone")}</span>
          <select
            id="user-spot-tone"
            value={values.tone}
            onChange={(event) => updateValue("tone", event.target.value)}
          >
            {tones.map((tone) => (
              <option key={tone.value} value={tone.value}>
                {t(tone.labelKey)}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field} htmlFor="user-spot-visibility">
          <span>{t("visibility")}</span>
          <select
            id="user-spot-visibility"
            value={values.visibility}
            onChange={(event) => updateValue("visibility", event.target.value)}
          >
            <option value="private">{t("private")}</option>
            <option value="published">{t("published")}</option>
          </select>
        </label>
      </div>

      <label className={styles.field} htmlFor="user-spot-description">
        <span>{t("description")}</span>
        <textarea
          id="user-spot-description"
          rows={5}
          value={values.description}
          onChange={(event) => updateValue("description", event.target.value)}
          aria-invalid={Boolean(errors.description) || undefined}
          aria-describedby={errors.description ? "user-spot-description-error" : undefined}
        />
        {errors.description ? <small id="user-spot-description-error">{errors.description}</small> : null}
      </label>

      <fieldset className={styles.translationFields}>
        <legend>{t("translationLegend")} <span>({t("translationLegendLead")})</span></legend>
        <div className={styles.grid}>
          <label className={styles.field} htmlFor="user-spot-name-en">
            <span>{t("englishName")}</span>
            <input id="user-spot-name-en" value={values.nameEn} onChange={(event) => updateValue("nameEn", event.target.value)} />
          </label>
          <label className={styles.field} htmlFor="user-spot-water-type-en">
            <span>{t("englishWaterType")}</span>
            <input id="user-spot-water-type-en" value={values.waterTypeEn} onChange={(event) => updateValue("waterTypeEn", event.target.value)} />
          </label>
          <label className={styles.field} htmlFor="user-spot-access-en">
            <span>{t("englishAccess")}</span>
            <input id="user-spot-access-en" value={values.accessEn} onChange={(event) => updateValue("accessEn", event.target.value)} />
          </label>
          <label className={styles.field} htmlFor="user-spot-fish-en">
            <span>{t("englishFish")}</span>
            <input id="user-spot-fish-en" placeholder={t("englishFishPlaceholder")} value={values.fishEn} onChange={(event) => updateValue("fishEn", event.target.value)} />
          </label>
        </div>
        <label className={styles.field} htmlFor="user-spot-description-en">
          <span>{t("englishDescription")}</span>
          <textarea id="user-spot-description-en" rows={5} value={values.descriptionEn} onChange={(event) => updateValue("descriptionEn", event.target.value)} />
        </label>
      </fieldset>

      {submissionError ? <p className={styles.error} role="alert">{submissionError}</p> : null}

      <div className={styles.actions}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : isEditing ? t("saveChanges") : t("add")}
        </button>
        <Link href="/my-spots">{t("cancel")}</Link>
      </div>
    </form>
  );
}
