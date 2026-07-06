import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "重庆",
  description: "山城 · 爬坡上坎",
  openGraph: {
    title: "重庆",
    description: "山城 · 爬坡上坎",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
