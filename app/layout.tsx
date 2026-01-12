import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

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
  openGraph: {
    title: "九黎月 | Official Website",
    description: "探索東方幻念音樂世界",
    url: "https://jiuliyue.zeabur.app",
    siteName: "九黎月",
    images: [
      {
        url: "/og_source.jpg", // 這裡指向您放入 public 的圖片
        width: 1200,
        height: 630,
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
