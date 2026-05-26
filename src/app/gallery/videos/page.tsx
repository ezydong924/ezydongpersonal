"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MosaicBg from "@/components/mosaic-bg";
import BackButton from "@/components/back-button";

const videos = [
  { title: "城市光影", desc: "穿梭于钢筋森林，捕捉光的轨迹与建筑的呼吸。", cover: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80", slug: "urban-light" },
  { title: "自然呼吸", desc: "山川湖泊的静谧时刻，风与水的无声对话。", cover: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=800&q=80", slug: "nature-breath" },
  { title: "人间烟火", desc: "市井巷陌的日常切片，平凡生活的诗意瞬间。", cover: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80", slug: "human-moments" },
];

export default function VideosPage() {
  const [active, setActive] = useState(0);
  const handleNext = useCallback(() => setActive((p) => (p + 1) % videos.length), []);
  const handlePrev = () => setActive((p) => (p - 1 + videos.length) % videos.length);
  useEffect(() => { const i = setInterval(handleNext, 5000); return () => clearInterval(i); }, [handleNext]);
  const isActive = (i: number) => i === active;
  const rr = () => `${Math.floor(Math.random() * 12) - 6}deg`;

  return (
    <>
      <MosaicBg />
      <div className="fixed inset-0 bg-black/10 pointer-events-none z-0" />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-16">
        <div className="absolute top-8 left-8 z-50">
          <BackButton href="/gallery" label="返回" />
        </div>

        <div className="bg-white/[0.08] border border-white/[0.15] rounded-[2.5rem] p-10 md:p-16 max-w-5xl w-full backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Cover */}
            <div className="flex justify-center">
              <div className="relative h-80 w-full max-w-xs">
                <AnimatePresence>
                  {videos.map((v, i) => (
                    <motion.div
                      key={v.slug}
                      initial={{ opacity: 0, scale: 0.9, y: 40, rotate: rr() }}
                      animate={{ opacity: isActive(i) ? 1 : 0.4, scale: isActive(i) ? 1 : 0.92, y: isActive(i) ? 0 : 16, zIndex: isActive(i) ? videos.length : videos.length - Math.abs(i - active), rotate: isActive(i) ? "0deg" : rr() }}
                      exit={{ opacity: 0, scale: 0.9, y: -40 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <img src={v.cover} alt={v.title} className="h-full w-full rounded-2xl object-cover shadow-2xl" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Text */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                  <h2 className="text-4xl md:text-5xl font-bold text-white tracking-[-0.02em]">{videos[active].title}</h2>
                  <p className="mt-4 text-lg text-white/60 font-light leading-relaxed">{videos[active].desc}</p>
                  <Link href={`/gallery/videos/${videos[active].slug}`} className="inline-block mt-8 text-sm text-white/70 hover:text-white font-medium transition-colors">观看视频 &rarr;</Link>
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-3 pt-8">
                <button onClick={handlePrev} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] border border-white/[0.12] hover:bg-white/[0.15] transition-colors">
                  <svg className="h-4 w-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button onClick={handleNext} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] border border-white/[0.12] hover:bg-white/[0.15] transition-colors">
                  <svg className="h-4 w-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
