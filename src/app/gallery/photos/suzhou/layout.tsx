import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "苏州",
  description: "小桥流水，粉墙黛瓦，烟雨江南。字字都对，也字字都被人写得陈词滥调了。苏州太容易被写成一张干净的旧画，水要清，墙要白，风要轻，连人都最好站得远一点。可我见到的苏州有古塔，有水巷，…",
  openGraph: {
    title: "苏州",
    description: "小桥流水，粉墙黛瓦，烟雨江南。字字都对，也字字都被人写得陈词滥调了。苏州太容易被写成一张干净的旧画，水要清，墙要白，风要轻，连人都最好站得远一点。可我见到的苏州有古塔，有水巷，…",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
