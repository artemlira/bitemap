import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getLocale } from "next-intl/server";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "@/shared/lib/auth";
import { ThemeProvider } from "@/shared/lib/theme";
import { PublicProfileSynchronizer } from "@/entities/user";
import "@/app/styles/main.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BiteMap — риболовля ближче до природи",
  description: "Знаходьте водойми, ведіть щоденник уловів і плануйте риболовлю.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={geistSans.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <AuthProvider>
          <PublicProfileSynchronizer />
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
