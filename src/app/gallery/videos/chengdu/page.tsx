"use client";

import { useEffect } from "react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import BackButton from "@/components/back-button";

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
        mediaSrc="/shuxiu-compressed.mp4"
        posterSrc="/chengdu-cover.jpg"
        bgImageSrc="/chengdu-bg.jpg"
        title="成都"
        date="蜀绣"
        scrollToExpand="Scroll to explore"
      >
        <div className="max-w-2xl mx-auto text-white/50 text-base leading-relaxed text-center space-y-6">
          <p>
            宽巷子不宽，窄巷子不窄。成都的尺度不在街上，在人心里。
          </p>
          <p>
            人民公园的盖碗茶泡了四十年，鹤鸣茶社的竹椅还是那把竹椅。锦里的灯笼把三国照进今夜，太古里的玻璃幕墙倒映着大慈寺飞檐。这座城市从不急着选边站——火锅沸腾的时候，窗外的银杏正在慢慢变黄。
          </p>
          <p>
            蜀绣一针下去是芙蓉，再一针是锦江。方寸之间的从容，才是这座城市真正的宽度。快门在这里不必追赶，它只负责证明：慢，可以是一种力量。
          </p>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
