"use client";

import Link from "next/link";
import EntranceText from "@/components/entrance-text";

export default function Narrative() {
  return (
    <div className="w-full pt-28 pb-24">
      <section className="max-w-5xl mx-auto px-6 md:px-10 mb-32 text-center">
        <div className="flex items-center justify-center gap-0 mb-12 w-full">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-white/15" />
          <span className="mx-8 text-sm font-medium tracking-[0.2em] text-white/55 uppercase whitespace-nowrap">
            影岑Shadow
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/15 to-white/15" />
        </div>
        <EntranceText
          text="光影 记忆 存在"
          className="font-[family-name:var(--font-serif)] text-[3.5rem] sm:text-[5.5rem] md:text-[6.5rem] font-semibold text-white tracking-[0em] leading-[1.05]"
          delay={0.3}
        />
        <p className="mt-10 text-lg sm:text-xl text-white/65 font-light leading-relaxed">
          在数字荒野中寻找一种安静的表达。<br />
          用镜头和文字，裁剪时间的切片。
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <section className="bg-white/[0.18] border border-white/[0.25] rounded-[2rem] p-10 md:p-14 mb-8">
          <p className="text-sm font-medium tracking-[0.15em] text-white/50 uppercase">01 / Lens</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.08] mt-6">摄影作品</h2>
          <p className="mt-4 text-lg text-white/70 font-light leading-relaxed max-w-lg">万物皆有裂痕，那是光照进来的地方。镜头偏爱被日常忽略的安静。</p>
          <Link href="/gallery" className="inline-block mt-8 text-base text-white/70 hover:text-white font-medium transition-colors">进入画廊 &rarr;</Link>
        </section>
        <section className="bg-white/[0.18] border border-white/[0.25] rounded-[2rem] p-10 md:p-14 mb-8">
          <p className="text-sm font-medium tracking-[0.15em] text-white/50 uppercase">02 / Mind</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.08] mt-6">我的思考</h2>
          <p className="mt-4 text-lg text-white/70 font-light leading-relaxed max-w-lg">摄影向外复刻世界，文字向内拆解自我。这里是理性与感性交汇的自留地。</p>
          <Link href="/thoughts" className="inline-block mt-8 text-base text-white/70 hover:text-white font-medium transition-colors">阅读文章 &rarr;</Link>
        </section>
        <section className="bg-white/[0.18] border border-white/[0.25] rounded-[2rem] p-10 md:p-14">
          <p className="text-sm font-medium tracking-[0.15em] text-white/50 uppercase">03 / Identity</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-[-0.02em] leading-[1.08] mt-6">关于我</h2>
          <p className="mt-4 text-lg text-white/70 font-light leading-relaxed max-w-lg">在代码与浪漫之间行走的构建者。用工程思维解决问题，用艺术眼光看待世界。</p>
          <Link href="/about" className="inline-block mt-8 text-base text-white/70 hover:text-white font-medium transition-colors">了解更多 &rarr;</Link>
        </section>
      </div>
    </div>
  );
}
