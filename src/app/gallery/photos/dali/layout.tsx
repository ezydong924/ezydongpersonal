import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "大理",
  description: "风花雪月 · 苍山洱海",
  openGraph: {
    title: "大理",
    description: "风花雪月 · 苍山洱海",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
