"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ShaderBackground from "@/components/shader-background";
import AnimatedText from "@/components/animated-text";

export default function HomePage() {
  return (
    <>
      <ShaderBackground />
      <div className="fixed inset-0 bg-black/[0.07] pointer-events-none z-0" />
      <div className="relative z-10 min-h-screen">
        <main className="absolute bottom-12 left-12 right-12 max-w-3xl">
          <motion.div className="text-left leading-[0.85] tracking-tight">
            <motion.span className="block text-[5rem] sm:text-[7rem] lg:text-[9rem] font-semibold text-white tracking-[-0.02em] mb-6">
              影岑
            </motion.span>

            <AnimatedText
              text="Shadow"
              className="block text-[5rem] sm:text-[7rem] lg:text-[9rem] font-black text-white tracking-[-0.04em] drop-shadow-2xl text-left"
            />
          </motion.div>

          <motion.p
            className="mt-10 text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            光是时间的拓印，暗处藏着未曾言说的记忆
          </motion.p>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/explore" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white font-medium text-sm hover:bg-white/25 hover:border-white/50 transition-all duration-300">
              Explore
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </main>
      </div>
    </>
  );
}
