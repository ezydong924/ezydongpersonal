import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "北京",
  description: "一个城市活了几百上千年后，就不太需要向谁证明什么了。",
  openGraph: {
    title: "北京",
    description: "一个城市活了几百上千年后，就不太需要向谁证明什么了。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
