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
const item = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } } };

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      <AnimatedGradientBackground
        Breathing={false}
        startingGap={125}
        gradientColors={["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"]}
        gradientStops={[35, 50, 60, 70, 80, 90, 100]}
      />
      {/* Subtle dark veil for text readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none z-[1]" />
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery" label="返回" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10"
        variants={container} initial="hidden" animate="visible"
      >
        {videos.map((v) => (
          <motion.div key={v.slug} variants={item}>
            <Link href={`/gallery/videos/${v.slug}`}
              className="group relative overflow-hidden rounded-[2rem] transition-all duration-700 block"
              style={{
                background: "rgba(20,20,40,0.35)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
              }}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={v.cover} alt={v.title}
                  className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-[1.04] group-hover:saturate-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-6 md:p-7">
                <h2 className="text-2xl md:text-3xl font-light tracking-[0.06em] text-white/90 group-hover:text-white transition-colors duration-500"
                  style={{ fontFamily: "PingFang SC,Noto Serif SC,serif" }}>
                  {v.title}
                </h2>
                <p className="mt-3 text-sm text-white/40 font-light leading-relaxed group-hover:text-white/55 transition-colors duration-500">
                  {v.desc}
                </p>
                <div className="mt-5 flex items-center gap-2 text-white/25 group-hover:text-white/50 group-hover:gap-3 transition-all duration-500">
                  <span className="h-px w-5 bg-white/20 group-hover:w-8 group-hover:bg-white/35 transition-all duration-500" />
                  <span className="text-[11px] tracking-[0.35em] uppercase font-medium">观看</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
