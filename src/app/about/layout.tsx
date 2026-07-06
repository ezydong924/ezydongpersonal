import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 EZYDong 与影岑 Shadow——一个关于光、时间与记忆的摄影随笔项目。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
