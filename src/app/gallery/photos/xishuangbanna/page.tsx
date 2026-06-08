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
            <p>西双版纳，四个字念出来，空气好像就先潮了一点，绿了一点，变得亚热带起来。</p>
            <p>动车到站西双版纳时，我愣了一下。出站口外是一个普通得不能再普通的小广场，几个拉客的司机靠在栏杆边刷着手机。远处稀疏的椰子树和芭蕉叶，散落在几栋灰扑扑的小楼旁。没有傣族服饰，没有孔雀，也没有那种一落地就扑面而来的异域感。空气是潮的，但不是那种重庆夏日午后艳阳的闷湿，而是温吞的、懒散的，像一座还没睡醒、也懒得梳洗打扮去迎接谁的边境小城。</p>
            <p>酒店接驳的司机倒是为旅程增添了几分乐趣，他自封正宗东北版纳人，一路操着浓重的东北口音插科打诨。车窗外的街道如同未经剪辑的素材一点点后退：电动车、烧烤摊、低矮的平房、从缝隙里蛮横生长的热带植物，全无序地混杂在一起。也就是从那一刻起，我这次版纳的影笺收集，才算真正按下了拍摄键。</p>
            <p>后来，是一辆电动车把版纳的记忆还给了我。在这座小城，最合拍的出行方式不是打车，而是跨上一辆小电驴。拧下油门的那一刻，版纳的风突然就贴进了我。路边水果摊刺眼的白炽灯、傣味餐馆门口呛人的烟火气、趿拉着拖鞋慢吞吞的路人、湿热夜风里一闪而过的不知名花香——这一切都不再是隔着车窗的旁观，而是直接迎面撞进怀里的真实。</p>
            <p>第一次骑车上到那座连通两岸的大桥，天还将黑未黑，长桥凌空，跨过澜沧江，落日正把天际从暧昧的粉橘烧成热烈的赤金，随后又一寸寸熄灭。宽阔的江面上，浑黄的江水不急不躁地向南推移。那一瞬间，脑子里一切被风吹得干干净净，只剩下一个念头：这里的日子，真他妈好过。后来每次过桥，我都会下意识松开一点油门，仿佛只要慢下来，就能把那种被风穿透的自由感多截留几秒。</p>
            <p>星光夜市在江的对岸。坦白讲，夜市本身没太多意思。烤串、舂鸡脚、批发来的手工皂，还有那些挂着"傣味"招牌却吃出东北味的凉拌。告庄的灯火是为了游客快门而亮的，这一点它毫不掩饰。可奇怪的是，当夜幕彻底砸下来，那些灯光千千万万地亮起时，你又很难去真正苛责它。那些光确实像碎星一样落在了这片土地上。金的、红的、暖黄的光晕，把每一张脸都洗刷得柔和。穿傣装的女孩们提着裙摆穿梭，像一帧帧流动的画；泰国摊主操着不流利的中文咧嘴笑，人群在光影里摇晃，热闹是真的，商业也是真的。它可能不是我想象中那个秘境般的版纳，但却是一个无比明亮、生机勃勃、极为入世的版纳。</p>
            <p>但在植物园，又是另一套截然不同的生态法则。踏进去的一瞬，四周的杂音随风与澜沧江流去。这里的热带植物在进行一场旷日持久的竞争。它们挤在一起，纠缠在一起，气生根盲目地扎向半空，藤蔓遍布。那些夸张的阔叶像撑开的雨伞，贪婪地兜接每一寸倾泻下来的阳光。坐在草地边一截倒伏的朽木上，阳光穿过层层叠叠的叶片，在脚边碎成高光斑点。我忽然发现自己失去了按快门的冲动。一种极度安全的、不被打扰的惬意油然而生。</p>
            <p>版纳的味道，也让人流连忘返。撒撇米线的股苦味完全在预料之外。它是一种饱含着自然青草般的甘苦，被酸与辣包围，竟然在闷热中吃出了一身清凉。星光夜市旁的那家711也让我记忆犹新，刚从人潮里挤出来，转身推开那扇玻璃门——冷气兜头罩下，一杯特供的泰式奶茶让你清爽，带走疲惫。版纳就是这样，一边是原始的热带边缘，一边是闲暇惬意的清凉。</p>
            <p>离开那天下午，我又去骑了一次桥。我停在桥正中，扶着栏杆往下看了很久。水流的速度没变，依旧是不急不慢地向南推移。过了边境线，这条江就不叫澜沧江了，它会拥有一个新的名字。但水，还是桥下这趟水。名字会变，流向不会变。忽然觉得，旅行大抵也是如此。最后留在记忆里的，却往往不是那些被精巧构图的照片。可能只是某天傍晚，江面上灌进领口的那阵野风；是夜市高光下摊主沾着烟火气的笑；是朽木边一小块微距般的阳光斑点；又或者，是临走前站在桥上，目送一条即将改名的河，继续不知疲倦地向南流去。</p>
            <p>版纳没有在一开始就惊艳我。但它在随后的日子里，不急不躁地，把风、光影、潮湿的空气，和那些真正能够握在手里的松弛，一点一点，全都还给了我。</p>
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
