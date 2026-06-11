"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { GradientBackground } from "@/components/ui/gradient-background";
import BackButton from "@/components/back-button";
import AudioPlayer from "@/components/ui/audio-player";
import { MEDIA_BASE } from "@/lib/media";

export default function Page() {
  const [muted, setMuted] = useState(false);

  return (
    <div className="relative min-h-screen">
      <GradientBackground colors={["hsl(5, 75%, 30%)", "hsl(40, 70%, 35%)", "hsl(0, 60%, 25%)"]} />
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery/photos" label="返回" />
      </div>

      <button
        onClick={() => setMuted(!muted)}
        className="fixed top-8 right-8 z-50 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300"
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 py-20">
        <div className="w-full max-w-2xl">
          <motion.h1
            className="text-4xl font-light tracking-wide text-white/80 mb-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            北京
          </motion.h1>

          <motion.div
            className="space-y-6 text-white/55 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p>一个城市活了几百上千年后，就不太需要向谁证明什么了。</p>
            <p>走进故宫的时候，最先打动我的反而不是那些宏大的房宇。红墙上有细密的裂纹，朱红色被岁月磨得没那么鲜亮，却更有了生命的力度。太和殿前的台阶被人走得发亮，石头表面光滑得像一面暗下来的镜子。多少双脚从这里经过，皇帝、官员、游客，每一脚都轻轻的，叠在一起就把石头走成了镜面。</p>
            <p>金水桥上女孩的裙摆被风掀起来，故宫好像也没那么严肃了。它不是只活在课本和纪录片里的地方，也会有游客的笑声、手机快门声、被风吹乱的头发，还有太阳落在红墙上的影子。</p>
            <p>我很喜欢故宫里那些不起眼的草木。红墙和金瓦的注视下，一草一木不卑不亢地活着。墙可以隔开很多东西，隔开宫内宫外，隔开过去和现在，但它挡不住一颗种子。它总会从某个缝里冒出来，不声不响地活着。那一刻你意识到北京不是靠宫殿撑着的，是靠这些不会被写进历史的东西。</p>
            <p>天坛的国槐让我看见了一草一木的生机。几十棵百年老树搭成天然的遮阳廊道，树干粗壮，枝不往高处长，横着伸出去，像把时间的方向掰歪了。树下的人总在变换，但天坛一直在那里。国槐和一般的树不一样——它不急。一根枝朝一个方向伸出去可能要十年，十年在它眼里不算什么。它见过明朝的落日、清朝的雪、民国换旗那天的风。什么都没说过，但什么都记得。北京最老的居民，可能不是住在胡同里的人，也不是某一座宫殿，而是这些站着不动的树。它们什么都不说，但你站在下面，就会觉得有些东西确实被它们记住了。</p>
            <p>当然，北京也不是每一口都如此厚重。豆汁真的很难喝。不过也正因为有豆汁，北京才没那么像一座只供人仰望的城市。它有故宫、天坛、红墙、老树，也有这种让人喝一口就皱眉头的东西。</p>
            <p>赵雷那首《鼓楼》听了太多遍，最后只是在出租车上远远看了一眼鼓楼。有些地方好像就是要欠一次。不那么圆满，才有理由再来。北京懂这一点。它等了几百上千年，也不差再多等一次。离开的时候，我没有觉得自己来过北京，这个城市太大。它有它的厚重，也有很普通的日子；有红墙金瓦，也有广厦摩天。你走，它还是北京。</p>
          </motion.div>

          <motion.div
            className="mt-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <AudioPlayer
              playlist={[
                { src: `${MEDIA_BASE}/beijing/赵雷 - 鼓楼.mp3`, cover: `${MEDIA_BASE}/beijing/PlayerAlbumCover_-10307425451780037044033.jpg`, title: "赵雷 - 鼓楼" },
                { src: `${MEDIA_BASE}/beijing/赵雷 - 南方姑娘 (电影《米花之味》广告宣传曲).mp3`, cover: `${MEDIA_BASE}/beijing/PlayerAlbumCover_-9833554241780037081968.jpg`, title: "赵雷 - 南方姑娘" },
              ]}
              muted={muted}
              onMutedChange={setMuted}
            />
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/gallery/photos/beijing/gallery"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white font-medium hover:bg-white/25 transition-all duration-300"
            >
              翻开影笺
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
