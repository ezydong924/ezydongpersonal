"use client";

import Link from "next/link";
import BackButton from "@/components/back-button";
import { motion } from "framer-motion";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-bg";

const videos = [
  { title: "大连", desc: "滨城 · With light storm", cover: "/dalian.jpg", slug: "dalian" },
  { title: "成都", desc: "方寸之间 宽窄自如", cover: "/chengdu-cover.jpg", slug: "chengdu" },
  { title: "大理", desc: "风花雪月 树海眼泪 风沙粒 都会成为生命的一部分", cover: "/dali-cover.jpg", slug: "dali" },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.2 } } };
const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-24 relative overflow-hidden">
      <AnimatedGradientBackground
        Breathing={false}
        startingGap={125}
        gradientColors={["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"]}
        gradientStops={[35, 50, 60, 70, 80, 90, 100]}
      />
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery" label="返回" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        variants={container} initial="hidden" animate="visible"
      >
        {videos.map((v) => (
          <motion.div key={v.slug} variants={item}>
            <Link href={`/gallery/videos/${v.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.05] hover:border-white/[0.12] transition-all duration-500 block"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)" }}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={v.cover} alt={v.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h2 className="text-2xl md:text-3xl font-light tracking-[0.06em] text-white/80 group-hover:text-white/95 transition-colors duration-500"
                  style={{ fontFamily: "PingFang SC,Noto Serif SC,serif" }}>
                  {v.title}
                </h2>
                <p className="mt-2 text-sm text-white/35 font-light leading-relaxed group-hover:text-white/50 transition-colors duration-500">
                  {v.desc}
                </p>
                <div className="mt-4 flex items-center gap-2 text-white/20 group-hover:text-white/40 group-hover:gap-3 transition-all duration-500">
                  <span className="h-px w-6 bg-white/20 group-hover:w-10 group-hover:bg-white/30 transition-all duration-500" />
                  <span className="text-xs tracking-[0.3em] uppercase">观看</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
