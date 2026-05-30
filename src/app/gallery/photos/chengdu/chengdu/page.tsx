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

  const btnClass = "fixed top-8 right-8 z-50 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300";

  const linkClass = "inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white font-medium hover:bg-white/25 transition-all duration-300";

  const handleMuteToggle = () => {
    musicStore.toggleMute();
    const audio = musicStore.audioEl;
    if (audio && audio.paused) audio.play().catch(() => {});
  };

  return (
    <div className="relative min-h-screen">
      <GradientBackground colors={["hsl(18, 60%, 30%)", "hsl(30, 50%, 28%)", "hsl(10, 40%, 22%)"]} />
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery/photos" label="返回" />
      </div>

      <button onClick={handleMuteToggle} className={btnClass}>
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
            成都
          </motion.h1>

          <motion.div
            className="space-y-6 text-white/55 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p>
              都江堰的水从鱼嘴分开。安澜索桥上挤满了人，导游的喇叭声在空气里撞来撞去——但水没有声音。它被分开了两千年，早就习惯了。站在离堆公园往下看，水流得不急不慢，甚至不像在流，像在渗，往平原的每一寸缝隙里渗。两岸的石头被磨得光滑，不是被水砸的，是被水摸的——摸了整整两千年。
            </p>
            <p>
              青城山的前山道观藏在古树深处。雨后天晴的青城山似乎生命力更加旺盛，几缕微光打在长满了青苔的石阶上，有种曲径通幽处的感觉。道士坐在一旁的木凳上，我沿着石阶向上，随着微光的指引看到了道士在用一针一线缝着什么，香客从面前过也只是做着手中的工作，我用相机记录了这一刻（见视频页）。山里的安静不是被制造出来的，是积蕴出来的——鸟叫和水声叠在一起，奏成了一种比安静更躁动比喧闹更平淡的阴阳调和交响乐。
            </p>
            <p>
              后来在成都市里遇上一场雨。细细的，安静的。空气潮湿，带着树叶和泥土混在一起的味道。站在屋檐下躲雨的时候想起青城山。原来雨也知道怎么安静。它不催你不赶你，也只是在做自己的事。
            </p>
            <p>
              锦江的夜船从合江亭滑出去。两岸的灯光碎在水面上，碎了又聚，碎了又聚。过安顺廊桥的时候，桥洞的金边倒影落进水里——一座在上，一座在下，分不清哪座更安静。河风是凉的，带着熟悉的潮湿却令人安心。岸边的酒吧在放民谣，虽然全国各地都是一个样子的民谣酒吧，丽江，大理，重庆，香格里拉，苏州......为什么有古镇的地方总有一模一样的酒吧，但是在成都放成都我也找不到什么奇怪的点。远远的，调子很熟，歌词一直回荡在锦江周围。水不管上面在唱什么，只管往前流。
            </p>
            <p>
              武侯祠的红墙夹道，竹影落在墙上像墨洒了。出师表刻在碑上，临表涕零不知所言——太沉了，读了两行没再往下读。惠陵埋着刘备，外面却放着三国杀的卡牌。坟头比想象中小得多，长了草，安安静静的。君臣合祀，生前死后都在一起。红墙外面就是锦里，人声隐隐传过来——不到两百米，隔了一千八百年。
            </p>
            <p>
              离开成都之后偶尔会想起那场雨。它轻柔，下起来不急不慢。还有都江堰的水，青城山的苔，武侯祠的竹影。这座城里最吵的东西来来去去，只有那些不说话的留下来了，这是我眼中的蜀地。
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
                { src: "/music/chengdu/窦唯、朝简 - 下雨了.mp3", cover: "/music/chengdu/cover1.jpg", title: "窦唯、朝简 - 下雨了" },
                { src: "/music/chengdu/莫文蔚 - 阴天.mp3", cover: "/music/chengdu/cover2.jpg", title: "莫文蔚 - 阴天" },
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
            <Link href="/gallery/photos/chengdu/gallery" className={linkClass}>
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
