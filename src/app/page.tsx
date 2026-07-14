"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import ShaderBackground from "@/components/shader-background";

const ease = [0.16, 1, 0.3, 1] as const;

export default function HomePage() {
  return (
    <>
      <ShaderBackground />
      <div className="fixed inset-0 z-0 pointer-events-none bg-black/20" />
      <div className="relative z-10 flex min-h-[100svh] flex-col px-5 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <header className="flex items-start justify-between border-t border-white/35 pt-3">
          <p className="text-[10px] font-medium text-white/70 sm:text-xs">SHADOW</p>
          <div className="text-right">
            <p className="text-[10px] font-medium text-white sm:text-xs">EZYDONG</p>
            <span className="mt-1 block text-[9px] text-white/55 sm:text-[10px]">PHOTOGRAPHY</span>
          </div>
        </header>

        <main className="grid min-h-0 flex-1 grid-rows-[1fr_auto]">
          <div className="flex items-center pt-10 sm:pt-14">
            <motion.h1
              className="text-left leading-[0.8] text-white"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
            >
              <span className="block text-[clamp(5.5rem,13vw,12rem)] font-semibold">影岑</span>
              <span
                className="mt-5 block text-[clamp(2.25rem,5.4vw,5.5rem)] font-light text-white/90"
                style={{ fontFamily: "Georgia, var(--font-serif)" }}
              >
                Shadow
              </span>
            </motion.h1>
          </div>

          <motion.div
            className="flex items-end justify-between border-t border-white/35 pt-4 sm:pt-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
          >
            <div className="pb-1">
              <span className="block h-px w-10 bg-white/60" />
            </div>

            <Link
              href="/explore"
              className="group flex h-28 w-28 flex-col justify-between bg-[#f5f5f0] p-3 text-black transition-transform duration-300 hover:-translate-y-1 sm:h-36 sm:w-36 sm:p-4"
            >
              <span className="text-xs font-semibold sm:text-sm">Explore</span>
              <ArrowUpRight
                aria-hidden="true"
                className="h-5 w-5 self-end transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:h-6 sm:w-6"
                strokeWidth={1.5}
              />
            </Link>
          </motion.div>
        </main>
      </div>
    </>
  );
}
