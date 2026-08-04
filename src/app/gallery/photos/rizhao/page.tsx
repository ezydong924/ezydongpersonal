"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GradientBackground } from "@/components/ui/gradient-background";
import BackButton from "@/components/back-button";

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <GradientBackground colors={["hsl(25, 90%, 55%)", "hsl(15, 60%, 40%)", "hsl(40, 80%, 50%)"]} />
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery/photos" label="返回" />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 py-20">
        <div className="w-full max-w-2xl">
          <motion.h1
            className="text-4xl font-light tracking-wide text-white/80 mb-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            日照
          </motion.h1>
          <motion.div
            className="space-y-6 text-white/55 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p>日照这个名字，就很容易把它想象成一座被阳光铺满的海边城市。可真正接近它的时候，最先看到的不是沙滩与海浪，是飞机舷窗外一段弯下去的海岸线。蓝色贴着陆地，公路沿着山和海绕出去，城市被放在一片很大的光里。它从舷窗外那一片海开始，从车窗上一层没擦干净的灰和傍晚的夕阳开始。太阳落得很低，隔着玻璃，把路边的树、车尾灯和一小截公路都染成粉橘色。那一刻日照不像一个目的地，而是一种选择。</p>
            <p>日照的海面更空旷，风也着湿气推着海浪一层一层的迎向沙滩，又缓缓退下。扫了一辆共享单车沿着海岸线骑。右边是灰蓝色的海，左边是些矮矮的房子和防风林。阳光没有带来夏天粘腻的热气，它打到海面上碎成一片一片的银片。</p>
            <p>一卷三十六张的胶片，一片海，一些光，一片草地，一棵伸到画面里的松树，远处几栋安静的房子。日照不只有海，它还有一种被风吹干净的绿，树和树之间留着空，光可以落下来撒到地上，人也可以从里面慢慢走过去。摩天轮挂在一大片蓝天里，它没有转出什么童话感，倒像一只巨大的表盘，慢慢把时间拨过去。轿厢一格一格停在天上，底下的人抬头看一眼，又继续往前走。</p>
            <p>到了晚上的烟火秀，演出里的水汽、灯光和人的影子混在一起，整片空间像被火烧过。戴斗笠的人站在红色里，动作被光拉成剪影，像从某个旧故事里走出来。烟花升起来的时候更像另一个日照。白天那些海、船、草地、蓝天都太安静了，到了夜里，它才把压着的声音一下子放出来。可烟花再亮却也只是一下。真正留在记忆里的反而还是那些空下来的部分。</p>
            <p>离开的时候，跑道外面的天已经黑了。远处有一点城市的灯，飞机停在夜色里，像一只暂时收起翅膀的鸟。白天看过的海、沙滩、松树和草地都退到后面，只剩下停机坪上一块冷白的光。你在那里待几天，不一定发生什么大事，也不一定非要留下多漂亮的照片。只是某个瞬间，蓝天太空，海面太宽，风从身边过去，人就突然安静了一点。</p>
          </motion.div>
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/gallery/photos/rizhao/gallery"
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
