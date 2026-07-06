import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const siteUrl = SITE_URL;
const title = "影岑 Shadow";
const description = "光是时间的拓印，暗处藏着未曾言说的记忆";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · 影岑 Shadow",
  },
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    images: ["/dalian-bg.jpg"],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/dalian-bg.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" style={{ colorScheme: "dark" }}>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="min-h-screen" style={{ fontFamily: "'Inter','PingFang SC','Microsoft YaHei',sans-serif" }}>
        <main className="relative z-10 page-enter">{children}</main>
      </body>
    </html>
  );
}
