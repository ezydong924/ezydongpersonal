"use client";

import { useState, Suspense, lazy } from "react";
import Link from "next/link";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

export default function CTASection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6">
      <div
        className="w-full max-w-4xl relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-[48px] border border-white/[0.06] bg-black/40 backdrop-blur-sm min-h-[500px] flex flex-col items-center justify-center duration-500">
          <Suspense fallback={<div className="absolute inset-0 bg-white/[0.02]" />}>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen">
              <Dithering
                colorBack="#00000000"
                colorFront="#06b6d4"
                shape="warp"
                type="4x4"
                speed={isHovered ? 0.6 : 0.2}
                className="size-full"
                minPixelRatio={1}
              />
            </div>
          </Suspense>

          <div className="relative z-10 px-6 max-w-3xl mx-auto text-center flex flex-col items-center py-16">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-1.5 text-sm font-medium text-cyan-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              摄影 · 光影 · 记忆
            </div>

            <h2 className="text-5xl md:text-7xl font-semibold tracking-[-0.03em] text-white mb-8 leading-[1.05]">
              光影之间
              <br />
              <span className="text-white/60">记录所见与所想</span>
            </h2>

            <p className="text-white/35 text-lg md:text-xl max-w-xl mb-12 leading-relaxed font-light">
              每一张照片都是一个故事，每一次按下快门都是与世界的对话。
            </p>

            <Link
              href="/gallery"
              className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-cyan-500 px-12 text-base font-medium text-white transition-all duration-300 hover:bg-cyan-400 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">进入画廊</span>
              <svg className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
