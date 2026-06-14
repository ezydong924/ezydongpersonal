"use client";

import { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import BackButton from "@/components/back-button";
import { musicStore } from "@/lib/music-store";

const photos = [
  "IMG20241002065810.jpg",
  "IMG20241002084619.jpg",
  "IMG20241002084827.jpg",
  "IMG20241002170444.jpg",
  "IMG20241003112218.jpg",
  "IMG20241003172218.jpg",
  "IMG20241004120604.jpg",
  "IMG20241004141706.jpg",
  "IMG20241004172410.jpg",
  "IMG20241005052236.jpg",
  "IMG_20241002_055802.jpg",
  "IMG_20241002_181059.jpg",
  "IMG_20241003_155732.jpg",
  "IMG_20241003_174703.jpg",
  "IMG_20241003_180052.jpg",
  "IMG_20241003_180550.jpg",
  "IMG_20241003_180819.jpg",
  "IMG_20241003_182339.jpg",
  "IMG_20241004_155743.jpg",
  "IMG_20241004_160406.jpg",
  "IMG_20241004_160441.jpg",
  "IMG_20241004_160532.jpg",
  "IMG_20241004_221103.jpg",
  "IMG_20241004_223527.jpg",
  "IMG_20241014_182423.jpg",
  "IMG_20241023_173252.jpg",
];

export default function WeihaiGallery() {
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    setMusicPlaying(musicStore.isPlaying);
    musicStore.acquire();
    const unsub = musicStore.subscribe(() => setMusicPlaying(musicStore.isPlaying));
    return () => { unsub(); musicStore.release(); };
  }, []);

  return (
    <div className="relative h-screen bg-[#0a0a0c]">
      <div className="fixed top-8 left-8 z-50"><BackButton href="/gallery/photos/weihai" label="返回" /></div>
      <button onClick={() => musicStore.togglePlay()} className="fixed top-8 right-8 z-50 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300">
        {musicPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div className="flex items-center justify-center h-full text-white/25 text-sm tracking-[0.2em]">暂无照片</div>
    </div>
  );
}
