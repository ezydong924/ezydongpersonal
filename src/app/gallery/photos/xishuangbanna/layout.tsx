import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "西双版纳",
  description: "西双版纳，四个字念出来，空气好像就先潮了一点，绿了一点，变得亚热带起来。",
  openGraph: {
    title: "西双版纳",
    description: "西双版纳，四个字念出来，空气好像就先潮了一点，绿了一点，变得亚热带起来。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
