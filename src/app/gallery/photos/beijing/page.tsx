"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { GradientBackground } from "@/components/ui/gradient-background";
import BackButton from "@/components/back-button";
import AudioPlayer from "@/components/ui/audio-player";

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
            <p>
              一个城市活了百千年后，就不再需要向任何人证明什么了。故宫的红墙裂着细密的纹，不是坏了，是木头还在呼吸。太和殿前的台阶被磨得光滑如镜——多少双脚、多少人，每一脚都轻轻的，叠在一起就把石头走成了镜面。穿汉服的女孩在金水桥上拍照，锦缎被风掀起来的一刹那，像这百年的寂静眨了一下眼睛。
            </p>
            <p>
              红墙和金瓦的注视下，一草一木不卑不亢地活着。墙能挡住人、挡住风和乌鸦、挡住朝代更替——挡不住一颗种子。那一刻你意识到北京不是靠宫殿撑着的，是靠这些不会被写进历史的东西。
            </p>
            <p>
              天坛的国槐让我看见了一草一木的生机。几十棵百年老树搭成天然的遮阳廊道，树干粗壮，枝不往高处长，横着伸出去，像把时间的方向掰歪了。树下的人总在变换，但天坛一直在那里。国槐和一般的树不一样——它不急。一根枝朝一个方向伸出去可能要十年，十年在它眼里不算什么。它见过明朝的落日、清朝的雪、民国换旗那天的风。什么都没说过，但什么都记得。北京最老的居民不是宫殿，是这些站着不动的东西。它们不会说话，但时间会替它们开口。
            </p>
            <p>
              豆汁真的很难喝。。
            </p>
            <p>
              鼓楼。赵雷唱的那一首听了太多遍，但最后只在出租车上远远看了一眼。有些地方欠一次，不那么圆满才有理由续缘。北京懂得这一点——它等了百千年，又不妨多等一会儿。
            </p>
          </motion.div>

          <motion.div
            className="mt-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <AudioPlayer
              playlist={[
                { src: "/music/beijing/赵雷 - 鼓楼.mp3", cover: "/music/beijing/PlayerAlbumCover_-10307425451780037044033.jpg", title: "赵雷 - 鼓楼" },
                { src: "/music/beijing/赵雷 - 南方姑娘 (电影《米花之味》广告宣传曲).mp3", cover: "/music/beijing/PlayerAlbumCover_-9833554241780037081968.jpg", title: "赵雷 - 南方姑娘" },
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
