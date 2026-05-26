"use client";

import { useEffect } from "react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import BackButton from "@/components/back-button";

export default function DalianPage() {
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
        mediaSrc="/dalian-video.mp4"
        posterSrc="/dalian.jpg"
        bgImageSrc="/dalian-bg.jpg"
        title="大连"
        date="滨城"
        scrollToExpand="Scroll to explore"
      >
        <div className="max-w-2xl mx-auto text-white/50 text-base leading-relaxed text-center space-y-6">
          <p>
            海雾散去时，光从不迟到。这座城市把历史砌进斑驳的街墙，把浪漫藏进每一班老电车驶过梧桐的午后。潮汐往复，而滨城始终在那里，沉默地蔚蓝。
          </p>
          <p>
            星海广场的风永远知道答案。滨海路的弯道把山与海折叠进同一帧画面，旅顺口的灯塔守着百年来往的船只。俄国人留下的穹顶、日本人栽下的樱花、还有一代代大连人自己垒起的码头与广场——所有的过往都沉在这座城市的底色里，不争不抢，却从未褪去。
          </p>
          <p>
            镜头里的滨城，是金石滩礁石上碎开的浪，是中山广场鸽群掠过的弧线，是傍晚渔人码头归来的船笛。它不需要滤镜——光本身就是最好的叙述者。
          </p>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
