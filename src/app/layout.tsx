import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-serif",
});

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
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${inter.className} min-h-screen`}>
        <main className="relative z-10 page-enter">{children}</main>
      </body>
    </html>
  );
}
