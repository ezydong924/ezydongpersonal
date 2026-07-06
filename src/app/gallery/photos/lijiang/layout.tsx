import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "丽江",
  description: "古城 · 柔软时光",
  openGraph: {
    title: "丽江",
    description: "古城 · 柔软时光",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
