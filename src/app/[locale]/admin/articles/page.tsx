import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AdminArticlesPage } from "@/views/admin-articles";

export async function generateMetadata(props: PageProps<"/[locale]/admin/articles">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "articleAdmin" });
  return { title: `${t("title")} — BiteMap` };
}

export default function Page() {
  return <AdminArticlesPage />;
}
