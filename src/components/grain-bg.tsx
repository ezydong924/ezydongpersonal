"use client";

import { GrainGradient } from "@paper-design/shaders-react";

export default function GrainBg() {
  return (
    <div className="absolute inset-0 -z-10">
      <GrainGradient
        style={{ height: "100%", width: "100%" }}
        colorBack="hsl(0, 0%, 3%)"
        softness={0.76}
        intensity={0.45}
        noise={0}
        shape="corners"
        offsetX={0}
        offsetY={0}
        scale={1}
        rotation={0}
        speed={1}
        colors={[
          "hsl(0, 0%, 40%)",
          "hsl(0, 0%, 25%)",
          "hsl(0, 0%, 55%)",
        ]}
      />
    </div>
  );
}
