"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Photo } from "@/lib/photos";

const Lightbox = dynamic(() => import("@/components/lightbox"));

interface PhotoGridProps {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-white/30 text-lg">
        暂无照片，请将照片放入 public/photos/ 目录
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            className="break-inside-avoid cursor-pointer group relative rounded-xl overflow-hidden w-full p-0 border-0 bg-transparent"
            onClick={() => setLightboxIndex(index)}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
