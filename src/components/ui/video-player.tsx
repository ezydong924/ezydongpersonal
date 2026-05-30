"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const CustomSlider = ({ value, onChange, className }: { value: number; onChange: (value: number) => void; className?: string }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const pct = (cx: number) => { const r = ref.current?.getBoundingClientRect(); if (!r) return 0; return Math.min(Math.max(((cx - r.left) / r.width) * 100, 0), 100); };
  return (
    <motion.div ref={ref} className={cn("relative w-full h-1 bg-white/20 rounded-full cursor-pointer touch-none", className)}
      onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); onChange(pct(e.clientX)); }}
      onPointerMove={(e) => { if (ref.current?.hasPointerCapture(e.pointerId)) { e.stopPropagation(); onChange(pct(e.clientX)); } }}
      onClick={(e) => e.stopPropagation()}>
      <motion.div className="absolute top-0 left-0 h-full bg-white rounded-full" style={{ width: `${value}%` }} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
    </motion.div>
  );
};

export default function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [show, setShow] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const seekingRef = useRef(false);

  const togglePlay = () => { const v = videoRef.current; if (!v) return; if (isPlaying) { v.pause(); } else { v.play(); } setIsPlaying(!isPlaying); };
  const handleSeek = (val: number) => {
    const v = videoRef.current;
    if (!v?.duration) return;
    seekingRef.current = true;
    const t = (val / 100) * v.duration;
    if (isFinite(t)) { v.currentTime = t; setProgress(val); }
    setTimeout(() => { seekingRef.current = false; }, 300);
  };
  const toggleMute = () => { const v = videoRef.current; if (!v) return; v.muted = !isMuted; setIsMuted(!isMuted); if (!isMuted) { setVolume(0); } else { setVolume(1); v.volume = 1; } };

  return (
    <motion.div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onTouchStart={() => setShow(true)}>
      <video ref={videoRef} className="w-full" src={src} playsInline webkit-playsinline="true"
        onTimeUpdate={() => { const v = videoRef.current; if (!v || seekingRef.current) return; const p = (v.currentTime / v.duration) * 100; setProgress(isFinite(p) ? p : 0); setCur(v.currentTime); setDur(v.duration); }}
        onClick={() => setShow(true)} />
      <AnimatePresence>
        {show && (
          <motion.div className="absolute bottom-0 mx-auto max-w-xl left-0 right-0 p-4 m-2 bg-[#11111198] backdrop-blur-md rounded-2xl"
            initial={{ y: 20, opacity: 0, filter: "blur(10px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: 20, opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white text-sm">{formatTime(cur)}</span>
              <CustomSlider value={progress} onChange={handleSeek} className="flex-1" />
              <span className="text-white text-sm">{formatTime(dur)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button onClick={togglePlay} variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                </motion.div>
                <div className="flex items-center gap-x-1">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button onClick={toggleMute} variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                      {isMuted ? <VolumeX className="h-5 w-5" /> : volume > 0.5 ? <Volume2 className="h-5 w-5" /> : <Volume1 className="h-5 w-5" />}
                    </Button>
                  </motion.div>
                  <div className="w-24"><CustomSlider value={volume * 100} onChange={(v) => { const nv = v / 100; if (videoRef.current) videoRef.current.volume = nv; setVolume(nv); setIsMuted(nv === 0); }} /></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {[0.5, 1, 1.5, 2].map((s) => (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} key={s}>
                    <Button onClick={() => { if (videoRef.current) videoRef.current.playbackRate = s; setSpeed(s); }} variant="ghost" size="icon" className={cn("text-white hover:bg-white/10 hover:text-white", speed === s && "bg-white/10")}>{s}x</Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
