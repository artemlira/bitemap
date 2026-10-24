import type { Metadata } from "next";
import { AdminArticleEditorPage } from "@/views/admin-article-editor";
import { noIndexMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default function Page() {
  return <AdminArticleEditorPage />;
}
