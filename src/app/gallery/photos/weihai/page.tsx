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
            <p>威海的海，蓝得正。不是那种需要滤镜慢慢调的蓝。天晴时它明晃晃铺在那里，浪卷起来，白边一层一层往岸上推。人站在海边，说话会不自觉地少——不是忽然有了心事，是眼前太宽了，很多话一出口，就显得小。</p>
            <p>去威海是坐渡轮的。天还没亮透，船轻轻晃，人站在甲板的风里也跟着晃。远处先浮出一线白，像有人拿刀尖在深蓝色的纸面上划了一下，光就从那道口子里慢慢渗出来。云边泛金，水面起光，浪纹被一条条勾亮。那一刻安静得不像船上——不是没人，是所有人都不约而同地收着声音，好像重一点，天边那点刚升起的就会碎掉。太阳跳出海面之后，整片海忽然被点亮了。亮得你没法再想别的事。</p>
            <p>和大连不一样。大连的海是城市的背景——有码头、汽笛、广场，海在那边是垫在水泥下面的。和日照也不一样——日照的海是空和光，威海的更近。环海路兜转着，每个转弯都能遇见蓝。突然就亮了，突然就阔了，突然就安静了。路边走着，一转头就是海，没有广场隔开，没有停车场挡在前面。傍晚太阳压低了，光铺在水上，像一条很长很长的路。不是烧成一片的金色，是更安静的颜色——粉的、灰蓝的、浅金的，掺在一起，像谁打翻了一盒水彩。人站在浪里，只剩黑色的影子，脚边全是碎开的亮光。你知道那条路走不上去的，可还是会看很久。</p>
            <p>威海的风也有形状。在松树偏过去的那一侧枝条里，在风车不紧不慢的转动里——那些白色叶片立在海岸线上，一根一根地在后退，像有人把看不见的风钉在了海天之间。天蓝得干净。不是温柔，是清醒。</p>
            <p>夜里海退到看不见的地方，只剩风还在。街灯亮着，几个人坐得很近，笑声也近。没有什么话说得郑重，可那一小会儿，时间像被谁轻轻按住了。外面的风还在吹，车灯一辆一辆过去，海在远处黑着，可那一晚并不冷。</p>
            <p>后来想起威海，我始终拼不出一条完整的路线。不是"去了哪里，看了什么"。是一片很蓝的海，忽然接上一张饭桌；是一场日出，接上一阵笑声；是甲板上的风，接上夜里杯沿的一点光。那些画面不挨着，可在记忆里偏偏靠得很近。海很大，风很大，人本来很容易被吹散的。可有些东西没有。它们留在日出前的甲板上，留在傍晚发金的水面上，留在某个夜里靠得很近的灯光里。再想起来，先是海亮了一下，然后风吹过来，最后才发现——原来那几个人还在。</p>
            <p>威海当然很美。美在海，也在光。但它最好的地方不是像一张照片——照片只是把那一刻截住了。真正留下来的，是海风吹过以后，心里还有一小块地方没有凉下去。那一小块地方，很像威海。</p>
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
