import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "昆明",
  description: "春城 · 花开四季",
  openGraph: {
    title: "昆明",
    description: "春城 · 花开四季",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
