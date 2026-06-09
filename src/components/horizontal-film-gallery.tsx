"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Photo = { file: string; title: string };

interface HorizontalFilmGalleryProps {
  photos: Photo[];
  basePath: string;
}

export default function HorizontalFilmGallery({ photos, basePath }: HorizontalFilmGalleryProps) {
  const [active, setActive] = useState<number>(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    photos.forEach((_, i) => {
      timers.push(setTimeout(() => setLoaded((prev) => [...prev, i]), i * 120));
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useCallback(
    (dir: number) => {
      setActive((prev) => {
        const next = prev + dir;
        if (next < 0) return photos.length - 1;
        if (next >= photos.length) return 0;
        return next;
      });
    },
    [photos.length]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      navigate(e.deltaY > 0 ? 1 : -1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div className="relative w-full h-screen bg-[#0a0a0c] overflow-hidden select-none" ref={containerRef}>
      {/* Hint */}
      <div className="absolute top-32 left-0 right-0 text-center pointer-events-none z-10">
        <p className="text-white/30 text-xs tracking-[0.3em]">滚轮切换 · 点击放大 · 方向键浏览</p>
      </div>

      {/* Film strip */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-3 px-6 h-[420px] w-full max-w-[960px]">
          {photos.map((photo, i) => {
            const isActive = i === active;
            const visible = loaded.includes(i);
            const distance = Math.abs(i - active);
            const wrapDistance = Math.min(distance, photos.length - distance);

            return (
              <motion.div
                key={photo.file}
                onClick={() => setLightbox(i)}
                className="relative overflow-hidden rounded-xl cursor-pointer shrink-0 border-2 transition-colors duration-700"
                style={{
                  borderColor: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.08)",
                  boxShadow: isActive
                    ? "0 20px 60px rgba(0,0,0,0.55)"
                    : "0 8px 24px rgba(0,0,0,0.3)",
                  background: "#18181b",
                  opacity: visible ? 1 : 0,
                }}
                animate={{
                  width: isActive ? "55%" : wrapDistance <= 2 ? "12%" : "6%",
                  minWidth: isActive ? 320 : wrapDistance <= 2 ? 100 : 50,
                }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <img
                  src={`${basePath}/${photo.file}`}
                  alt={photo.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
                <div
                  className="absolute inset-x-0 bottom-0 pointer-events-none transition-opacity duration-700"
                  style={{
                    height: "120px",
                    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                    opacity: isActive ? 1 : 0,
                  }}
                />
                <div
                  className="absolute left-4 bottom-4 transition-all duration-700"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(10px)",
                  }}
                >
                  <p className="text-white/90 text-sm font-medium">{photo.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Counter */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/25 text-xs tracking-[0.2em] pointer-events-none">
        {active + 1} / {photos.length}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white/70 hover:text-white hover:bg-white/20 transition-all z-10"
              onClick={() => setLightbox(null)}
            >
              <X size={20} />
            </button>
            <motion.img
              src={`${basePath}/${photos[lightbox].file}`}
              alt=""
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-8 text-white/45 text-sm tracking-widest">
              {lightbox + 1} / {photos.length} · 点击或 ESC 退出
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
