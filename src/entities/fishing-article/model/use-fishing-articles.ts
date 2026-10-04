"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, type Timestamp } from "firebase/firestore";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import { useAdminStatus } from "@/entities/admin";
import { fishingArticles } from "./article-data";
import { calculateFishingArticleReadMinutes } from "./localization";
import type { FishingArticleStatus, ManagedFishingArticle } from "./types";

type ArticleRecord = Omit<ManagedFishingArticle, "slug" | "updatedAt"> & {
  updatedAt?: Timestamp | number;
};

function toManagedArticle(slug: string, data: ArticleRecord): ManagedFishingArticle {
  return {
    ...data,
    slug,
    readMinutes: calculateFishingArticleReadMinutes(data.translations),
    status: data.status === "draft" ? "draft" : "published",
    updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : data.updatedAt?.toMillis(),
  };
}

type ArticlesSnapshot = { articles: readonly ManagedFishingArticle[]; userId: string | null };

export function useFishingArticles() {
  const { error: adminError, isAdmin, isLoading: isAdminLoading, user } = useAdminStatus();
  const [snapshot, setSnapshot] = useState<ArticlesSnapshot>({ articles: [], userId: null });
  const [errorState, setErrorState] = useState<{ userId: string | null; hasError: boolean } | null>(null);
  const userId = user?.uid ?? null;
  const isLoading = isAdminLoading || snapshot.userId !== userId;

  useEffect(() => {
    if (isAdminLoading) return;

    const articlesCollection = collection(getFirebaseFirestore(), "articles");
    const articlesQuery = isAdmin
      ? articlesCollection
      : query(articlesCollection, where("status", "==", "published"));

    return onSnapshot(
      articlesQuery,
      (result) => {
        setSnapshot({
          userId,
          articles: result.docs.map((article) => toManagedArticle(article.id, article.data() as ArticleRecord)),
        });
        setErrorState({ userId, hasError: false });
      },
      () => {
        setSnapshot({ userId, articles: [] });
        setErrorState({ userId, hasError: true });
      },
    );
  }, [isAdmin, isAdminLoading, userId]);

  const persistedArticles = snapshot.userId === userId ? snapshot.articles : [];
  const persistedBySlug = new Map(persistedArticles.map((article) => [article.slug, article]));
  const builtIn = fishingArticles.map((article) => ({
    ...(persistedBySlug.get(article.slug) ?? {
      ...article,
      status: "published" as const,
      authorId: "bitemap",
    }),
    isBuiltIn: true,
    readMinutes: calculateFishingArticleReadMinutes((persistedBySlug.get(article.slug) ?? article).translations),
  }));
  const builtInSlugs = new Set(fishingArticles.map(({ slug }) => slug));
  const custom = persistedArticles.filter((article) => !builtInSlugs.has(article.slug));
  const editorialOrder = [
    "feeder-paternoster-rig",
    "flat-feeder-hair-rig",
    "shock-leader-to-mainline",
    "weather-and-fishing-plan",
    "accurate-feeder-groundbaiting",
    "choose-a-fishing-spot",
  ];
  const builtInOrder = new Map(editorialOrder.map((slug, index) => [slug, index]));
  const articles = [...builtIn, ...custom]
    .filter((article) => isAdmin || article.status === "published")
    .sort((first, second) => {
      if (first.isBuiltIn && second.isBuiltIn) return (builtInOrder.get(first.slug) ?? 0) - (builtInOrder.get(second.slug) ?? 0);
      if (first.isBuiltIn !== second.isBuiltIn) return first.isBuiltIn ? 1 : -1;
      return (second.updatedAt ?? 0) - (first.updatedAt ?? 0);
    });

  return { articles, error: (errorState?.userId === userId && errorState.hasError) || adminError, isAdmin, isLoading, user };
}

export function useFishingArticle(slug: string | null) {
  const { articles, error, isAdmin, isLoading, user } = useFishingArticles();
  return {
    article: slug ? articles.find((article) => article.slug === slug) ?? null : null,
    error,
    isAdmin,
    isLoading,
    user,
  };
}

export type { FishingArticleStatus };
