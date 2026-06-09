"use client";

import { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import BackButton from "@/components/back-button";
import { musicStore } from "@/lib/music-store";
import InteractiveImageBentoGallery from "@/components/interactive-bento-gallery";

const imageItems = [
  { id: 1,  title: "", desc: "", url: "/xishuangbanna/lightbox/IMG_20260127_182934.jpg", span: "" },
  { id: 2,  title: "", desc: "", url: "/xishuangbanna/lightbox/IMG20260127191803.jpg", span: "" },
  { id: 3,  title: "", desc: "", url: "/xishuangbanna/lightbox/IMG20260127194945.jpg", span: "" },
  { id: 4,  title: "", desc: "", url: "/xishuangbanna/lightbox/IMG20260127200856.jpg", span: "" },
  { id: 5,  title: "", desc: "", url: "/xishuangbanna/lightbox/IMG20260128141217.jpg", span: "" },
  { id: 6,  title: "", desc: "", url: "/xishuangbanna/lightbox/IMG20260128141505.jpg", span: "" },
  { id: 7,  title: "", desc: "", url: "/xishuangbanna/lightbox/IMG20260128144709.jpg", span: "" },
  { id: 8,  title: "", desc: "", url: "/xishuangbanna/lightbox/IMG20260129171048.jpg", span: "" },
  { id: 9,  title: "", desc: "", url: "/xishuangbanna/lightbox/IMG20260129182308.jpg", span: "" },
  { id: 10, title: "", desc: "", url: "/xishuangbanna/lightbox/IMG20260130181112.jpg", span: "" },
];

export default function XishuangbannaGallery() {
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    setMusicPlaying(musicStore.isPlaying);
    musicStore.acquire();
    const unsub = musicStore.subscribe(() => setMusicPlaying(musicStore.isPlaying));
    return () => { unsub(); musicStore.release(); };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0c]">
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery/photos/xishuangbanna" label="返回" />
      </div>
      <button
        onClick={() => musicStore.togglePlay()}
        className="fixed top-8 right-8 z-50 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300"
      >
        {musicPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <InteractiveImageBentoGallery
        imageItems={imageItems}
        title="西双版纳"
        description="影笺"
      />
    </div>
  );
}
