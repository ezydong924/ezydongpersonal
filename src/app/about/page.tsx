"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Camera } from "lucide-react";
import BackButton from "@/components/back-button";

const secrets = [
  "你找到了第一个秘密。",
  "继续点，还有哦。",
  "差不多了...",
  "好吧，这是最后一个：\n这个网站是用爱和咖啡因搭建的。",
];

const destinations = [
  { index: "01", title: "影笺", subtitle: "PHOTOGRAPHY", href: "/gallery/photos" },
  { index: "02", title: "地图", subtitle: "PLACES", href: "/gallery/photos" },
  { index: "03", title: "随笔", subtitle: "THOUGHTS", href: "/thoughts" },
];

export default function AboutPage() {
  const [clicks, setClicks] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  const handleCameraClick = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 5) setShowSecret(true);
  };

  return (
    <main className="min-h-screen bg-[#090b0e] text-white">
      <div className="mx-auto max-w-[1280px] px-5 py-7 md:px-10 md:py-9 lg:px-14">
        <header className="flex items-center justify-between border-b border-white/[0.09] pb-5">
          <BackButton href="/" label="首页" />
          <p className="text-[10px] font-medium tracking-[0.28em] text-white/35">EZYDONG</p>
        </header>

        <section className="grid gap-12 py-14 lg:min-h-[calc(100vh-132px)] lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.55fr)] lg:items-center lg:gap-20 lg:py-20">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-white/30" />
              <p className="text-[10px] font-medium tracking-[0.3em] text-white/45">ABOUT / SHADOW MEMORY</p>
            </div>

            <div className="mt-8 flex items-end justify-between gap-5">
              <h1 className="font-serif text-6xl font-normal leading-none text-white/95 sm:text-7xl md:text-8xl">关于我</h1>
              <button
                type="button"
                onClick={handleCameraClick}
                aria-label="隐藏彩蛋"
                title="隐藏彩蛋"
                className="grid h-10 w-10 shrink-0 place-items-center border border-white/15 text-white/50 transition-colors hover:border-white/45 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <Camera size={17} strokeWidth={1.35} />
              </button>
            </div>

            <blockquote className="mt-12 border-l border-white/30 pl-5">
              <p className="text-xl font-light leading-relaxed text-white/82 md:text-2xl">Forever is composed of Nows.</p>
              <p className="mt-2 text-sm tracking-[0.12em] text-white/38">永恒，由一个个此刻组成。</p>
              <cite className="mt-4 block text-[10px] not-italic tracking-[0.22em] text-white/30">EMILY DICKINSON</cite>
            </blockquote>

            <div className="mt-12 max-w-xl space-y-6 text-base font-light leading-8 text-white/64 md:text-lg md:leading-9">
              <p>
                我用相机记录途经的城市、天气和那些短暂的时刻。这里放照片，也放一些尚未整理成答案的想法。
              </p>
              <p>
                有些东西消失得很快。拍下它们，不是为了留住，而是为了在很久以后，还能想起。
              </p>
            </div>

            <AnimatePresence initial={false}>
              {showSecret && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-8 max-w-md border-l border-white/20 pl-4 text-sm leading-6 text-white/45 whitespace-pre-line"
                >
                  {secrets[Math.min(clicks - 5, secrets.length - 1)]}
                </motion.p>
              )}
            </AnimatePresence>

            <p className="mt-12 text-sm text-white/42">摄影 / 随笔</p>
          </motion.article>

          <motion.figure
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="m-0 lg:justify-self-end"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.03] sm:aspect-[16/10] lg:h-[560px] lg:aspect-auto lg:w-[320px]">
              <img
                src="/hongkong/lightbox/IMG20260111142441.jpg"
                alt="香港的海港"
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
              />
              <div className="absolute inset-0 bg-black/15" />
            </div>
            <figcaption className="mt-3 flex items-center justify-between text-[10px] tracking-[0.2em] text-white/32">
              <span>HONG KONG</span>
              <span>2026</span>
            </figcaption>
          </motion.figure>
        </section>

        <nav aria-label="关于我页面导航" className="border-t border-white/[0.09]">
          {destinations.map((destination) => (
            <Link
              key={destination.title}
              href={destination.href}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-white/[0.09] py-5 transition-colors hover:bg-white/[0.035] sm:grid-cols-[4rem_1fr_auto] sm:py-6"
            >
              <span className="text-[10px] tracking-[0.16em] text-white/30">{destination.index}</span>
              <span>
                <span className="block text-xl font-light text-white/85 transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">{destination.title}</span>
                <span className="mt-1 block text-[10px] tracking-[0.24em] text-white/35">{destination.subtitle}</span>
              </span>
              <ArrowUpRight size={19} strokeWidth={1.25} className="text-white/35 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
