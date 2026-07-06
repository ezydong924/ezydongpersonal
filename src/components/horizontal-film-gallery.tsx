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
  const [vw, setVw] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number>(0);
  const dragging = useRef(false);
  const moved = useRef(false);

  useEffect(() => {
    // Real viewport width is only known client-side, after mount; `vw`
    // starts at a reasonable desktop default for the static-exported markup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVw(window.innerWidth);
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pendingWrap = useRef<number>(0); // 0=none, -1=waiting left wrap, 1=waiting right wrap

  const navigate = useCallback(
    (dir: number) => {
      setActive((prev) => {
        const atStart = prev === 0 && dir < 0;
        const atEnd = prev === photos.length - 1 && dir > 0;

        if (atStart || atEnd) {
          if (pendingWrap.current === dir) {
            pendingWrap.current = 0;
            return atStart ? photos.length - 1 : 0;
          }
          pendingWrap.current = dir;
          return prev;
        }

        pendingWrap.current = 0;
        return prev + dir;
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
      if (e.key === "ArrowLeft") { e.preventDefault(); navigate(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); navigate(1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      dragging.current = true;
      moved.current = false;
      const p = "touches" in e ? e.touches[0] : e;
      dragStart.current = p.clientX;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const p = "touches" in e ? e.touches[0] : e;
      if (Math.abs(p.clientX - dragStart.current) > 30) moved.current = true;
    };
    const onUp = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current || !moved.current) { dragging.current = false; return; }
      dragging.current = false;
      const p = "changedTouches" in e ? e.changedTouches[0] : e;
      navigate(p.clientX < dragStart.current ? 1 : -1);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [navigate]);

  const GAP = 8;
  const SMALL_W = 60;
  const MID_W = 120;
  const BIG_W = 400;
  const BIG_H = 420;

  return (
    <div className="relative w-full h-screen bg-[#0a0a0c] overflow-hidden select-none" ref={containerRef}>
      <div className="absolute top-32 left-0 right-0 text-center pointer-events-none z-10">
        <p className="text-white/30 text-xs tracking-[0.3em]">滚轮切换 · 点击放大 · 方向键浏览</p>
      </div>

      <div className="absolute inset-0 flex items-center overflow-hidden">
        <motion.div
          className="flex items-center gap-2 h-[420px]"
          animate={{
            x: vw / 2 - BIG_W / 2 - active * (SMALL_W + GAP) - (active > 0 ? MID_W - SMALL_W : 0),
          }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
        >
          {photos.map((photo, i) => {
            const dist = Math.min(Math.abs(i - active), photos.length - Math.abs(i - active));
            const isActive = dist === 0;
            const isNear = dist <= 1;

            return (
              <motion.div
                key={photo.file}
                onClick={() => setLightbox(i)}
                className="relative shrink-0 cursor-pointer rounded-xl overflow-hidden border-2"
                animate={{
                  width: isActive ? BIG_W : isNear ? MID_W : SMALL_W,
                  height: isActive ? BIG_H : isNear ? 320 : 240,
                  borderColor: isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.04)",
                  boxShadow: isActive
                    ? "0 24px 80px rgba(0,0,0,0.6)"
                    : "0 4px 16px rgba(0,0,0,0.2)",
                }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <img
                  src={`${basePath}/${photo.file}`}
                  alt={photo.title || `影笺 第 ${i + 1} 张`}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
                {isActive && (
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/25 text-xs tracking-[0.2em] pointer-events-none">
        {active + 1} / {photos.length}
      </div>

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
              aria-label="关闭大图"
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
