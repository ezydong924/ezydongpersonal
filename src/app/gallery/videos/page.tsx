"use client";

import Link from "next/link";
import BackButton from "@/components/back-button";
import { motion } from "framer-motion";

const videos = [
  { title: "大连", desc: "滨城 · With light storm", cover: "/dalian.jpg", slug: "dalian" },
  { title: "成都", desc: "方寸之间 宽窄自如", cover: "/chengdu-cover.jpg", slug: "chengdu" },
  { title: "大理", desc: "风花雪月 树海眼泪 风沙粒 都会成为生命的一部分", cover: "/dali-cover.jpg", slug: "dali" },
];

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery" label="返回" />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24 gap-12 md:gap-16">
        {videos.map((v, i) => (
          <motion.div
            key={v.slug}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <Link href={`/gallery/videos/${v.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl aspect-[21/9] md:aspect-[21/8]">
                <img src={v.cover} alt={v.title}
                  className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-[1.02] group-hover:saturate-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs tracking-[0.3em] text-white/25 font-medium">0{i + 1}</span>
                    <h2 className="text-4xl md:text-6xl font-light tracking-[0.04em] text-white/85 group-hover:text-white transition-colors duration-500"
                      style={{ fontFamily: "PingFang SC,Noto Serif SC,serif" }}>
                      {v.title}
                    </h2>
                  </div>
                  <p className="mt-3 text-sm md:text-base text-white/30 font-light max-w-md group-hover:text-white/45 transition-colors duration-500">
                    {v.desc}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
