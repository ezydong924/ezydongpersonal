"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/components/back-button";

const cards = [
  { id: 0, front: "📷", back: "还没拍" },
  { id: 1, front: "🎞️", back: "胶片用完了" },
  { id: 2, front: "🖼️", back: "在冲扫" },
  { id: 3, front: "✨", back: "等待灵感" },
  { id: 4, front: "🌙", back: "下次一定" },
  { id: 5, front: "💤", back: "摄影师睡着了" },
];

const excuses = [
  "记忆卡满了...",
  "镜头盖忘摘了...",
  "这张拍糊了，真的",
  "好看的照片都在相机里",
  "其实我拍了，但SD卡坏了",
  "这些空白都是留白艺术",
  "最好的照片永远是下一张",
];

export default function PhotosPage() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [clicks, setClicks] = useState(0);
  const [excuse, setExcuse] = useState(excuses[0]);

  const toggle = (id: number) => {
    if (!flipped.has(id)) {
      setFlipped((prev) => new Set(prev).add(id));
      const newClicks = clicks + 1;
      setClicks(newClicks);
      setExcuse(excuses[newClicks % excuses.length]);
    }
  };

  const allFlipped = flipped.size === cards.length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <BackButton href="/gallery" label="返回" />

      <h1 className="text-4xl font-light tracking-wide text-white/90 mt-8 mb-2">
        影笺
      </h1>
      <p className="text-white/40 text-lg font-light mb-4">
        Photography
      </p>

      <AnimatePresence mode="wait">
        {!allFlipped ? (
          <motion.div key="grid" exit={{ opacity: 0, scale: 0.95 }}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
              {cards.map((card) => (
                <motion.button
                  key={card.id}
                  onClick={() => toggle(card.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative aspect-[3/4] rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-center text-4xl transition-all duration-500 ${
                    flipped.has(card.id)
                      ? "bg-white/[0.06] border-white/20"
                      : "bg-white/[0.03] cursor-pointer hover:bg-white/[0.08]"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={flipped.has(card.id) ? "back" : "front"}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute"
                    >
                      {flipped.has(card.id) ? (
                        <span className="text-white/40 text-sm font-light">
                          {card.back}
                        </span>
                      ) : (
                        card.front
                      )}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
            <p className="text-center text-white/20 text-sm mt-8">{excuse}</p>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className="text-white/60 text-2xl font-light">
              好吧，你都翻完了。
            </p>
            <p className="text-white/40 text-base mt-4">
              其实这些不是我最好的作品。
            </p>
            <p className="text-white/30 text-sm mt-2">
              最好的那张，永远在取景器里。
            </p>
            <button
              onClick={() => {
                setFlipped(new Set());
                setClicks(0);
                setExcuse(excuses[0]);
              }}
              className="mt-8 px-5 py-2 rounded-full bg-white/10 border border-white/15 text-white/50 text-sm hover:bg-white/20 transition-colors"
            >
              再来一次
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
