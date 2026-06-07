"use client";

import Link from "next/link";
import { MeshGradient } from "@paper-design/shaders-react";
import BackButton from "@/components/back-button";

const videos = [
  { title: "大连", desc: "滨城 · With light storm", cover: "/dalian.jpg", slug: "dalian" },
  { title: "成都", desc: "方寸之间 宽窄自如", cover: "/chengdu-cover.jpg", slug: "chengdu" },
  { title: "大理", desc: "风花雪月 树海眼泪 风沙粒 都会成为生命的一部分", cover: "/dali-cover.jpg", slug: "dali" },
];

export default function VideosPage() {
  return (
    <>
      <div className="fixed inset-0 z-0">
        <MeshGradient
          style={{ height: "100vh", width: "100vw" }}
          distortion={0.4}
          swirl={0.05}
          speed={0.6}
          colors={["hsl(270, 40%, 8%)", "hsl(260, 35%, 15%)", "hsl(280, 30%, 20%)", "hsl(250, 25%, 12%)"]}
        />
      </div>
      <div className="fixed inset-0 bg-black/20 pointer-events-none z-0" />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">
        <div className="absolute top-8 left-8 z-50">
          <BackButton href="/gallery" label="返回" />
        </div>

        <div className="w-full max-w-5xl flex flex-col gap-8">
          {videos.map((v, i) => (
            <Link key={v.slug} href={`/gallery/videos/${v.slug}`}
              className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl border border-white/[0.04] hover:border-white/[0.1] transition-all duration-700"
              style={{ background: "radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.03) 0%, transparent 50%)" }}>
              {/* Cover — cinematic 16:9 on desktop, 16:10 on mobile */}
              <div className={`relative w-full md:w-[55%] aspect-video overflow-hidden ${i === 1 ? "md:order-2" : ""}`}>
                <img src={v.cover} alt={v.title}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-black/30 md:via-transparent md:to-transparent" />
              </div>
              {/* Text */}
              <div className={`relative flex flex-col justify-center p-8 md:p-12 md:w-[45%] ${i === 1 ? "md:order-1 md:text-right" : ""}`}>
                <span className="text-[10px] tracking-[0.4em] text-white/20 uppercase font-medium mb-4">0{i + 1}</span>
                <h2 className="text-4xl md:text-5xl font-light tracking-[0.04em] text-white/80 group-hover:text-white/95 transition-colors duration-500"
                  style={{ fontFamily: "PingFang SC,Noto Serif SC,serif" }}>
                  {v.title}
                </h2>
                <p className="mt-4 text-sm text-white/30 font-light leading-relaxed max-w-xs group-hover:text-white/45 transition-colors duration-500">
                  {v.desc}
                </p>
                <div className="mt-8 flex items-center gap-2 text-white/15 group-hover:text-white/35 group-hover:gap-3 transition-all duration-500">
                  <span className="h-px w-6 bg-white/15 group-hover:w-8 group-hover:bg-white/25 transition-all duration-500" />
                  <span className="text-xs tracking-[0.3em] uppercase">观看</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
