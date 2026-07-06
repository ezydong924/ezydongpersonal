import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "大连",
  description: "滨城 · 山海之间",
  openGraph: {
    title: "大连",
    description: "滨城 · 山海之间",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
