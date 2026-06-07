"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import BackButton from "@/components/back-button";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-bg";

const videos = [
  { title: "大连", desc: "滨城 · With light storm", cover: "/dalian.jpg", slug: "dalian", grad: "linear-gradient(135deg, #1a3a5c, #0d1f33)" },
  { title: "成都", desc: "方寸之间 宽窄自如", cover: "/chengdu-cover.jpg", slug: "chengdu", grad: "linear-gradient(135deg, #3d1a1a, #1a0d0d)" },
  { title: "大理", desc: "风花雪月 树海眼泪 风沙粒 都会成为我生命的一部分", cover: "/dali-cover.jpg", slug: "dali", grad: "linear-gradient(135deg, #1a2e1a, #0d1a0d)" },
];

export default function VideosPage() {
  const [active, setActive] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(0);
  const total = videos.length;
  const navigate = useCallback((n: number) => setActive((n + total) % total), [total]);
  const hDS = (cx: number) => { setIsDragging(true); dragStartRef.current = cx; };
  const hDM = useCallback((cx: number) => { if (!isDragging) return; setDragOffset(cx - dragStartRef.current); }, [isDragging]);
  const hDE = useCallback(() => { if (!isDragging) return; if (Math.abs(dragOffset) > 60) navigate(active + (dragOffset < 0 ? 1 : -1)); setIsDragging(false); setDragOffset(0); }, [isDragging, dragOffset, active, navigate]);
  useEffect(() => { if (!isDragging) return; const mm = (e: MouseEvent) => hDM(e.clientX); const tm = (e: TouchEvent) => hDM(e.touches[0].clientX); const up = () => hDE(); window.addEventListener("mousemove", mm); window.addEventListener("touchmove", tm); window.addEventListener("mouseup", up); window.addEventListener("touchend", up); return () => { window.removeEventListener("mousemove", mm); window.removeEventListener("touchmove", tm); window.removeEventListener("mouseup", up); window.removeEventListener("touchend", up); }; }, [isDragging, hDM, hDE]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      <AnimatedGradientBackground
        Breathing={false}
        startingGap={125}
        gradientColors={["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"]}
        gradientStops={[35, 50, 60, 70, 80, 90, 100]}
      />
      <div className="fixed top-8 left-8 z-50"><BackButton href="/gallery" label="返回" /></div>
      <div className="relative w-full max-w-md mx-auto" style={{ height: "520px" }}>
        {videos.map((v, i) => {
          const order = (i - active + total) % total;
          let style: React.CSSProperties = {};
          if (order === 0) style = { transform: `translateX(${dragOffset}px)`, opacity: 1, zIndex: total };
          else if (order <= 2) { const s = 1 - 0.06 * order; style = { transform: `scale(${s}) translateY(${-3 * order}rem)`, opacity: 1 - 0.25 * order, zIndex: total - order }; }
          else style = { transform: "scale(0.8)", opacity: 0, zIndex: 0, pointerEvents: "none" };
          const isActive = order === 0;
          return (
            <div key={v.slug} className="absolute inset-0 transition-transform duration-300 select-none cursor-grab active:cursor-grabbing" style={style}
              onMouseDown={(e) => { if (isActive) hDS(e.clientX); }} onTouchStart={(e) => { if (isActive) hDS(e.touches[0].clientX); }}>
              <Link href={isActive ? `/gallery/videos/${v.slug}` : "#"} className="block h-full">
                <div className="glass-effect rounded-3xl overflow-hidden h-full">
                  <div className="relative h-[55%] overflow-hidden">
                    <img src={v.cover} alt={v.title} className="h-full w-full object-cover transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-6 md:p-7 flex flex-col justify-between" style={{ height: "45%" }}>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm" style={{ background: v.grad }}>{v.title[0]}</div>
                        <h2 className="text-2xl font-light tracking-[0.04em] text-white/85" style={{ fontFamily: "PingFang SC,Noto Serif SC,serif" }}>{v.title}</h2>
                      </div>
                      <p className="text-sm text-white/35 font-light leading-relaxed">{v.desc}</p>
                    </div>
                    <div className="mt-4 text-xs text-white/20 font-light text-right">点击观看 →</div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-8">
        {videos.map((_, i) => (
          <button key={i} onClick={() => navigate(i)} className={`w-2 h-2 rounded-full transition-all duration-300 ${active === i ? "bg-white/60 w-6" : "bg-white/20 hover:bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
}
