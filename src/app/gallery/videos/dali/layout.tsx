import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "大理 · 溯影",
  description: "大理旅行视频。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
