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
            <p>版纳的颜色跟别处不一样。不是绿色——是很多种绿叠在一起。芭蕉叶的绿、槟榔的绿、橡胶林成片成片的绿，中间还夹着金色。金色的佛塔尖在热带的太阳底下亮得刺眼。路边有棵菠萝蜜树，七八个果子挂在树干上，像一群挤在一起的小胖子。也不知道谁种的，反正路过的人都能摘。</p>
            <p>下午最热的时候什么也不想干，就躺在竹楼的阴凉里。听见鸡在底下叫，知了在树上叫，远处有人用傣语唱歌，调子软软的，听不懂，但听着就来睡意。醒过来发现有人在我旁边放了一碗菠萝蜜。不知道是谁放的。版纳就是这样的——东西会自己出现。路边的芒果自己熟了、野象自己来了、菠萝蜜自己跑到你碗里。</p>
            <p>傍晚去澜沧江边。水是浑的，不急，反正要出境了，不差这一会儿。江边全是夜市，一排排的灯亮起来，不像城市那种惨白的灯，是暖黄的，有些是红蓝绿串在一起闪。烧烤的烟往上飘，每一种味道都浓得过分。烤鱼、烤鸡、烤芭蕉、烤一种我说不上名字的菌子。要了一瓶冰啤酒，坐在江边喝。对岸黑漆漆的，已经有另一个国家在睡觉了。这边还在吃。</p>
            <p>寺庙里几个小和尚在扫地。穿橙黄色的僧袍，最小那个大概八九岁，扫两下就抬头看树上的松鼠，扫两下又看。旁边老和尚也不说他。墙上画着壁画，红的绿的蓝的，画的都是我没听过的故事。从寺里出来，街上的小孩用水枪对着我滋了一下，笑了一声跑走了。地上还留着白天泼水节的湿印子。</p>
            <p>晚上回到住处，阳台外面全是虫叫。不是一两种，是几十种，密得像一张声音的毯子，把整个夜罩住了。坐在阳台上，头顶有颗星星比别处大，可能是错觉。蚊子也多，咬了几口，懒得管。那种感觉很奇怪——明明在一个完全陌生的地方，周围全是陌生的声音和气味，但你一点也不怕。热带大概就是这样，它用它的吵闹让你安心。</p>
            <p>走的那天早上又去了那棵菠萝蜜树。果子还在，比来的时候大了一圈。伸手摸了摸，硬硬的，还没熟。下次来的时候应该可以摘了吧。版纳不是一座让你告别时会难过的城市。它太好过了，好到你已经在想下次什么时候来。</p>
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
