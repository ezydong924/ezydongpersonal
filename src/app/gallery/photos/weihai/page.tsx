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
            <p>威海在记忆里，是一次靠岸。从大连启程，搭乘渤海恒生。夜里的船像一只铁皮匣子，载着人、行李、睡意和没说完的话，一头扎进黑夜，往海那边去。推开舱门上甲板，海和天已经黑成一块，边界全没了。远处没有岸，也没有灯，只有船身旁边翻起来的白沫，一卷，一散，一亮，很快又被黑暗收回去。</p>
            <p>风从海面灌进外套里，衣角被吹得发响。夜海有一种奇怪的美。它什么都不给你看，却让你觉得什么都在。浪声在船底下，风在耳边，城市在还看不见的前方。那时候的威海还没有出现，只是黑暗尽头一个将要抵达的名字。</p>
            <p>快靠岸时，天亮了。再上甲板，海面已经铺了一层薄光。不是照片里那种明亮的日出，而是很淡、很轻的一层，像有人把夜色从水面上一点点擦开。船还在往前，船尾的水痕白了一路，又慢慢散掉。朋友站在旁边，各自看着海，谁也没说话。太阳慢慢升起来，海面跟着亮，岸线在远处一点点清楚，威海就这样从水汽里浮出来。</p>
            <p>这座城第一眼给人的不是热闹，是干净。海蓝得澄澈方正，浪白得干净纯粹。威海的蓝更清，像被风擦过。岸边的松树被吹得朝一个方向偏，不像特意修过的景观树，倒像这些年一直在和海风商量，最后长成了这个方向。远处的风车慢慢转，白色叶片一圈一圈划过天边。风在威海不是空的，它有形，有声，有去处。它在松针里，在浪边上，在风车的转动里，也在人的衣袖和头发里。</p>
            <p>踩着黄昏的光影去浅滩，脚下的沙细得像揉碎的水晶。脚踩下去，先是软，水一冲，沙子从脚底慢慢抽走，人也跟着陷下去一点。那一下很小，却很真实，像被海轻轻拽住。海水漫过脚踝，凉意顺着脚背一寸寸漫上来，浪在腿边碎成绒绒的白絮，退去后，皮肤上沾着淡淡的海盐味。人们的影子被夕阳拖得很长。太阳压低，水面碎成一片一片的金光，好像整片海都在慢慢发亮。</p>
            <p>威海的美不绕弯。它不是隔着雾的江南，也不是要等人慢慢辨认的古城。它美得明白，蓝、白、金，风一吹，全都摊开。海太大，天太高，人在里面反而会安静下来。很多事情不用说，海已经替你空出地方。</p>
            <p>暮色沉下来时，三五好友在海边围桌吃饭。后来记不清点了多少菜，只记得有一盘贝类，壳上还有海的咸。桌子不大，灯也不亮，几个人坐得很近。筷子碰着盘子，杯子挪来挪去，笑声落在桌边，被风吹了一下，又没有散。那晚没有谁把话说得多郑重，好像说重了就不像那一夜了。灯光在杯沿上停一会儿，风从街口过来，海在远处黑着，那一小段时光，便已悄悄落进了心里。</p>
            <p>后来走到沙滩上，海隐在了夜色里，只剩浪声在耳边起伏。白天的浪是亮的，夜里的浪是沉的，一下一下，像从黑暗里递过来的回音。几个人靠着坐，笑声很近。那一晚的风不冷，或者说，不是大事，也不像电影里的桥段，只是一个普通夜晚忽然被人轻轻按住，按成后来想起威海时，最亮的一小块。</p>
            <p>它是夜船边一闪即灭的白沫，是清晨甲板上那层薄光，是朋友在旁边沉默着看海，是浅滩里被水抽走的细沙，是贝壳上的咸，是夜里没有散开的笑声。这些画面本来不挨着，夜渡和黄昏不挨着，日出和饭桌不挨着，浪声和笑声也不挨着。可记忆不是地图，它不按顺序走。它只把真正刻进心里的片段，拢在了一处。</p>
            <p>海很大，风也很大，人本来很容易被吹散。威海把我从夜里送到岸边，又把一些小小的东西留在了身上。像衣服上的盐，像鞋里的沙，像翻看照片时忽然浮起来的一点光。后来再想起它，先是海风，再是晨光，再是某个夜里靠得很近的人声。</p>
            <p>那大概就是威海。一座从海上慢慢亮起来的城市。也是一段没有被风吹走的时间。</p>
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
