"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/components/back-button";
import { CameraIcon, MapPinIcon, MailIcon } from "@/components/icons";

const secrets = [
  "你找到了第一个秘密。",
  "继续点，还有呢。",
  "差不多了...",
  "好吧，这是最后一个：\n这个网站是用爱和咖啡因搭建的。",
];

export default function AboutPage() {
  const [clicks, setClicks] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  const handleCameraClick = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 5 && !showSecret) setShowSecret(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <BackButton href="/" label="首页" />

      <div className="mt-12">
        <div
          className="w-24 h-24 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-8 cursor-pointer select-none relative"
          onClick={handleCameraClick}
        >
          <CameraIcon className="w-10 h-10 text-white/30" />
          <AnimatePresence>
            {showSecret && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full"
              />
            )}
          </AnimatePresence>
        </div>

        <h1 className="text-4xl font-light tracking-wide text-white/90">
          关于我
        </h1>

        <div className="mt-10 space-y-6 text-white/60 leading-relaxed text-lg font-light">
          <p>
            我是一名摄影爱好者，热衷于用镜头捕捉生活中的光影瞬间。
            这个网站是我的个人画廊，用来存放我的摄影作品和零散的想法。
          </p>
          <p>
            我相信每一张照片背后都有一个故事，每一次按下快门都是一次与世界的对话。
          </p>
        </div>

        <AnimatePresence>
          {showSecret && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 overflow-hidden"
            >
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                <p className="text-white/40 text-sm leading-relaxed whitespace-pre-line">
                  {secrets[Math.min(clicks - 5, secrets.length - 1)]}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 space-y-4">
          <div className="flex items-center gap-3 text-white/40">
            <MapPinIcon />
            <span className="text-sm">中国</span>
          </div>
          <div className="flex items-center gap-3 text-white/40">
            <MailIcon />
            <span className="text-sm">your-email@example.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
