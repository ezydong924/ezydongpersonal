"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSlider = ({ value, onChange, className }: { value: number; onChange: (value: number) => void; className?: string }) => {
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const calcPct = (clientX: number) => { const rect = sliderRef.current?.getBoundingClientRect(); if (!rect) return 0; return Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100); };
  return (
    <motion.div ref={sliderRef} className={cn("relative w-full h-1 bg-white/20 rounded-full cursor-pointer touch-none", className)}
      onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); onChange(calcPct(e.clientX)); }}
      onPointerMove={(e) => { if (sliderRef.current?.hasPointerCapture(e.pointerId)) { e.stopPropagation(); onChange(calcPct(e.clientX)); } }}
      onClick={(e) => e.stopPropagation()}>
      <motion.div className="absolute top-0 left-0 h-full bg-white rounded-full" style={{ width: `${value}%` }} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
    </motion.div>
  );
};

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => { if (videoRef.current) { if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); } setIsPlaying(!isPlaying); } };
  const handleVolumeChange = (v: number) => { if (videoRef.current) { const nv = v / 100; videoRef.current.volume = nv; setVolume(nv); setIsMuted(nv === 0); } };
  const handleTimeUpdate = () => { if (videoRef.current) { const p = (videoRef.current.currentTime / videoRef.current.duration) * 100; setProgress(isFinite(p) ? p : 0); setCurrentTime(videoRef.current.currentTime); setDuration(videoRef.current.duration); } };
  const handleSeek = (v: number) => { if (videoRef.current && videoRef.current.duration) { const t = (v / 100) * videoRef.current.duration; if (isFinite(t)) { videoRef.current.currentTime = t; setProgress(v); } } };
  const toggleMute = () => { if (videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted); if (!isMuted) { setVolume(0); } else { setVolume(1); videoRef.current.volume = 1; } } };
  const setSpeed = (s: number) => { if (videoRef.current) { videoRef.current.playbackRate = s; setPlaybackSpeed(s); } };

  return (
    <motion.div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)} onTouchStart={() => setShowControls(true)}>
      <video ref={videoRef} className="w-full" onTimeUpdate={handleTimeUpdate} src={src} onClick={() => setShowControls(true)} />
      <AnimatePresence>
        {showControls && (
          <motion.div className="absolute bottom-0 mx-auto max-w-xl left-0 right-0 p-4 m-2 bg-[#11111198] backdrop-blur-md rounded-2xl" initial={{ y: 20, opacity: 0, filter: "blur(10px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: 20, opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.6, ease: "circInOut", type: "spring" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white text-sm">{formatTime(currentTime)}</span>
              <CustomSlider value={progress} onChange={handleSeek} className="flex-1" />
              <span className="text-white text-sm">{formatTime(duration)}</span>
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
                  <div className="w-24"><CustomSlider value={volume * 100} onChange={handleVolumeChange} /></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {[0.5, 1, 1.5, 2].map((s) => (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} key={s}>
                    <Button onClick={() => setSpeed(s)} variant="ghost" size="icon" className={cn("text-white hover:bg-white/10 hover:text-white", playbackSpeed === s && "bg-white/10")}>{s}x</Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoPlayer