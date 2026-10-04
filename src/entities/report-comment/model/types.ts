import type { Timestamp } from "firebase/firestore";

export type ReportComment = {
  authorId: string;
  authorName: string;
  body: string;
  createdAt?: Timestamp;
  id: string;
};
