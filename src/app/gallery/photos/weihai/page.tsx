"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GradientBackground } from "@/components/ui/gradient-background";
import BackButton from "@/components/back-button";

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <GradientBackground colors={["hsl(15, 85%, 50%)", "hsl(200, 70%, 40%)", "hsl(30, 60%, 45%)"]} />
      <div className="fixed top-8 left-8 z-50"><BackButton href="/gallery/photos" label="返回" /></div>
      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 py-20">
        <div className="w-full max-w-2xl">
          <motion.h1 className="text-4xl font-light tracking-wide text-white/80 mb-12" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>威海</motion.h1>
          <motion.div className="space-y-6 text-white/55 text-lg leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p>威海在记忆里，不像一座城市，更像一次靠岸。</p>
            <p>去的时候是夜船。人一上甲板，海和天已经黑到分不出边界，四周没有灯，只有船身下面翻起来的白沫，一卷一卷，刚看见，又暗下去。风从海面上灌进外套，带着咸味，也带着一点铁皮和潮气。站久了，脸被吹得发木，话也没处说，只好回舱。可那片黑后来一直在。白天看见威海的海很蓝，蓝得很正，浪白得干净，沙子细，松树被风吹得偏向一边，远处的风车慢慢转。可我想起威海，最先出来的却常常不是蓝，是夜里船边那一点白沫。它亮得很短，一翻身就被海收走，像有些话刚到嘴边，又自己咽回去。</p>
            <p>快靠岸时，天刚亮。再上甲板，海面已经铺了一层薄光。不是日出照片里那种金灿灿的光，是很淡的一层，贴在水上，把夜色一点点擦薄。船还在往前，水痕从船尾拉开，白了一路，又慢慢散掉。朋友站在旁边，我们各自看着，谁也没说话。不是激动，也不是感动。就是没什么需要说。太阳慢慢升起来，海面跟着亮，威海在前面。那一小段时间空得很好，没有人急着拍照，没有音乐，也没有谁把气氛说破。后来想起来，反而觉得那就是威海最好的开场：一群人站在风里，看一座城市从海上慢慢出现。</p>
            <p>威海的沙很细。脚踩下去是软的，水一冲，脚底就空了一点。黄昏走进浅滩，海水没过脚踝，凉意从脚背往上漫。浪从远处推过来，在腿边碎成白沫，又退回去。退的时候，沙子从脚底慢慢抽走，人也跟着往下沉一点。那一下很小。可是身体记得。岸上的光已经低了，太阳把水面铺成碎金。朋友走在前面踩水，影子被拖得很长。没有谁真的在做什么，只是走，停一下，又走。风吹过来，衣角贴在身上，海水一遍一遍把脚踝洗亮。那时候威海好看得很直接，不需要解释。海就是海，光就是光，人站在里面，也暂时不用变成别的样子。</p>
            <p>晚上在海边吃饭。都点了什么，后来记得不全。只记得有一盘贝类，壳上有海水的咸味；桌子不大，灯也不算亮，几个人坐得很近，筷子碰到盘子，杯子挪来挪去。有人笑得很用力，又很快收住。风从旁边过去，桌上的纸巾被吹起一角，又被人随手按下。那晚有一点火光。很小，被几个人围着，亮了一会儿，又暗下去。没有谁把话说得多郑重，好像说重了就不像那天了。外面海已经黑了，只剩浪声，一下一下，比白天更沉。后来我们走到沙滩上，什么也看不见，只能听见海。几个人靠着坐，笑声离得很近，近到风吹不过去。</p>
            <p>我喜欢威海这一点。它很大，海很大，天也很大，可它没有把人吹散。相反，有些很小的东西，在那片大里反而留住了。甲板上的薄光，浅滩里陷下去的脚，贝壳上的咸，夜里那点火，几个人坐在一起没有散开的影子。这些东西本来不挨着——夜船和黄昏不挨着，日出和大排档不挨着，沙滩上的浪声和桌边的笑声也不挨着。可在记忆里，它们偏偏靠得很近。像船靠岸前那条水痕，明明很快就散了，可你知道它经过那里。</p>
            <p>海很大，风很大。可那几天，我没有被吹走。</p>
          </motion.div>
          <motion.div className="mt-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Link href="/gallery/photos/weihai/gallery" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white font-medium hover:bg-white/25 transition-all duration-300">
              翻开影笺
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
