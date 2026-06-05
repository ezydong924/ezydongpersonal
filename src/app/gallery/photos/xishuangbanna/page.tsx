"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { GradientBackground } from "@/components/ui/gradient-background";
import BackButton from "@/components/back-button";
import AudioPlayer from "@/components/ui/audio-player";
import { musicStore } from "@/lib/music-store";

export default function Page() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const unsub = musicStore.subscribe(() => setMuted(musicStore.isMuted));
    return unsub;
  }, []);

  const bc = "fixed top-8 right-8 z-50 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300";
  const lc = "inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white font-medium hover:bg-white/25 transition-all duration-300";

  const toggle = () => {
    const audio = musicStore.audioEl;
    if (!audio) return;
    if (audio.paused) { musicStore.resume(); }
    else { musicStore.toggleMute(); }
  };

  return (
    <div className="relative min-h-screen">
      <GradientBackground colors={["hsl(160, 50%, 25%)", "hsl(140, 45%, 20%)", "hsl(120, 35%, 15%)"]} />
      <div className="fixed top-8 left-8 z-50"><BackButton href="/gallery/photos" label="返回" /></div>
      <button onClick={toggle} className={bc}>{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 py-20">
        <div className="w-full max-w-2xl">
          <motion.h1 className="text-4xl font-light tracking-wide text-white/80 mb-12" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>西双版纳</motion.h1>
          <motion.div className="space-y-6 text-white/55 text-lg leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p>还没到版纳之前，先闻到的是空气。不是冷气，是热的，湿的，混着树叶和泥土的味道。从飞机上下来那一刻，像被一块温毛巾捂住了脸。北方来的身体不适应这种湿度，闷得慌。但走着走着，皮肤不紧绷了，嘴唇不起皮了。原来湿润是一种很慢的东西——你以为是难受，过了半天才发现是舒服。</p>
            <p>热带雨林和别处的森林不一样。树是站着的，但藤蔓是跑着的。它们从地面蹿到树顶，缠住一切能缠的东西，缠成一个密不透风的绿网。阳光只能从缝隙里漏下来，一小块一小块地落在地上。踩在腐叶上软软的，空气里有一种闷了很久的植物味，不是花香，更接近药草。导游说这片林子里有野象。我说现在吗。他说几年前。版纳人说话的时候喜欢留一个尾巴，让你自己去想。</p>
            <p>澜沧江从版纳穿过去，出了境就不叫澜沧江了。站在江边看，水是浑黄的，不急，但流量很大。对岸就是东南亚，江边有人钓鱼，有人洗衣服，有人在卖烤鱼。一块钱一条，竹签穿着，辣椒面撒得很重。吃的时候被辣出眼泪，旁边的大姐笑得不行。她说"你是北方来的吧"，我说"对"。"多吃几次就好了，"她说，"跟这天气一样，习惯就好。"</p>
            <p>傣族的吊脚楼下面养着鸡鸭，上面住人。一座庙的金塔在阳光下亮得晃眼，院子里几个小和尚在扫地，穿着橙黄色的僧袍。最小那个大概七八岁，扫两下就抬头看树上的鸟，扫两下又看。旁边老和尚也不催他。寺庙墙外的菠萝蜜树挂了七八个果，最大的那个快有脸盆大了。版纳的菠萝蜜和别处的不一样——不是买的，是路过的时候正好熟了，有人站在梯子上摘，路过的人每人分一块。</p>
            <p>晚上了喝酒。版纳的啤酒是冰的，但你喝着喝着就不觉得热了。夜市沿着江边铺开，烧烤的烟混着香料的味道，每走两步就闻到不一样的东西。有人唱傣语歌，听不懂，调子一直往上走，走了就不下来。坐在江边吃东西的时候蚊子很多，但没人管——拍一下，继续吃。有个卖水果的姑娘把一块芒果塞到我手里，说"这个甜"，然后走了。那块芒果确实很甜。</p>
            <p>离开版纳那天早上又下了一场雨。和成都的雨不一样——版纳的雨是猛的，突然就下来，砸在芭蕉叶上噼里啪啦响。十几分钟就停了，太阳出来，地上的水汽往上升，整个城市像被蒸了一遍。飞机起飞的时候往下看，雨林像一块绿色的毯子铺开，澜沧江从中间划过去。想起那杯冰啤酒、那块甜芒果、那个扫地的少年和尚——版纳不会让你记住什么了不起的事。它让你记住的是那些该有的东西。</p>
          </motion.div>
          <motion.div className="mt-14" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <AudioPlayer playlist={[{ src: "/music/chengdu/窦唯、朝简 - 下雨了.mp3", cover: "/music/chengdu/cover1.jpg", title: "窦唯、朝简 - 下雨了" }, { src: "/music/chengdu/莫文蔚 - 阴天.mp3", cover: "/music/chengdu/cover2.jpg", title: "莫文蔚 - 阴天" }]} muted={muted} onMutedChange={setMuted} />
          </motion.div>
          <motion.div className="mt-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Link href="/gallery/photos/xishuangbanna/gallery" className={lc}>翻开影笺<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
