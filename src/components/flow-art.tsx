"use client";

import Link from "next/link";
import EntranceText from "@/components/entrance-text";

export default function Narrative() {
  return (
    <div className="w-full pt-28 pb-24">
      <section className="max-w-5xl mx-auto px-2 md:px-10 mb-32 overflow-visible text-center">
        <div className="flex items-center justify-center gap-0 mb-12 w-full">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-white/15" />
          <span className="mx-8 text-sm font-medium tracking-[0.2em] text-white/55 uppercase whitespace-nowrap">
            影岑Shadow
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/15 to-white/15" />
        </div>
        <EntranceText
          text="光影 记忆 存在"
          className="font-[family-name:var(--font-serif)] text-[2.8rem] sm:text-[5rem] md:text-[6.5rem] font-semibold text-white tracking-[0em] leading-[1.05]"
          delay={0.3}
        />
        <p className="mt-10 text-lg sm:text-xl text-white/65 font-light leading-relaxed">
          在数字荒野中寻找一种安静的表达。<br />
          用镜头和文字，裁剪时间的切片。
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <section className="bg-white/[0.06] border border-white/[0.12] rounded-[2rem] p-10 md:p-14 mb-8">
          <p className="text-sm font-medium tracking-[0.15em] text-white/50 uppercase">01 / Lens</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.08] mt-6">摄影作品</h2>
          <p className="mt-4 text-lg text-white/70 font-light leading-relaxed max-w-lg">光和时间的化石。——森山大道</p>
          <Link href="/gallery" className="inline-block mt-8 text-base text-white/70 hover:text-white font-medium transition-colors">进入画廊 &rarr;</Link>
        </section>
        <section className="bg-white/[0.06] border border-white/[0.12] rounded-[2rem] p-10 md:p-14 mb-8">
          <p className="text-sm font-medium tracking-[0.15em] text-white/50 uppercase">02 / Mind</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.08] mt-6">我的思考</h2>
          <p className="mt-4 text-lg text-white/70 font-light leading-relaxed max-w-lg">有些东西拍不到。写下来不会丢。</p>
          <Link href="/thoughts" className="inline-block mt-8 text-base text-white/70 hover:text-white font-medium transition-colors">阅读文章 &rarr;</Link>
        </section>
        <section className="bg-white/[0.06] border border-white/[0.12] rounded-[2rem] p-10 md:p-14">
          <p className="text-sm font-medium tracking-[0.15em] text-white/50 uppercase">03 / Identity</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.08] mt-6">关于我</h2>
          <p className="mt-4 text-lg text-white/70 font-light leading-relaxed max-w-lg">一直在走。走了几年，还没停。</p>
          <Link href="/about" className="inline-block mt-8 text-base text-white/70 hover:text-white font-medium transition-colors">了解更多 &rarr;</Link>
        </section>
      </div>
    </div>
  );
}
