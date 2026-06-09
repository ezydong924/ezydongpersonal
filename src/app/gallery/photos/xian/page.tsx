"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GradientBackground } from "@/components/ui/gradient-background";
import BackButton from "@/components/back-button";

const categories = [
  { name: "晨光", icon: "🌅", slug: "dawn", desc: "古城墙初醒" },
  { name: "午后", icon: "☀️", slug: "noon", desc: "钟楼下的车流" },
  { name: "蓝调", icon: "🌆", slug: "blue", desc: "大雁塔暮色沉" },
  { name: "夜景", icon: "🌃", slug: "night", desc: "不夜城的灯火" },
];

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <GradientBackground colors={["hsl(38, 75%, 30%)", "hsl(22, 55%, 22%)", "hsl(48, 50%, 18%)"]} />
      <div className="fixed top-8 left-8 z-50">
        <BackButton href="/gallery/photos" label="返回" />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <h1 className="text-4xl font-light tracking-wide text-white/80">西安</h1>
        <p className="text-white/30 text-sm mt-2 mb-16">长安 · 十三朝古都</p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          {categories.map((cat, i) => (
            <motion.div key={cat.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link href={"/gallery/photos/xian/" + cat.slug} className="block p-6 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/15 transition-all duration-300 text-center">
                <span className="text-3xl">{cat.icon}</span>
                <h3 className="text-white/70 text-sm font-medium mt-3">{cat.name}</h3>
                <p className="text-white/25 text-xs mt-1">{cat.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
