"use client";

import { useTranslations } from "next-intl";
import { useAnglerFollow } from "@/entities/angler-follow";
import { Link } from "@/shared/lib/i18n";
import styles from "./angler-follow-control.module.scss";

type AnglerFollowControlProps = {
  anglerId: string;
};

export function AnglerFollowControl({ anglerId }: AnglerFollowControlProps) {
  const t = useTranslations("anglerProfile");
  const {
    followerCount,
    hasError,
    isAuthLoading,
    isFollowing,
    isFollowingLoading,
    isLoading,
    isPending,
    isSelf,
    toggleFollow,
    user,
  } = useAnglerFollow(anglerId);

  return (
    <div className={styles.control}>
      {!isSelf ? (
        isAuthLoading || isLoading || isFollowingLoading ? (
          <button className={styles.button} disabled type="button">{t("followLoading")}</button>
        ) : user ? (
          <button
            aria-pressed={isFollowing}
            className={isFollowing ? styles.followingButton : styles.button}
            disabled={isPending}
            onClick={() => void toggleFollow()}
            type="button"
          >
            {isPending ? t("followSaving") : isFollowing ? t("unfollow") : t("follow")}
          </button>
        ) : (
          <Link className={styles.button} href="/login">{t("signInToFollow")}</Link>
        )
      ) : null}
      <p className={styles.followers} aria-live="polite">
        {t("followersCount", { count: isLoading ? "—" : followerCount })}
      </p>
      {hasError ? <p className={styles.error} role="alert">{t("followError")}</p> : null}
    </div>
  );
}
