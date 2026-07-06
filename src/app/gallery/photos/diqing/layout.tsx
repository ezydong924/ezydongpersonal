import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "迪庆州",
  description: "藏地 · 离天堂最近",
  openGraph: {
    title: "迪庆州",
    description: "藏地 · 离天堂最近",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
