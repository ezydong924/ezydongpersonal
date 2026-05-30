"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Volume1, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const fmt = (s: number) => { const m = Math.floor(s / 60); const r = Math.floor(s % 60); return `${m}:${r.toString().padStart(2, "0")}`; };

const Range = ({ value, onChange, className }: { value: number; onChange: (v: number) => void; className?: string }) => (
  <input type="range" min={0} max={100} value={Math.round(value)} onChange={(e) => onChange(Number(e.target.value))}
    className={cn("w-full h-1 appearance-none bg-white/20 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white", className)}
    style={{ accentColor: 'white' }} />
);

export default function VideoPlayer({ src }: { src: string }) {
  const vRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(1);
  const [prog, setProg] = useState(0);
  const [muted, setMuted] = useState(false);
  const [spd, setSpd] = useState(1);
  const [show, setShow] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const skRef = useRef(false);

  useEffect(() => {
    const up = () => { skRef.current = false; };
    window.addEventListener('pointerup', up);
    window.addEventListener('touchend', up);
    return () => { window.removeEventListener('pointerup', up); window.removeEventListener('touchend', up); };
  }, []);

  const seek = (val: number) => {
    const v = vRef.current;
    if (!v?.duration) return;
    skRef.current = true;
    v.currentTime = (val / 100) * v.duration;
    setProg(val);
  };

  const toggle = () => { const v = vRef.current; if (!v) return; if (playing) v.pause(); else v.play(); setPlaying(!playing); };
  const toggleM = () => { const v = vRef.current; if (!v) return; v.muted = !muted; setMuted(!muted); if (!muted) { setVol(0); } else { setVol(1); v.volume = 1; } };

  return (
    <motion.div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onTouchStart={() => setShow(true)}>
      <video ref={vRef} className="w-full" src={src} playsInline webkit-playsinline="true"
        onTimeUpdate={() => { const v = vRef.current; if (!v || skRef.current) return; const p = (v.currentTime / v.duration) * 100; setProg(isFinite(p) ? p : 0); setCur(v.currentTime); setDur(v.duration); }}
        onClick={() => setShow(true)} />
      <AnimatePresence>{show && (
        <motion.div className="absolute bottom-0 mx-auto max-w-xl left-0 right-0 p-4 m-2 bg-[#11111198] backdrop-blur-md rounded-2xl z-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white text-sm">{fmt(cur)}</span>
            <Range value={prog} onChange={seek} className="flex-1" />
            <span className="text-white text-sm">{fmt(dur)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button onClick={toggle} variant="ghost" size="icon" className="text-white hover:bg-white/10">{playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}</Button>
              </motion.div>
              <div className="flex items-center gap-x-1">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button onClick={toggleM} variant="ghost" size="icon" className="text-white hover:bg-white/10">{muted ? <VolumeX className="h-5 w-5" /> : vol > 0.5 ? <Volume2 className="h-5 w-5" /> : <Volume1 className="h-5 w-5" />}</Button>
                </motion.div>
                <div className="w-24"><Range value={vol * 100} onChange={(v) => { const n = v / 100; if (vRef.current) vRef.current.volume = n; setVol(n); setMuted(n === 0); }} /></div>
              </div>
            </div>
            <div className="flex items-center gap-2">{[0.5,1,1.5,2].map((s) => (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} key={s}>
                <Button onClick={() => { if (vRef.current) vRef.current.playbackRate = s; setSpd(s); }} variant="ghost" size="icon" className={cn("text-white hover:bg-white/10", spd === s && "bg-white/10")}>{s}x</Button>
              </motion.div>
            ))}</div>
          </div>
        </motion.div>
      )}</AnimatePresence>
    </motion.div>
  );
}
