"use client";

import Link from "next/link";
import MosaicBg from "@/components/mosaic-bg";
import BackButton from "@/components/back-button";

const videos = [
  { title: "大连", desc: "滨城 · With light storm", cover: "/dalian.jpg", slug: "dalian" },
  { title: "成都", desc: "方寸之间 宽窄自如", cover: "/chengdu-cover.jpg", slug: "chengdu" },
  { title: "大理", desc: "风花雪月 树海眼泪 风沙粒 都会成为生命的一部分", cover: "/dali-cover.jpg", slug: "dali" },
];

export default function VideosPage() {
  return (
    <>
      <MosaicBg />
      <div className="fixed inset-0 bg-black/15 pointer-events-none z-0" />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">
        <div className="absolute top-8 left-8 z-50">
          <BackButton href="/gallery" label="返回" />
        </div>

        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {videos.map((v) => (
              <Link key={v.slug} href={`/gallery/videos/${v.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-white/[0.05] hover:border-white/[0.12] transition-all duration-500"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)" }}>
                {/* Cover image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={v.cover} alt={v.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                {/* Title + description below image */}
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
