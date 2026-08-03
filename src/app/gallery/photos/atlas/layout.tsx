import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "记忆坐标 · 原型",
  description: "影岑摄影档案的记忆星图交互原型。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
