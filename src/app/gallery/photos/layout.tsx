import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "摄影地图",
  description: "14 座城市的摄影地图——点开一座城市，翻开它的影笺。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
