import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "成都",
  description: "都江堰的水从鱼嘴分开。安澜索桥上挤满了人，导游的喇叭声在空气里撞来撞去——但水没有声音。它被分开了两千年，早就习惯了。站在离堆公园往下看，水流得不急不慢，甚至不像在流，像在渗，…",
  openGraph: {
    title: "成都",
    description: "都江堰的水从鱼嘴分开。安澜索桥上挤满了人，导游的喇叭声在空气里撞来撞去——但水没有声音。它被分开了两千年，早就习惯了。站在离堆公园往下看，水流得不急不慢，甚至不像在流，像在渗，…",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
