import BackButton from "@/components/back-button";
import { CameraIcon, MapPinIcon, MailIcon } from "@/components/icons";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <BackButton href="/" label="首页" />

      <div className="mt-12">
        <div className="w-24 h-24 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-8">
          <CameraIcon className="w-10 h-10 text-white/30" />
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
