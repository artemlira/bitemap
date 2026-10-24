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
  metadataBase: new URL("https://bitemap.artemlira.com"),
  title: "Мапа водойм для риболовлі в Україні — BiteMap",
  description: "Знаходьте водойми, ведіть щоденник уловів і плануйте риболовлю.",
  openGraph: {
    type: "website",
    siteName: "BiteMap",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "BiteMap — мапа водойм для риболовлі" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: "/opengraph-image", alt: "BiteMap — мапа водойм для риболовлі" }],
  },
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
