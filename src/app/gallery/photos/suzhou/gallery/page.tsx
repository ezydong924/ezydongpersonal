"use client";

import { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import BackButton from "@/components/back-button";
import { musicStore } from "@/lib/music-store";
import VerticalImageStack from "@/components/vertical-image-stack";
import MountainParallaxBg from "@/components/mountain-parallax-bg";

const photos = [
  "IMG20250403204755.jpg",
  "IMG20250404093514.jpg",
  "IMG20250404164455.jpg",
  "IMG20250404194917.jpg",
  "IMG20250404210021.jpg",
  "IMG20250404214623.jpg",
  "IMG20250405102500.jpg",
  "IMG20250405115858.jpg",
  "IMG20250405183216.jpg",
  "IMG_20250404_093300.jpg",
  "IMG_20250404_182545.jpg",
  "IMG_20250405_192956.jpg",
  "IMG_20250405_193104.jpg",
  "IMG_20250405_193937.jpg",
  "IMG_20250414_213055.jpg",
  "IMG_20250424_213742.jpg",
  "IMG_20250424_214459.jpg",
  "IMG_20250604_225040.jpg",
  "IMG_20250615_134207.jpg",
  "retouch_2025040417595632.jpg",
  "retouch_2025040418005980.jpg",
  "retouch_2025040418065260.jpg",
  "retouch_2025040418084837.jpg",
  "retouch_2025040418182106.jpg",
  "retouch_2025040418252278.jpg",
  "retouch_2025040512220051.jpg",
  "retouch_2025040519220866.jpg",
];

const images = photos.map((p, i) => ({
  id: i,
  src: `/suzhou/lightbox/${p}`,
  alt: "",
}));

export default function SuzhouGallery() {
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    setMusicPlaying(musicStore.isPlaying);
    musicStore.acquire();
    const unsub = musicStore.subscribe(() => setMusicPlaying(musicStore.isPlaying));
    return () => { unsub(); musicStore.release(); };
  }, []);

  return (
    <div className="relative min-h-screen">
      <MountainParallaxBg />
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery/photos/suzhou" label="返回" />
      </div>
      <button
        onClick={() => musicStore.togglePlay()}
        className="fixed top-8 right-8 z-50 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300"
      >
        {musicPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <VerticalImageStack
        images={images}
        lightboxBasePath="/suzhou/lightbox"
        lightboxPhotos={photos}
      />
    </div>
  );
}
