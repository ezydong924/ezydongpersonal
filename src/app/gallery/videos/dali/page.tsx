"use client";

import { useEffect } from "react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import BackButton from "@/components/back-button";

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
        <div className="max-w-2xl mx-auto text-white/50 text-base leading-relaxed text-center space-y-6">
          <p>
            苍山不言语，洱海不回头。大理的风知道所有过客的名字，却从来不说。
          </p>
          <p>
            下关的风把云撕成絮，上关的花在古城墙角开了又谢。冬天苍山顶上积着雪，夏天洱海月亮碎成一千片银子。四方街的流浪歌手弹着同一首歌，白族阿嬷在巷口卖烤乳扇，香气飘过三百年。
          </p>
          <p>
            这里的日子很慢，慢到你可以听完一整场日落。树海的呼吸、眼泪的咸度、风沙划过的痕迹——它们不会消失，只是换了一种方式留在你的皮肤上。
          </p>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
