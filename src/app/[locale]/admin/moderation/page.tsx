import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AdminModerationPage } from "@/views/admin-moderation";
import { noIndexMetadata } from "@/shared/lib/seo";

export async function generateMetadata(props: PageProps<"/[locale]/admin/moderation">): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "contentReports" });
  return { title: `${t("adminTitle")} — BiteMap`, ...noIndexMetadata };
}

export default function Page() {
  return <AdminModerationPage />;
}
