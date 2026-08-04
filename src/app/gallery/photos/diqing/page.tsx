"use client";

import { motion } from "framer-motion";
import { GradientBackground } from "@/components/ui/gradient-background";
import BackButton from "@/components/back-button";

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <GradientBackground colors={["hsl(230, 70%, 30%)", "hsl(45, 80%, 40%)", "hsl(260, 50%, 25%)"]} />
      <div className="fixed top-8 left-8 z-50"><BackButton href="/gallery/photos" label="返回" /></div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <h1 className="text-4xl font-light tracking-wide text-white/80">迪庆州</h1>
        <p className="text-white/30 text-sm mt-2 mb-16">藏地 · 离天堂最近</p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <span className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white/40 font-medium cursor-not-allowed select-none">
            敬请期待
          </span>
        </motion.div>
      </div>
    </div>
  );
}
