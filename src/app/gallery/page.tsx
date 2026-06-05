"use client";

import UnicornStudioBg from "@/components/ui/unicorn-studio-bg";
import BackButton from "@/components/back-button";
import Link from "next/link";

const entries = [
  { title: "影笺", subtitle: "Photography", desc: "快门是时间的物理切片。光线在建筑边缘的折射，具体生活里的无声诗意。", href: "/gallery/photos" },
  { title: "溯影", subtitle: "Cinematography", desc: "流动的画面承载更完整的故事。用镜头追溯光影的轨迹与记忆的脉络。", href: "/gallery/videos" },
];

export default function GalleryPage() {
  return (
    <>
      <UnicornStudioBg />
      <div className="fixed inset-0 bg-black/10 pointer-events-none z-0" />
      <div className="relative z-10 min-h-screen">
        <div className="absolute top-8 left-8">
          <BackButton href="/explore" label="返回" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen gap-10 px-8 md:px-16 lg:px-24">
          {entries.map((entry) => (
            <Link key={entry.title} href={entry.href}
              className="group relative flex-1 max-w-lg w-full overflow-hidden rounded-3xl border border-white/[0.06] hover:border-white/[0.15] transition-all duration-700"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)" }}>
              <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative p-10 md:p-14 lg:p-16">
                <div className="flex items-center gap-3 mb-20">
                  <span className="h-px w-8 bg-white/15 group-hover:w-12 group-hover:bg-white/30 transition-all duration-500" />
                  <p className="text-[10px] tracking-[0.35em] text-white/30 uppercase font-medium" style={{ fontFamily: "Inter,PingFang SC,sans-serif" }}>
                    {entry.subtitle}
                  </p>
                </div>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.04em] text-white/85 leading-[1.05] group-hover:text-white/95 transition-colors duration-500"
                  style={{ fontFamily: "PingFang SC,Noto Serif SC,serif" }}>
                  {entry.title}
                </h2>
                <p className="mt-8 text-sm md:text-base text-white/35 font-light leading-relaxed max-w-xs group-hover:text-white/50 transition-colors duration-500">
                  {entry.desc}
                </p>
                <div className="mt-14 flex items-center gap-2 text-white/25 group-hover:text-white/60 group-hover:gap-4 transition-all duration-500">
                  <span className="text-xs tracking-[0.3em] uppercase">进入</span>
                  <span className="text-lg">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
