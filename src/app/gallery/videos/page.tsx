"use client";

import Link from "next/link";
import BackButton from "@/components/back-button";
import { motion } from "framer-motion";

const videos = [
  { title: "大连", desc: "滨城 · With light storm", cover: "/dalian.jpg", slug: "dalian" },
  { title: "成都", desc: "方寸之间 宽窄自如", cover: "/chengdu-cover.jpg", slug: "chengdu" },
  { title: "大理", desc: "风花雪月 树海眼泪 风沙粒 都会成为我生命的一部分", cover: "/dali-cover.jpg", slug: "dali" },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.25 } } };
const item = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } };

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery" label="返回" />
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-24 md:py-32">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <Link href={`/gallery/videos/${videos[0].slug}`} className="group block">
            <div className="relative overflow-hidden rounded-2xl">
              <img src={videos[0].cover} alt={videos[0].title}
                className="w-full aspect-[16/7] md:aspect-[16/6] object-cover transition-all duration-1000 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <h2 className="text-5xl md:text-7xl font-light tracking-[0.02em] text-white/90"
                  style={{ fontFamily: "PingFang SC,Noto Serif SC,serif" }}>
                  {videos[0].title}
                </h2>
                <p className="mt-2 text-sm text-white/30 font-light">{videos[0].desc}</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Secondary */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={container} initial="hidden" animate="visible"
        >
          {videos.slice(1).map((v) => (
            <motion.div key={v.slug} variants={item}>
              <Link href={`/gallery/videos/${v.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl">
                  <img src={v.cover} alt={v.title}
                    className="w-full aspect-[4/3] md:aspect-[3/4] object-cover transition-all duration-1000 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8">
                    <h2 className="text-3xl md:text-4xl font-light tracking-[0.03em] text-white/85 group-hover:text-white transition-colors"
                      style={{ fontFamily: "PingFang SC,Noto Serif SC,serif" }}>
                      {v.title}
                    </h2>
                    <p className="mt-1 text-xs text-white/25 font-light">{v.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
