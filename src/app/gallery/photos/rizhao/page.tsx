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
      <GradientBackground colors={["hsl(25, 90%, 55%)", "hsl(15, 60%, 40%)", "hsl(40, 80%, 50%)"]} />
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
            日照
          </motion.h1>
          <motion.div
            className="space-y-6 text-white/55 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p>日照这个名字，听起来太亮了。亮到还没去之前，就很容易把它想象成一座被阳光铺满的海边城市。可真正接近它的时候，最先看到的不是沙滩，也不是浪，是飞机舷窗外一段弯下去的海岸线。蓝色贴着陆地，公路沿着山和海绕出去，城市被放在一片很大的光里，显得很轻。很多城市是落地以后才开始的，日照好像不是。它从舷窗外那一片海开始，从车窗上一层没擦干净的灰和傍晚的夕阳开始。太阳落得很低，隔着玻璃，把路边的树、车尾灯和一小截公路都染成粉橘色。那一刻日照不像一个目的地，更像一段正在路上的时间。</p>
            <p>它的海也不是特别会讨好人的那种海。没有过分热烈的椰子树，也没有南方海边那种湿漉漉的甜味。日照的海更空，风也更直接——不是吹着玩的，是裹着湿气往骨头里钻的冷。海面铺得很开，船在上面显得很小，像一句话说到一半就停住了。浪一层一层推上沙滩，又退下去，不急着证明自己漂亮。干脆扫了一辆共享单车沿着海岸线骑，没有目的地，就是往前。左边是灰蓝色的海，右边是些矮矮的房子和防风林。脸冻得发僵，但光很干净——冷天的阳光没有夏天那种黏糊糊的热气，它是硬的，亮的，打到海面上碎成一片一片的银片。</p>
            <p>沙滩上有一个很大的 LOVE，几根木头弯成字母，立在海前面。它其实有点游客，也有点直白，可放在那片空荡荡的沙滩上，又并不让人讨厌。海风把所有矫情的东西都吹薄了，连"爱"这种太容易被写坏的字，也变得没那么不好意思。</p>
            <p>带了胶片机。数码拍了几百张也留不下什么的焦虑，在胶片这里不存在——一卷就三十六张，按一次少一次，反而让你更确定自己为什么要按。有一张是在海边按的，按下去的时候就知道这张对了。不是什么了不起的构图，就是一片海，一些光。但那个瞬间的光是对的。说不清哪里对，就是对的。</p>
            <p>我更喜欢那些没什么情节的画面。一片草地，一棵伸到画面里的松树，远处几栋安静的房子。或者是一片林子，树干一根一根竖着，地上全是绿色。日照不只有海，它还有一种被风吹干净的绿。那种绿不像南方植物那样挤着长，反而很疏朗，树和树之间留着空，光可以落下来，人也可以从里面慢慢走过去。摩天轮也是白的，挂在一大片蓝天里。它没有转出什么童话感，倒像一只巨大的表盘，慢慢把时间拨过去。轿厢一格一格停在天上，底下的人抬头看一眼，又继续往前走。日照很多地方都有这种感觉：东西在那里，但不逼你感动。你看见了，就看见了；错过了，也没什么。</p>
            <p>到了晚上，日照突然变红。演出里的水汽、灯光和人的影子混在一起，整片空间像被火烧过。戴斗笠的人站在红色里，动作被光拉成剪影，像从某个旧故事里走出来。烟花升起来的时候更像另一个日照。白天那些海、船、草地、蓝天都太安静了，到了夜里，它才把压着的声音一下子放出来。可烟花再亮，也只是一下。真正留在记忆里的，反而还是那些空下来的部分。</p>
            <p>离开的时候，跑道外面的天已经黑了。远处有一点城市的灯，飞机停在夜色里，像一只暂时收起翅膀的鸟。白天看过的海、沙滩、松树和草地都退到后面，只剩下停机坪上一块冷白的光。忽然觉得，日照这个名字好像不是说太阳有多盛。它说的是，有些地方会把你心里乱七八糟的东西照出来，然后又用海风慢慢吹走。你在那里待几天，不一定发生什么大事，也不一定非要留下多漂亮的照片。只是某个瞬间，蓝天太空，海面太宽，风从身边过去，人就突然安静了一点。</p>
            <p>日照大概就是这样。它没有用力留住谁。但光落下来的时候，你会记得自己曾经在那里。</p>
          </motion.div>
          <motion.div
            className="mt-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <AudioPlayer playlist={[]} muted={muted} onMutedChange={setMuted} />
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
