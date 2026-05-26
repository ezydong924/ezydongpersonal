import ShaderBackground from "@/components/shader-background";
import Narrative from "@/components/flow-art";
import BackButton from "@/components/back-button";

export default function ExplorePage() {
  return (
    <>
      <ShaderBackground />
      <div className="fixed inset-0 bg-black/[0.07] pointer-events-none z-0" />
      <div className="relative z-10">
        <div className="absolute top-8 left-8 z-50">
          <BackButton href="/" label="首页" />
        </div>
        <Narrative />
      </div>
    </>
  );
}
