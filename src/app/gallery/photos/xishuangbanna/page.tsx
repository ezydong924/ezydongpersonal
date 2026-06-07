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
            <p>版纳的绿是你躲不掉的。推开窗是绿的，走在路上是绿的，连空气都绿得发潮。芭蕉叶撑开来比人还大，槟榔树一棵一棵往上戳，橡胶林往远处铺过去，铺到你分不清那是树还是山。在别处你要特意去找一片森林。在版纳是森林来找你，它就在路边、在墙头、在没人管的空地，自己长自己的，鸟在上面叫，松鼠从一棵树跳到另一棵，懒得理你。</p>
            <p>街上有棵菠萝蜜树，树干上挂了七八个果，最大的那颗快抱不住了。卖早点的傣族大姐看我抬头看，说再过半个月就熟了。"熟了你自己摘一个嘛，"她说，"反正也吃不完。"她把一杯老挝冰咖啡递过来，塑料杯，吸管插着，三块钱。不是我要的，是她顺手给我的。版纳有一种不自知的慷慨。东西不是被"送"的——它们就在那里，熟了，你要就拿。</p>
            <p>佛寺的金塔在太阳底下亮得晃眼。院里几个小和尚穿着橙黄色僧袍扫地，最小那个大概八岁，扫两下就抬头看树上的鸟，扫两下又看。老和尚在旁边打盹。这座庙不让你觉得庄严，它让你觉得懒。那种懒不是没力气——是外面太热了，是菠萝蜜太重了，是知了叫得太响了，是天上的云走得比你慢。懒在这里不是偷懒，是合理。</p>
            <p>澜沧江穿过城中间，浑黄色，不急。流着流着就出国了，改名湄公河。我站在江边想，一条河出了境就不叫原来的名字了，但它自己不在乎。江边全是夜市。烤鱼用香茅草捆着，辣椒面撒得很重，咬一口眼泪都快出来了。啤酒是冰的，杯子外面凝了一层水珠，拿起来手是湿的。对岸已经有人在睡觉，这边还在吃——芭蕉叶包的糍粑、竹签穿的烤鸡、冰块碰杯子的声音。没人看表。</p>
            <p>下午的雨说来就来。哗一下砸在芭蕉叶上，像有人在楼上倒了一桶水。二十分钟，停了。太阳出来，地面往上蒸，空气里全是泥土和叶子的味道，好闻得不像真的。街上的水洼还没有干，一个小孩跑过去踩了一脚，水花溅了他妈一裤子。他妈没骂他，笑了。我突然有点羡慕——不是因为什么了不起的事。就是那一下，雨停了，太阳出来了，踩了水坑，笑了。</p>
            <p>后来跟朋友聊起版纳，我说不清它到底好在哪。不是风景——风景哪里都有。是那种感觉：很多东西在这里不需要理由。树不需要理由就长得那么高，菠萝蜜不需要理由就熟了，路边的大姐不需要理由就给你一杯咖啡。你也不需要理由，就可以在这里开心。这就够了。</p>
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
