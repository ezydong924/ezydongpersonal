import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "影岑 Shadow",
  description: "光是时间的拓印，暗处藏着未曾言说的记忆",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" style={{ colorScheme: "dark" }}>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen" style={{ fontFamily: "'Inter','PingFang SC','Microsoft YaHei',sans-serif" }}>
        <main className="relative z-10 page-enter">{children}</main>
      </body>
    </html>
  );
}
