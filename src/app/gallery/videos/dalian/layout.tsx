import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "大连 · 溯影",
  description: "大连旅行视频。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
