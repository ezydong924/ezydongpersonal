"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, type PanInfo, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type ImageItem = { id: number; src: string; alt: string };

interface VerticalImageStackProps {
  images: ImageItem[];
  lightboxBasePath?: string;
  lightboxPhotos?: string[];
}

export default function VerticalImageStack({
  images,
  lightboxBasePath,
  lightboxPhotos,
}: VerticalImageStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const lastNavigationTime = useRef(0);
  const navigationCooldown = 400;

  const navigate = useCallback(
    (newDirection: number) => {
      const now = Date.now();
      if (now - lastNavigationTime.current < navigationCooldown) return;
      lastNavigationTime.current = now;
      setCurrentIndex((prev) => {
        if (newDirection > 0) {
          return prev === images.length - 1 ? 0 : prev + 1;
        }
        return prev === 0 ? images.length - 1 : prev - 1;
      });
    },
    [images.length]
  );

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold) {
      navigate(1);
    } else if (info.offset.y > threshold) {
      navigate(-1);
    }
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0) navigate(1);
        else navigate(-1);
      }
    },
    [navigate]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowDown") navigate(1);
      if (e.key === "ArrowUp") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const getCardStyle = (index: number) => {
    const total = images.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    if (diff === 0) return { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 };
    if (diff === -1) return { y: -160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: 8 };
    if (diff === -2) return { y: -280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: 15 };
    if (diff === 1) return { y: 160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: -8 };
    if (diff === 2) return { y: 280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: -15 };
    return { y: diff > 0 ? 400 : -400, scale: 0.6, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -20 : 20 };
  };

  const isVisible = (index: number) => {
    const total = images.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.abs(diff) <= 2;
  };

  const lightboxPhoto = lightbox !== null && lightboxPhotos ? lightboxPhotos[lightbox] : null;

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className="relative flex h-[500px] w-[320px] items-center justify-center" style={{ perspective: "1200px" }}>
        {images.map((image, index) => {
          if (!isVisible(index)) return null;
          const style = getCardStyle(index);
          const isCurrent = index === currentIndex;
          return (
            <motion.div
              key={image.id}
              className="absolute cursor-grab active:cursor-grabbing"
              animate={{
                y: style.y, scale: style.scale, opacity: style.opacity,
                rotateX: style.rotateX, zIndex: style.zIndex,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
              drag={isCurrent ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{ transformStyle: "preserve-3d", zIndex: style.zIndex }}
              onClick={() => setLightbox(index)}
            >
              <div
                className="relative h-[420px] w-[280px] overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ring-white/[0.06]"
                style={{
                  boxShadow: isCurrent
                    ? "0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)"
                    : "0 10px 30px -10px rgba(0,0,0,0.3)",
                }}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 via-transparent to-transparent" />
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation dots */}
      <div className="absolute right-8 top-1/2 flex -translate-y-1/2 flex-col gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => { if (index !== currentIndex) setCurrentIndex(index); }}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "h-6 bg-white" : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-light text-white tabular-nums">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <div className="my-2 h-px w-8 bg-white/20" />
          <span className="text-sm text-white/30 tabular-nums">
            {String(images.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Hint */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="flex flex-col items-center gap-2 text-white/25">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7-7 7 7" />
            </svg>
          </motion.div>
          <span className="text-xs font-medium tracking-widest uppercase">Scroll or drag</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && lightboxBasePath && lightboxPhoto && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
              src={`${lightboxBasePath}/${lightboxPhoto}`}
              alt=""
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-8 text-white/45 text-sm tracking-widest">
              {lightbox + 1} / {images.length} · 点击或 ESC 退出
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
