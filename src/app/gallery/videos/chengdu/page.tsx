"use client";

import { useEffect } from "react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { VIDEO_BASE } from "@/lib/media";
import BackButton from "@/components/back-button";
import { AnimatedContainer } from "@/components/ui/animated-container";

export default function ChengduPage() {
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
        mediaSrc={`${VIDEO_BASE}/shuxiu-compressed.mp4`}
        posterSrc="/chengdu-cover.jpg"
        bgImageSrc="/chengdu-bg.jpg"
        title="成都"
        date="蜀绣"
        scrollToExpand="Scroll to explore"
      >
        <div className="max-w-2xl mx-auto space-y-8 px-4">
          <div className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] p-8 md:p-12 space-y-8" style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 40px rgba(0,0,0,0.3)" }}>
            <AnimatedContainer delay={0}>
              <p className="text-white/55 text-base leading-relaxed">
                宽巷子不宽，窄巷子不窄。成都的尺度不在街上，在人心里。
              </p>
            </AnimatedContainer>

            <AnimatedContainer delay={0.15}>
              <p className="text-white/45 text-base leading-relaxed">
                人民公园的盖碗茶泡了四十年，鹤鸣茶社的竹椅还是那把竹椅。锦里的灯笼把三国照进今夜，太古里的玻璃幕墙倒映着大慈寺飞檐。这座城市从不急着选边站——火锅沸腾的时候，窗外的银杏正在慢慢变黄。
              </p>
            </AnimatedContainer>

            <AnimatedContainer delay={0.3}>
              <p className="text-white/40 text-base leading-relaxed">
                蜀绣一针下去是芙蓉，再一针是锦江。方寸之间的从容，才是这座城市真正的宽度。快门在这里不必追赶，它只负责证明：慢，可以是一种力量。
              </p>
            </AnimatedContainer>
          </div>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
