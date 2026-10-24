import type { Metadata } from "next";
import { AuthPage } from "@/views/auth";
import { noIndexMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
