import type { Metadata } from "next";
import ShaderBackground from "@/components/shader-background";
import Narrative from "@/components/flow-art";
import BackButton from "@/components/back-button";

export const metadata: Metadata = {
  title: "探索",
  description: "摄影、随笔与关于——从这里开始探索影岑 Shadow 的三个入口。",
};

export default function ExplorePage() {
  return (
    <>
      <ShaderBackground />
      <div className="fixed inset-0 bg-black/[0.07] pointer-events-none z-0" />
      <div className="relative z-10">
        <div className="absolute top-8 left-8 z-50">
          <BackButton href="/" label="首页" />
        </div>
        <Narrative />
      </div>
    </>
  );
}
