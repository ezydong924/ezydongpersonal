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
      <GradientBackground colors={["hsl(160, 50%, 30%)", "hsl(40, 40%, 45%)", "hsl(140, 40%, 35%)"]} />
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
            苏州
          </motion.h1>
          <motion.div
            className="space-y-6 text-white/55 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p>小桥流水，粉墙黛瓦，烟雨江南。字字都对，也字字都被人写得陈词滥调了。苏州太容易被写成一张干净的旧画，水要清，墙要白，风要轻，连人都最好站得远一点。可我见到的苏州有古塔，有水巷，有园林的墨绿与绯红，也有烟雨。</p>
            <p>塔在远处，屋檐一层一层往天上收，树影压着人声靠在黄墙上，香火化为缕缕烟云。手里那包江南韵却横在画面中，白底黑字，俗得坦荡。按理说，这样的地方该空一点、静一点，最好连风都带着古意。可偏偏是这，让苏州从画里醒了过来。塔与烟，一个在檐角上收住年月，一个在手心里沾着俗世。它们并在一起，并不相冲，反而像苏州自己——一半藏在水墨里，一半坐在饭桌边。</p>
            <p>饭桌边的苏州，来得更实在。蟹黄笼包一破，滚烫的汤汁载着蟹黄流入口中；生煎底脆，油香贴着舌尖；红烧汁肉水收得发亮，端上来时连空气都厚了几分。桂花米露倒是轻的，甜里带一点酒意，像把春天摇散在瓶中。苏州的甜不是矫情，它藏在味蕾里等你发掘。</p>
            <p>在周庄坐船时，水声就贴得很近。船板晒得发热，绳子起了毛边，救生圈上落着灰。船上的船夫草帽压得低，长篙往水里一点，身子轻轻向前，船便从窄窄的河道里让出一条路来。白墙、木窗、石阶、藤蔓、桥洞，都挨着人慢慢过去，像一卷旧画被谁从身边展开，船夫的歌声一出，水路便豁然开来，桥上的游客也为了这份安静驻足片刻。</p>
            <p>苏州的水并不清，绿得有些旧，但却有了些温情。人们的生活似乎与水交融，他们将世俗带给了河水，河水也倒映出了他们的生活。白墙倒进去，灯笼倒进去，树影和人声也倒进去。船一过，如镜的水面碎成了星光点点；过一会儿，又自己合上。苏州很多东西都是这样，正着看是景，映入水里，才有了温度。</p>
            <p>园林里，绿是隐匿着生长的。它只藏在窗后、墙边、杯影。窗框住一截枝，茶盏映着半片天，光从叶缝里落下来映入河面，连木桌上的沉默都有了潮气。苏州的雅不张扬，它只让一枝花挡住半座塔，让一片叶子慢慢晃进你的眼里。</p>
            <p>夜一来，水面开始替这座城上妆。灯笼亮起来，桥洞亮起来，游船从金色的河里慢慢过去。对岸酒吧的粉紫色灯光落进水里，带着一点不合时宜的轻佻。你明知道这些灯有生意气，可水一晃，俗气也被晃软了。红的、金的、绿的，全拖成长长的影子，像旧梦里忽然多出来的一段霓虹。</p>
            <p>所以我不想只说苏州温柔。温柔太薄，盛不下它的水汽、焚香、烟火与甜味。苏州更像一口刚出笼的小笼汤，入口时急，烫，乱，差点让人皱眉；咽下去以后，鲜和甜才慢慢回上来。离开后，我记不清具体走过哪条街、看过哪座桥。只记得船夫一低身的长篙，窗边的绿意，夜里被灯晃碎的水。我看着照片回味，心里想起那抹甜。那一点甜，才像苏州。</p>
          </motion.div>
          <motion.div
            className="mt-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <AudioPlayer playlist={[{ src: `${MEDIA_BASE}/suzhou/5_6172414796638461853.flac`, cover: `${MEDIA_BASE}/suzhou/PlayerAlbumCover_-13820554581781357243438.jpg`, title: "" }]} muted={muted} onMutedChange={setMuted} />
          </motion.div>
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/gallery/photos/suzhou/gallery"
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
