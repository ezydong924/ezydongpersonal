"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import ShaderBackground from "@/components/shader-background";

const revealEase = [0.16, 1, 0.3, 1] as const;

export default function HomePage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#070908]">
      <ShaderBackground />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(3,5,5,0.03)_0%,rgba(3,5,5,0.12)_48%,rgba(3,5,5,0.56)_100%)]" />
      <div className="home-grain pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 flex min-h-[100svh] flex-col px-5 py-5 sm:px-8 sm:py-7 lg:px-12 lg:py-9">
        <header className="flex items-start justify-between border-t border-white/25 pt-3">
          <p className="text-[10px] font-medium uppercase text-white/55 sm:text-[11px]">
            Shadow
          </p>
          <p className="text-[10px] font-medium text-white/55 sm:text-[11px]">
            by EZYDong
          </p>
        </header>

        <main className="mt-auto w-full pb-1 sm:pb-2">
          <div className="overflow-hidden pb-2 sm:pb-3">
            <motion.h1
              className="text-[clamp(5.25rem,16vw,13rem)] font-light leading-[0.78] text-[#f1f0eb]"
              style={{ fontFamily: "var(--font-serif)" }}
              initial={reduceMotion ? false : { y: "108%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.05, delay: 0.1, ease: revealEase }}
            >
              影岑
            </motion.h1>
          </div>

          <div className="mt-5 grid gap-7 border-t border-white/25 pt-4 sm:mt-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-10 sm:pt-5">
            <p className="max-w-md text-xs font-light leading-6 text-white/62 sm:text-sm">
              光是时间的拓印，暗处藏着未曾言说的记忆
            </p>

            <Link
              href="/explore"
              className="group inline-flex w-fit items-center gap-8 border-b border-white/45 pb-2 text-xs font-medium uppercase text-white transition-colors duration-300 hover:border-white hover:text-white/75 sm:text-sm"
            >
              Explore
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
