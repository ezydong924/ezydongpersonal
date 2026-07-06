import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "威海",
  description: "威海在记忆里，是一次靠岸。从大连启程，搭乘渤海恒生。夜里的船像一只铁皮匣子，载着人、行李、睡意和没说完的话，一头扎进黑夜，往海那边去。推开舱门上甲板，海和天已经黑成一块，边界全…",
  openGraph: {
    title: "威海",
    description: "威海在记忆里，是一次靠岸。从大连启程，搭乘渤海恒生。夜里的船像一只铁皮匣子，载着人、行李、睡意和没说完的话，一头扎进黑夜，往海那边去。推开舱门上甲板，海和天已经黑成一块，边界全…",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
