"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { GradientBackground } from "@/components/ui/gradient-background";
import BackButton from "@/components/back-button";
import AudioPlayer from "@/components/ui/audio-player";

export default function Page() {
  const [muted, setMuted] = useState(false);

  return (
    <div className="relative min-h-screen">
      <GradientBackground colors={["hsl(160, 80%, 35%)", "hsl(150, 70%, 28%)", "hsl(170, 75%, 22%)"]} />
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery/photos" label="返回" />
      </div>

      {/* Mute toggle */}
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
            香港
          </motion.h1>

          <motion.div
            className="space-y-6 text-white/55 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p>
              杜可风把香港拍成了一种颜色。不是植物的绿，是霓虹灯管穿过潮湿的那种。暧昧、懒散，像泡在福尔马林里的梦。很长一段时间里，我沉浸于福尔马林的梦。
            </p>
            <p>
              但有些东西是泡不住的。比如维港的晚风。第一次站到星光大道是傍晚时分，对岸的高楼慢慢点亮。风从海面压过来，咸的，带一点柴油味，吹得人什么也不想想。天星小轮慢悠悠划过，每一趟都像在把对岸的光运到这边来。看着看着就忘了时间，它一呼一吸，你就跟着慢下来。
            </p>
            <p>
              在中环从IFC二楼的天桥一直走到交易广场，抬头三面都是楼，玻璃把夕阳折成不同的形状，脚底下是德辅道中的车流和叮叮车，头顶无数扇窗户里正在发生的交谈似乎与我有关，我们都在这里，但好像又没什么联系，我们只是在这里。那一刻，我只是刚好在这里。我在那个天桥上来回走了三四遍，夕阳很美，但是高德确实没让我找到方向。这就是香港，砌进每一块玻璃幕墙里的。
            </p>
            <p>
              后来站在庙街，发现那抹绿色确实还在。但多了太多别的东西。围挡上被雨水冲淡的涂鸦。茶餐厅玻璃上歪歪扭扭的手写菜单。711门口一个男孩蹲着给流浪猫倒矿泉水，露出半个屁股他也完全没注意。电影里不会拍这些——电影不需要白天的香港，不需要一座城市的苏醒。
            </p>
            <p>
              镜头里的香港是一首慢镜头情歌。真实的香港是情歌结束之后的空白。中环梳着背头的白领站在路边抽烟时放空的几秒。地铁站里所有人低头看手机、没有谁看谁的那一截扶梯。庙街收摊的阿婆把一个掉在地上的橘子捡起来，擦了擦，放了回去。这些不是什么值得被记住的画面，但偏偏写下的时候记得最清楚。
            </p>
            <p>
              我喜欢这种不梦幻的部分。梦幻太容易了，有人替你调好色、选好背景音乐，你只需要看。真实的香港得自己去闻、去吃、去迷路。在铜锣湾的人潮里被撞一下肩膀，那人却早已在灯火阑珊处。
            </p>
            <p>
              天星小轮还在开。票价涨了，船身重新刷了漆，但柴油味和那种绿色人造革的座位都没变。靠在船边看维港的时候，脑子里自动响起黄伟文的那首东京人寿... ...下一秒就被现实切回来：旁边大叔在公放短视频，海风把他的塑料袋吹起来挂在栏杆上，里面是一盒没吃完的叉烧饭。
            </p>
            <p>
              梦和塑料袋绑在一起，谁也不比谁高级。
            </p>
            <p>
              杜可风的绿色找到了，但它只是一层底色。底色之上，无数种活法同时进行。没有人喊Action，也没有人喊Cut。
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
                { src: "/music/hongkong/song.mp3", cover: "/music/hongkong/cover.jpg", title: "Gareth.T - 早到的u" },
                { src: "/music/hongkong/陈奕迅 - 粤语残片.mp3", cover: "/music/hongkong/PlayerAlbumCover_-17281211551780031877266.jpg", title: "陈奕迅 - 粤语残片" },
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
            <Link
              href="/gallery/photos/hongkong/gallery"
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
