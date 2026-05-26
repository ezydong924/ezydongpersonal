import ThreeShaderBg from "@/components/three-shader-bg";
import BackButton from "@/components/back-button";
import Link from "next/link";

const entries = [
  {
    title: "影笺",
    subtitle: "Photography",
    desc: "快门是时间的物理切片。光线在建筑边缘的折射，具体生活里的无声诗意。",
    href: "/gallery/photos",
    color: "from-cyan-500/20 to-blue-600/10",
  },
  {
    title: "溯影",
    subtitle: "Cinematography",
    desc: "流动的画面承载更完整的故事。用镜头追溯光影的轨迹与记忆的脉络。",
    href: "/gallery/videos",
    color: "from-purple-500/20 to-violet-600/10",
  },
];

export default function GalleryPage() {
  return (
    <>
      <ThreeShaderBg />
      <div className="fixed inset-0 bg-black/10 pointer-events-none z-0" />
      <div className="relative z-10 min-h-screen">
        <div className="absolute top-8 left-8">
          <BackButton href="/explore" label="返回" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen gap-8 px-6 md:px-12">
          {entries.map((entry) => (
            <Link
              key={entry.title}
              href={entry.href}
              className="group relative flex-1 max-w-md w-full bg-white/[0.08] border border-white/[0.15] rounded-[2rem] p-12 md:p-16 backdrop-blur-sm hover:bg-white/[0.14] hover:border-white/[0.25] hover:scale-[1.02] transition-all duration-500"
            >
              <p className="text-xs tracking-[0.2em] text-white/40 uppercase mb-16">
                {entry.subtitle}
              </p>
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-[-0.02em] leading-none">
                {entry.title}
              </h2>
              <p className="mt-6 text-base text-white/65 font-light leading-relaxed">
                {entry.desc}
              </p>
              <div className="mt-12 text-sm text-white/50 group-hover:text-white/80 transition-colors">
                进入 &rarr;
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
