import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "画廊",
  description: "影笺与溯影——影岑 Shadow 的摄影与视频画廊入口。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
