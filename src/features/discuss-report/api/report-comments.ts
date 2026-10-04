"use client";

import { addDoc, collection, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { getFirebaseFirestore } from "@/shared/api/firebase";

export async function createReportComment(reportId: string, authorId: string, authorName: string, body: string) {
  const normalizedBody = body.trim();

  if (!normalizedBody || normalizedBody.length > 1200) {
    throw new Error("Invalid comment length.");
  }

  await addDoc(collection(getFirebaseFirestore(), "fishing-reports", reportId, "comments"), {
    authorId,
    authorName,
    body: normalizedBody,
    createdAt: serverTimestamp(),
  });
}

export async function deleteReportComment(reportId: string, commentId: string) {
  await deleteDoc(doc(getFirebaseFirestore(), "fishing-reports", reportId, "comments", commentId));
}
