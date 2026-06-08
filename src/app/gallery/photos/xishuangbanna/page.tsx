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
            <p>但动车真正到站的时候，我愣了一下。出站口外面是一个普通得不能再普通的小广场。几个拉客的司机靠在栏杆边刷手机，远处有几棵稀疏的椰子树和芭蕉散在几栋灰扑扑的小楼旁边。门口没有穿傣族服饰的人，没有孔雀，也没有那种一落地就扑面而来的异域风情。似乎版纳把我记忆中的样子带走了。空气是潮的，但不是重庆夏天午后那种被太阳焖住的湿热。它更温吞，也更懒，像一座还没睡醒、也不太想梳洗打扮的小城。</p>
            <p>酒店接驳的司机倒是挺有意思。他自称是正宗东北版纳人，一路操着浓重的东北口音打趣。车窗外的街道慢慢往后退，电动车、小玉烧烤摊、低矮的平房，都乱糟糟地混在一起。从那会儿开始，我这次版纳的影笺收集才算真正按下了拍摄键。</p>
            <p>后来，是电动车把版纳还给了我。在这座小城里，最合适的出行方式是租一辆小电驴。油门一拧，风就贴了上来。路边水果摊的各种热带水果，傣味餐馆门口呛人的烟气，拖拉着拖鞋慢慢走路的人，还有湿热夜风里忽然飘过来的一点花香，都不再是隔着车窗看见的东西，而是直接迎到身上的。</p>
            <p>第一次骑车上那座跨江大桥时，天还未完全黑。桥很长，底下是澜沧江。风突然从江面上灌过来，带着落日把天边从粉橘烧成赤金。从桥上侧看下去江面很宽，水是浑黄的，不急不慢地往南流，它和我在云南德钦县的巴迪乡看到的澜沧江不太一样，它更安静，也更惬意了几分。在桥上的那几刻，我脑子里什么都没想，就觉得这里的日子，真他妈好过。后来每次过桥，我都会下意识松一点油门。好像车速慢下来，那阵风就能多留一会儿。</p>
            <p>星光夜市在江的另一边。坦白讲，夜市本身没太多意思。烤串、舂鸡脚、批发来的手工皂，还有一些挂着傣味招牌、吃起来却没什么傣味。告庄的灯火很明显是给游客准备的，这一点它也没打算掩饰。但到了晚上，灯一盏盏亮起来的时候，你又很难真的讨厌它。那些灯确实好看，金色的、红色的、暖黄色的光，把人的脸都照得柔和了一点。穿傣装的女孩提着裙摆从人群里走过去，泰国摊主操着不太流利的中文冲人笑，摊位前挤满了游客。烧烤的烟、酸辣的味道、音乐和人声搅在一起，整个夜市热得发亮。它当然商业。但它也确实热闹。这点很矛盾，也很版纳。它不是我想象里那个安静、神秘、带点秘境感的地方。它更直接，也更入世。可是灯亮起来的时候，人站在里面，又确实会被那种热闹感染到。</p>
            <p>植物园给人的感觉完全不一样。进去之后，周围一下子安静下来。那些热带植物不是规规矩矩地长着，而是挤在一起，缠在一起，从别的树干上冒出来，又从高处垂下去。藤蔓绕着树往上爬，叶子一层压着一层，大得有点不讲道理。我坐在草地边一截倒下的朽木上。阳光从叶子缝里漏下来，在脚边碎成一块一块的亮斑。那一刻我突然不太想拍照了。人很少，风也轻。植物就在那儿长着，不管你从哪里来，也不管你什么时候走。我坐了一会儿，什么都没干，只是看着叶子晃。那种舒服不是"景区很好看"的舒服，而是人突然慢下来的那种舒服。</p>
            <p>版纳的味道也很让人记得住。撒撇米线的苦味一开始有点出乎意料。它不是中药那种涩苦，而是一种青草一样的苦，被酸和辣包着，从舌根慢慢返上来。吃到后面，竟然在闷热里吃出一点清凉。星光夜市旁边那家711也让我印象很深。刚从人潮里挤出来，推开玻璃门，冷气一下子罩下来。货架上有很多平时少见的零食，泰式奶茶也意外好喝。那种感觉很奇怪，前一秒还在夜市里闻着小米辣和烧烤烟，下一秒就站在冷气很足的便利店里喝泰式奶茶。版纳就是这样。它有江风、植物、夜市和潮湿的空气，也有便利店、电动车、和很普通的晚上。它不是一个纯粹的远方，它也有很日常的部分。</p>
            <p>离开那天下午，我又骑车经过了一次桥。那天的光和第一天不一样。第一天的光是软的，带着粉橘和赤金；走的时候，光让江面被照得有点晃眼。我把车停在桥旁，扶着栏杆往下看了很久。水流的速度好像没变，还是不急不慢地往南走。过了边境线，这条江就不叫澜沧江了，会换成另一个名字。可水还是桥下这趟水。名字会变，流向不会变。我忽然觉得，旅行大概也是这样。最后留下来的，往往不是那些构图最好的照片。可能只是某天傍晚，江面上的风灌进领口；可能是夜市灯光下，摊主带着烟火气的笑；可能是植物园里，落在脚边的一块阳光；也可能是临走前站在桥上，看着一条即将改名的河，继续往南流。</p>
            <p>版纳没有在一开始就惊艳我。它有点普通，有点商业，也有点陈旧。可后来几天里，它又不声不响地把风、光、潮湿的空气，还有那种可以慢下来的感觉，一点点还给了我。</p>
          </motion.div>
          <motion.div className="mt-14" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <AudioPlayer playlist={[{ src: "/music/xishuangbanna/歌顿花园-Gordon Flanders P1 歌顿花园-Gordon Flanders.mp3", cover: "/music/xishuangbanna/微信图片_20260608214646_295_20.jpg", title: "Gordon Flanders - 歌顿花园" }, { src: "/music/xishuangbanna/【日推歌单】黑裙子乐队《Love is all》 P1 【日推歌单】黑裙子乐队《Love is all》.mp3", cover: "/music/xishuangbanna/微信图片_20260608213632_294_20.jpg", title: "黑裙子乐队 - Love is all" }]} muted={muted} onMutedChange={setMuted} />
          </motion.div>
          <motion.div className="mt-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Link href="/gallery/photos/xishuangbanna/gallery" className={lc}>翻开影笺<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
