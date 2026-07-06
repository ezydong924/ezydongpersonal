import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "溯影",
  description: "影岑 Shadow 的旅行视频合集。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
