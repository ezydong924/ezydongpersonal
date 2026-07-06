import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "成都 · 溯影",
  description: "成都旅行视频。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
