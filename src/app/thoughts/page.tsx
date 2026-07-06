"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/components/back-button";

const messages = [
  "别点了！",
  "我说了别点了！！",
  "你好执着啊...",
  "好吧你赢了",
  "其实我什么都没写",
  "但这不代表我没有想法",
  "只是...还没想好怎么说",
  "也许最好的想法，就是空白本身。",
];

export default function ThoughtsPage() {
  const [escapes, setEscapes] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const flee = useCallback(() => {
    if (!containerRef.current || revealed) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const newX = Math.random() * (cw - 120);
    const newY = Math.random() * (ch - 40);
    setPos({ x: newX, y: newY });
    setEscapes((e) => {
      if (e + 1 >= messages.length - 1) {
        setRevealed(true);
      }
      return e + 1;
    });
  }, [revealed]);

  const handleMouseNear = useCallback(
    (e: React.MouseEvent) => {
      if (!btnRef.current || revealed) return;
      const rect = btnRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
      if (dist < 120) flee();
    },
    [flee, revealed],
  );

  useEffect(() => {
    if (escapes > 0 && !revealed) {
      const t = setTimeout(flee, 2500 + Math.random() * 2000);
      return () => clearTimeout(t);
    }
  }, [escapes, flee, revealed]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <BackButton href="/" label="首页" />
      <h1 className="text-4xl font-light tracking-wide text-white/90 mt-8 mb-2">想法</h1>
      <p className="text-white/40 text-lg font-light mb-8">文字与思考</p>

      <div
        ref={containerRef}
        className="relative h-[50vh] flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseNear}
      >
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.button
              ref={btnRef}
              key="btn"
              initial={{ opacity: 0, x: "-50%", y: "-50%" }}
              animate={{
                opacity: 1,
                left: pos ? `${pos.x}px` : "50%",
                top: pos ? `${pos.y}px` : "50%",
                x: "-50%",
                y: "-50%",
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              onClick={flee}
              className="absolute px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 font-medium text-sm hover:bg-white/20 transition-colors select-none"
            >
              {escapes === 0 ? "点我看看" : messages[Math.min(escapes - 1, messages.length - 1)]}
            </motion.button>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p className="text-white/50 text-2xl font-light leading-relaxed">
                {messages[messages.length - 1]}
              </p>
              <p className="text-white/30 text-sm mt-6">
                我承认，这个页面确实还没做。
              </p>
              <p className="text-white/20 text-xs mt-2">
                ——但你得承认，你刚才追得很开心。
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
