import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import { fishingArticles } from "@/entities/fishing-article";

export type ReportableContentType = "user-spot" | "spot-image" | "fishing-report" | "comment" | "article";
export type ContentReportReason = "spam" | "abuse" | "inaccurate" | "privacy" | "other";
export type ContentReport = {
  createdAt?: Timestamp;
  contextType: "" | "catalog" | "user-spot";
  contextId: string;
  details: string;
  id: string;
  parentId: string;
  reason: ContentReportReason;
  reporterId: string;
  status: "open" | "dismissed" | "actioned";
  targetId: string;
  targetType: ReportableContentType;
};

export function submitContentReport(input: {
  contextType?: "catalog" | "user-spot";
  contextId?: string;
  details: string;
  parentId?: string;
  reason: ContentReportReason;
  reporterId: string;
  targetId: string;
  targetType: ReportableContentType;
}) {
  const contextType = input.contextType ?? "";
  const contextId = input.contextId ?? "";
  const parentId = input.parentId ?? "";
  const id = [input.reporterId, input.targetType, contextType, contextId, parentId, input.targetId].join("__");

  return setDoc(doc(getFirebaseFirestore(), "content-reports", id), {
    ...input,
    contextType,
    contextId,
    parentId,
    details: input.details.trim(),
    status: "open",
    createdAt: serverTimestamp(),
  });
}

export function subscribeToOpenContentReports(
  onReports: (reports: readonly ContentReport[]) => void,
  onError: () => void,
) {
  const reportsQuery = query(collection(getFirebaseFirestore(), "content-reports"), where("status", "==", "open"));
  return onSnapshot(reportsQuery, (snapshot) => {
    onReports(snapshot.docs
      .map((entry) => ({ id: entry.id, ...entry.data() }) as ContentReport)
      .sort((first, second) => (second.createdAt?.toMillis() ?? 0) - (first.createdAt?.toMillis() ?? 0)));
  }, onError);
}

export async function moderateContentReport(report: ContentReport, action: "dismiss" | "hide", reviewerId: string, idToken: string) {
  const db = getFirebaseFirestore();

  if (action === "hide") {
    if (report.targetType === "user-spot") {
      await updateDoc(doc(db, "user-spots", report.targetId), { visibility: "private", moderationStatus: "hidden" });
    } else if (report.targetType === "fishing-report") {
      await updateDoc(doc(db, "fishing-reports", report.targetId), { isPublic: false, moderationStatus: "hidden" });
    } else if (report.targetType === "comment") {
      if (!report.parentId) throw new Error("Missing parent report for comment.");
      await deleteDoc(doc(db, "fishing-reports", report.parentId, "comments", report.targetId));
    } else if (report.targetType === "article") {
      const articleRef = doc(db, "articles", report.targetId);
      const articleSnapshot = await getDoc(articleRef);
      if (articleSnapshot.exists()) {
        await updateDoc(articleRef, { status: "draft" });
      } else {
        const builtInArticle = fishingArticles.find((article) => article.slug === report.targetId);
        if (!builtInArticle) throw new Error("Reported article could not be found.");
        await setDoc(articleRef, {
          ...builtInArticle,
          status: "draft",
          authorId: reviewerId,
        });
      }
    } else {
      const response = await fetch(`/api/media/${encodeURIComponent(report.targetId)}`, {
        headers: { Authorization: `Bearer ${idToken}` },
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Could not remove reported image.");
    }
  }

  await updateDoc(doc(db, "content-reports", report.id), {
    status: action === "hide" ? "actioned" : "dismissed",
    reviewedAt: serverTimestamp(),
    reviewedBy: reviewerId,
  });
}
