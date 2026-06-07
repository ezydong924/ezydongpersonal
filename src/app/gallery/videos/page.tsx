"use client";

import Link from "next/link";
import BackButton from "@/components/back-button";
import { motion } from "framer-motion";

const videos = [
  { title: "大连", desc: "滨城 · With light storm", cover: "/dalian.jpg", slug: "dalian" },
  { title: "成都", desc: "方寸之间 宽窄自如", cover: "/chengdu-cover.jpg", slug: "chengdu" },
  { title: "大理", desc: "风花雪月 树海眼泪 风沙粒 都会成为生命的一部分", cover: "/dali-cover.jpg", slug: "dali" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery" label="返回" />
      </div>

      <section className="w-full px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="text-xs tracking-[0.4em] text-white/25 uppercase font-medium">Cinematography</p>
            <h2 className="mt-4 text-3xl font-light tracking-[0.06em] text-white/80"
              style={{ fontFamily: "PingFang SC,Noto Serif SC,serif" }}>
              溯影
            </h2>
          </div>

          <motion.div
            className="grid grid-cols-1 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {videos.map((v, i) => (
              <motion.div key={v.slug} variants={itemVariants}>
                <Link href={`/gallery/videos/${v.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-3xl aspect-[16/7] md:aspect-[16/5]">
                    <img src={v.cover} alt={v.title}
                      className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-14">
                      <span className="text-[11px] tracking-[0.35em] text-white/30 font-medium uppercase">0{i + 1} / 03</span>
                      <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.03em] text-white/90 group-hover:text-white transition-colors duration-500"
                        style={{ fontFamily: "PingFang SC,Noto Serif SC,serif" }}>
                        {v.title}
                      </h2>
                      <p className="mt-4 text-sm md:text-base text-white/35 font-light leading-relaxed max-w-lg group-hover:text-white/50 transition-colors duration-500">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
