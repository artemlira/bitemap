import { AdminArticleEditorPage } from "@/views/admin-article-editor";

export default async function Page(props: PageProps<"/[locale]/admin/articles/[slug]/edit">) {
  const { slug } = await props.params;
  return <AdminArticleEditorPage slug={slug} />;
}
