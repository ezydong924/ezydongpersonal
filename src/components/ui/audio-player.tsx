"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { musicStore } from "@/lib/music-store";

type Track = { src: string; cover?: string; title?: string };

const formatTime = (seconds: number = 0) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSlider = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) => {
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const calcPct = (clientX: number) => {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const x = clientX - rect.left;
    return Math.min(Math.max((x / rect.width) * 100, 0), 100);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    onChange(calcPct(e.clientX));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (sliderRef.current?.hasPointerCapture(e.pointerId)) {
      onChange(calcPct(e.clientX));
    }
  };

  return (
    <motion.div
      ref={sliderRef}
      className={cn(
        "relative w-full h-1 bg-white/20 rounded-full cursor-pointer touch-none",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <motion.div
        className="absolute top-0 left-0 h-full bg-white rounded-full"
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );
};

function useMusicState() {
  const [state, setState] = useState({
    isPlaying: false,
    isMuted: false,
    currentTrack: null as Track | null,
    index: 0,
  });
  useEffect(() => {
    const update = () => setState({
      isPlaying: musicStore.isPlaying,
      isMuted: musicStore.isMuted,
      currentTrack: musicStore.currentTrack ?? null,
      index: musicStore.index,
    });
    update();
    return musicStore.subscribe(update);
  }, []);
  return state;
}

const AudioPlayer = ({
  playlist,
  muted,
  onMutedChange,
}: {
  src?: string;
  cover?: string;
  title?: string;
  playlist?: Track[];
  muted?: boolean;
  onMutedChange?: (muted: boolean) => void;
}) => {
  const tracks: Track[] = playlist ?? [];
  const { isPlaying, isMuted, currentTrack, index } = useMusicState();
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const track = currentTrack ?? tracks[0];

  useEffect(() => {
    if (tracks.length > 0) musicStore.init(tracks);
    musicStore.acquire();
    return () => musicStore.release();
  }, []);

  useEffect(() => {
    if (onMutedChange) onMutedChange(isMuted);
  }, [isMuted, onMutedChange]);

  useEffect(() => {
    if (typeof muted === "boolean" && muted !== isMuted) {
      musicStore.toggleMute();
    }
  }, [muted]);

  useEffect(() => {
    const audio = musicStore.audioEl;
    if (!audio) return;
    const onTime = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isFinite(p) ? p : 0);
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };
    audio.addEventListener("timeupdate", onTime);
    return () => audio.removeEventListener("timeupdate", onTime);
  }, []);

  const handleSeek = (value: number) => {
    const audio = musicStore.audioEl;
    if (audio && audio.duration) {
      const time = (value / 100) * audio.duration;
      if (isFinite(time)) {
        audio.currentTime = time;
        setProgress(value);
      }
    }
  };

  if (!track) return null;

  return (
    <motion.div
      className="relative flex flex-col mx-auto rounded-3xl overflow-hidden bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm p-3 w-[280px] h-auto"
      layout
    >
      <motion.div className="flex flex-col relative" layout>
        {track.cover && (
          <motion.div
            className="bg-white/20 overflow-hidden rounded-[16px] h-[180px] w-full relative"
            key={`cover-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={track.cover}
              alt="cover"
              className="!object-cover w-full my-0 p-0 !mt-0 border-none !h-full"
            />
          </motion.div>
        )}

        <motion.div className="flex flex-col w-full gap-y-2">
          {track.title && (
            <motion.h3
              className="text-white font-bold text-base text-center mt-1"
              key={`title-${index}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {track.title}
            </motion.h3>
          )}

          <motion.div className="flex flex-col gap-y-1">
            <CustomSlider value={progress} onChange={handleSeek} className="w-full" />
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">{formatTime(currentTime)}</span>
              <span className="text-white text-sm">{formatTime(duration)}</span>
            </div>
          </motion.div>

          <motion.div className="flex items-center justify-center w-full">
            <div className="flex items-center gap-2 w-fit bg-[#11111198] rounded-[16px] p-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); setIsShuffle(!isShuffle); }}
                  className={cn(
                    "text-white hover:bg-[#111111d1] hover:text-white h-8 w-8 rounded-full",
                    isShuffle && "bg-[#111111d1] text-white"
                  )}
                >
                  <Shuffle className="h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); musicStore.prev(); }}
                  className="text-white hover:bg-[#111111d1] hover:text-white h-8 w-8 rounded-full"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={(e) => { e.stopPropagation(); musicStore.togglePlay(); }}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-[#111111d1] hover:text-white h-8 w-8 rounded-full"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); musicStore.next(); }}
                  className="text-white hover:bg-[#111111d1] hover:text-white h-8 w-8 rounded-full"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); setIsRepeat(!isRepeat); }}
                  className={cn(
                    "text-white hover:bg-[#111111d1] hover:text-white h-8 w-8 rounded-full",
                    isRepeat && "bg-[#111111d1] text-white"
                  )}
                >
                  <Repeat className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AudioPlayer