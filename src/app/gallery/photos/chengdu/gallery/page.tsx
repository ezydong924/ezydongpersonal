"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/components/back-button";
import { X, Play, Pause } from "lucide-react";
import { musicStore } from "@/lib/music-store";
import InfiniteGallery from "@/components/infinite-gallery";

const PHOTOS = [
  "IMG20250214092206.jpg", "DSC_2444(2).jpg", "IMG_20250212_194849.jpg",
  "DSC_2482.jpg", "IMG20250212195618.jpg", "DSC_2381(1).jpg",
  "IMG20250213191750.jpg", "DSC_2453.jpg", "IMG_20250211_153016.jpg",
  "DSC_2490-已增强-降噪.jpg", "IMG20250212161755.jpg", "DSC_2413(1).jpg",
  "IMG20250212085251.jpg", "DSC_2510-已增强-降噪.jpg", "DSC_2442-已增强-降噪.jpg",
  "DSC_2520-已增强-降噪.jpg", "DSC_2536.jpg", "DSC_3150-已增强-降噪.jpg",
  "DSC_3160.JPG", "DSC_3153-已增强-降噪.jpg",
];

const THUMB_BASE = "/chengdu/thumbs";
const LIGHTBOX_BASE = "/chengdu/lightbox";

export default function ChengduGallery() {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    setMusicPlaying(musicStore.isPlaying);
    musicStore.acquire();
    const unsub = musicStore.subscribe(() => setMusicPlaying(musicStore.isPlaying));
    return () => { unsub(); musicStore.release(); };
  }, []);

  useEffect(() => { const t = setTimeout(() => setShowTitle(false), 2500); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);

  const handleClick = useCallback((i: number) => { setActive(i); }, []);
  const thumbs = PHOTOS.map((p) => `${THUMB_BASE}/${p}`);

  return (
    <div className="relative h-screen w-full bg-[#0a0a0c] overflow-hidden">
      <div className="fixed top-8 left-8 z-50"><BackButton href="/gallery/photos/chengdu" label="返回" /></div>
      <button onClick={() => { const a = musicStore.audioEl; if (a && a.paused) { musicStore.resume(); } else { musicStore.togglePlay(); } }} className="fixed top-8 right-8 z-50 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300">{musicPlaying ? <Pause size={16} /> : <Play size={16} />}</button>
      <AnimatePresence>{showTitle && (<motion.div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}><h1 className="font-bold tracking-[0.2em] select-none" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", fontFamily: '"PingFang SC","Noto Serif SC","SimSun",serif', WebkitTextStroke: "1.5px rgba(255,255,255,0.45)", WebkitTextFillColor: "transparent", textShadow: "0 0 80px rgba(255,255,255,0.08)" }}>成都</h1></motion.div>)}</AnimatePresence>
      <InfiniteGallery images={thumbs} className="h-full w-full" visibleCount={10} speed={0.6} fadeSettings={{ fadeIn: { start: 0.03, end: 0.15 }, fadeOut: { start: 0.78, end: 0.92 } }} blurSettings={{ blurIn: { start: 0.0, end: 0.08 }, blurOut: { start: 0.75, end: 0.9 }, maxBlur: 3.5 }} onImageClick={handleClick} />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none text-white/30 text-xs tracking-[0.2em]">滚轮浏览 · 自动播放 · 点击看大图</div>
      <AnimatePresence>{active !== null && (<motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}><button className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white/70 hover:text-white hover:bg-white/20 transition-all z-10" onClick={() => setActive(null)}><X size={20} /></button><motion.img src={`${LIGHTBOX_BASE}/${PHOTOS[active]}`} alt="" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }} onClick={(e) => e.stopPropagation()} /><div className="absolute bottom-8 text-white/45 text-sm tracking-widest">{active + 1} / {PHOTOS.length}</div></motion.div>)}</AnimatePresence>
    </div>
  );
}
