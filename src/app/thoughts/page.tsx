import BackButton from "@/components/back-button";

export default function ThoughtsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <BackButton href="/" label="首页" />
      <h1 className="text-4xl font-light tracking-wide text-white/90 mt-8 mb-4">想法</h1>
      <p className="text-white/40 text-lg font-light">文字与思考</p>
      <p className="text-white/30 text-center py-20 text-lg">即将上线</p>
    </div>
  );
}
