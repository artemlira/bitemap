"use client";

import { deleteDoc, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { fishingArticles, type FishingArticle, type FishingArticleStatus } from "@/entities/fishing-article";
import { getFirebaseFirestore } from "@/shared/api/firebase";

export async function saveFishingArticle(
  article: FishingArticle,
  status: FishingArticleStatus,
  authorId: string,
  allowBuiltInOverride = false,
) {
  const reference = doc(getFirebaseFirestore(), "articles", article.slug);

  await runTransaction(getFirebaseFirestore(), async (transaction) => {
    const existing = await transaction.get(reference);
    const previousData = existing.data();

    if (!allowBuiltInOverride && fishingArticles.some((builtInArticle) => builtInArticle.slug === article.slug)) {
      throw new Error("Choose a unique URL for a new article.");
    }

    transaction.set(reference, {
      ...article,
      status,
      authorId: previousData?.authorId ?? authorId,
      updatedAt: serverTimestamp(),
      ...(status === "published"
        ? { publishedAt: previousData?.publishedAt ?? serverTimestamp() }
        : {}),
    }, { merge: true });
  });
}

export function removeFishingArticle(slug: string) {
  return deleteDoc(doc(getFirebaseFirestore(), "articles", slug));
}
