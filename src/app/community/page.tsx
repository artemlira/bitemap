import type { Metadata } from "next";
import { CommunityPage } from "@/views/community";

export const metadata: Metadata = { title: "Спільнота — BiteMap", description: "Опубліковані водойми спільноти BiteMap." };

export default function Page() { return <CommunityPage />; }
