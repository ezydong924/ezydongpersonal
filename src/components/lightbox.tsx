"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import type { Photo } from "@/lib/photos";

interface LightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  const photo = photos[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      style={{ overscrollBehavior: "contain" }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors z-10"
        aria-label="关闭"
      >
        <CloseIcon />
      </button>

      <button
        onClick={goPrev}
        className="absolute left-4 p-2 text-white/60 hover:text-white transition-colors z-10"
        aria-label="上一张"
      >
        <ChevronLeftIcon />
      </button>

      <div className="relative max-w-[90vw] max-h-[85vh]">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
          sizes="90vw"
          priority
        />
        <p className="text-center text-white/50 text-sm mt-4">
          {photo.alt} · {photo.series} · {index + 1} / {photos.length}
        </p>
      </div>

      <button
        onClick={goNext}
        className="absolute right-4 p-2 text-white/60 hover:text-white transition-colors z-10"
        aria-label="下一张"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}
