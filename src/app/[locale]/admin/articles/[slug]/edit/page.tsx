import type { Metadata } from "next";
import { AdminArticleEditorPage } from "@/views/admin-article-editor";
import { noIndexMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default async function Page(props: PageProps<"/[locale]/admin/articles/[slug]/edit">) {
  const { slug } = await props.params;
  return <AdminArticleEditorPage slug={slug} />;
}
