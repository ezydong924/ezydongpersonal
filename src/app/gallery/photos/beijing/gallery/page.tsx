"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useInView } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/components/back-button";
import { X, Play, Pause } from "lucide-react";
import { musicStore } from "@/lib/music-store";

const PHOTOS = [
  "IMG_20260503_141244.jpg", "IMG_20260503_141934.jpg", "IMG_20260503_142002.jpg",
  "IMG_20260504_220605.jpg", "IMG_20260505_143706.jpg",
  "IMG_2925.jpg", "IMG_2935.jpg", "IMG_3162.jpg", "IMG_3174.jpg", "IMG_3186.jpg",
  "retouch_2025103013054637.jpg", "retouch_2026050314153105.jpg",
  "retouch_2026050421575970.jpg", "retouch_2026050422090729.jpg",
  "retouch_2026050422233621.jpg", "retouch_2026050422350449.jpg",
  "retouch_2026050422401591.jpg", "retouch_2026050422472990.jpg",
];

function shuffle(arr: string[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function distribute(photos: string[], cols: number) {
  const cols_arr: string[][] = Array.from({ length: cols }, () => []);
  photos.forEach((p, i) => cols_arr[i % cols].push(p));
  return cols_arr;
}

function AnimatedImage({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [loaded, setLoaded] = useState(false);
  const [ratio, setRatio] = useState(3 / 4);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setRatio(img.naturalWidth / img.naturalHeight);
    img.src = src;
  }, [src]);

  return (
    <div
      ref={ref}
      className="relative w-full rounded-lg overflow-hidden cursor-pointer bg-white/[0.03] border border-white/[0.04] hover:border-white/15 transition-all duration-500"
      style={{ aspectRatio: ratio }}
      onClick={onClick}
    >
      <img
        alt={alt}
        src={src}
        className={`size-full object-cover transition-all duration-700 ease-out ${
          isInView && loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export default function BeijingGallery() {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [cols, setCols] = useState(3);
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    setMusicPlaying(musicStore.isPlaying);
    musicStore.acquire();
    const unsub = musicStore.subscribe(() => setMusicPlaying(musicStore.isPlaying));
    return () => { unsub(); musicStore.release(); };
  }, []);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCols(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const shuffled = useMemo(() => shuffle(PHOTOS), []);
  const columns = useMemo(() => distribute(shuffled, cols), [shuffled, cols]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0c]">
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery/photos/beijing" label="返回" />
      </div>

      <button
        onClick={() => musicStore.togglePlay()}
        className="fixed top-8 right-8 z-50 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300"
      >
        {musicPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-24">
        <div className="w-full max-w-6xl">
          <motion.h1
            className="text-3xl font-light tracking-wide text-white/70 mb-12 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            影笺 · 北京
          </motion.h1>

          <div className="mx-auto grid w-full gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {columns.map((colPhotos, colIdx) => (
              <div key={colIdx} className="grid gap-4 auto-rows-max">
                {colPhotos.map((photo, idx) => (
                  <AnimatedImage
                    key={photo}
                    src={`/beijing/thumbs/${photo}`}
                    alt={`Beijing ${colIdx}-${idx}`}
                    onClick={() => setActivePhoto(photo)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activePhoto !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white/70 hover:text-white hover:bg-white/20 transition-all z-10"
              onClick={() => setActivePhoto(null)}
            >
              <X size={20} />
            </button>

            <motion.img
              src={`/beijing/lightbox/${activePhoto}`}
              alt=""
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-8 text-white/45 text-sm tracking-widest">
              {PHOTOS.indexOf(activePhoto) + 1} / {PHOTOS.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
