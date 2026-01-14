import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getPublicSiteConfig } from "./lib/getPublicSiteConfig";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jiuliyue.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "九黎月 | Official Website",
  description: "九黎月官方網站 - 探索東方幻念音樂世界",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "九黎月 | Official Website",
    description: "探索東方幻念音樂世界",
    url: SITE_URL,
    siteName: "九黎月",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "九黎月 | Official Website",
    description: "探索東方幻念音樂世界",
    images: ["/og.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cfg = await getPublicSiteConfig();
  const sameAs =
    cfg?.links
      ?.filter((l) => l.enabled)
      ?.map((l) => l.url)
      ?.filter((u) => /^https?:\/\//i.test(u)) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: cfg?.site?.title ?? "九黎月 | Official Website",
        url: SITE_URL,
      },
      {
        "@type": "Person",
        name: "九黎月",
        alternateName: "Jiuliyue",
        url: SITE_URL,
        description: cfg?.site?.description ?? "九黎月官方網站 - 探索東方幻念音樂世界",
        image: cfg?.theme?.footerLogoImage ? `${SITE_URL}${cfg.theme.footerLogoImage}` : undefined,
        sameAs: sameAs.length ? sameAs : undefined,
      },
    ],
  };

  return (
    <html lang="zh-TW">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
