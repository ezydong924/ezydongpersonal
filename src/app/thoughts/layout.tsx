import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "想法",
  description: "一些还没想好怎么说的想法。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
