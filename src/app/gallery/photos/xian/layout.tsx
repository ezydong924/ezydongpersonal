import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "西安",
  description: "长安 · 十三朝古都",
  openGraph: {
    title: "西安",
    description: "长安 · 十三朝古都",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
