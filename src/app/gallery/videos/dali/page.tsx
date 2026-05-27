"use client";

import { useEffect } from "react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import BackButton from "@/components/back-button";
import { AnimatedContainer } from "@/components/ui/animated-container";

export default function DaliPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery/videos" label="返回" />
      </div>

      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/dali-video.mp4"
        posterSrc="/dali-cover.jpg"
        bgImageSrc="/dali-bg.jpg"
        title="大理"
        date="风花雪月"
        scrollToExpand="Scroll to explore"
      >
        <div className="max-w-2xl mx-auto space-y-8 px-4">
          <div className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] p-8 md:p-12 space-y-8" style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 40px rgba(0,0,0,0.3)" }}>
            <AnimatedContainer delay={0}>
              <p className="text-white/55 text-base leading-relaxed">
                苍山不言语，洱海不回头。大理的风知道所有过客的名字，却从来不说。
              </p>
            </AnimatedContainer>

            <AnimatedContainer delay={0.15}>
              <p className="text-white/45 text-base leading-relaxed">
                下关的风把云撕成絮，上关的花在古城墙角开了又谢。冬天苍山顶上积着雪，夏天洱海月亮碎成一千片银子。四方街的流浪歌手弹着同一首歌，白族阿嬷在巷口卖烤乳扇，香气飘过三百年。
              </p>
            </AnimatedContainer>

            <AnimatedContainer delay={0.3}>
              <p className="text-white/40 text-base leading-relaxed">
                这里的日子很慢，慢到你可以听完一整场日落。树海的呼吸、眼泪的咸度、风沙划过的痕迹——它们不会消失，只是换了一种方式留在你的皮肤上。
              </p>
            </AnimatedContainer>
          </div>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
