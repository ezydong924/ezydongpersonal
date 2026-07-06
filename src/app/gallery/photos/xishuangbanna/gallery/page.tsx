"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import BackButton from "@/components/back-button";
import { MasonryGrid } from "@/components/masonry-grid";

const photos = [
  "IMG20260130181112.jpg",
  "IMG_20260127_182934.jpg",
  "IMG20260128141217.jpg",
  "IMG20260128141505.jpg",
  "IMG20260127194945.jpg",
  "IMG20260128144709.jpg",
  "IMG20260129171048.jpg",
  "IMG20260127200856.jpg",
  "IMG20260129182308.jpg",
];

export default function XishuangbannaGallery() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      else if (e.key === "ArrowRight") setActive((p) => (p === null ? p : (p + 1) % photos.length));
      else if (e.key === "ArrowLeft") setActive((p) => (p === null ? p : (p - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0c]">
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery/photos/xishuangbanna" label="返回" />
      </div>
      <div className="pt-24 pb-16 px-4 md:px-8">
        <MasonryGrid columns={3} gap={4}>
          {photos.map((photo, i) => (
            <motion.div
              key={photo}
              className="cursor-pointer overflow-hidden rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActive(i)}
            >
              <img
                src={`/xishuangbanna/lightbox/${photo}`}
                alt=""
                className="w-full h-auto block"
                loading="lazy"
              />
            </motion.div>
          ))}
        </MasonryGrid>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              aria-label="关闭大图"
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 text-white/70 hover:text-white hover:bg-white/20 transition-all z-10"
              onClick={() => setActive(null)}
            >
              <X size={20} />
            </button>
            <motion.img
              src={`/xishuangbanna/lightbox/${photos[active]}`}
              alt=""
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-8 text-white/45 text-sm tracking-widest">
              {active + 1} / {photos.length} · 点击或 ESC 退出
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
