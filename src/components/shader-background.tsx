"use client";

import { Warp } from "@paper-design/shaders-react";
import { useReducedMotion } from "framer-motion";

export default function ShaderBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Warp
        style={{ height: "100%", width: "100%" }}
        proportion={0.48}
        softness={1.2}
        distortion={0.16}
        swirl={0.42}
        swirlIterations={7}
        shape="checks"
        shapeScale={0.16}
        scale={1.08}
        rotation={-3}
        speed={reduceMotion ? 0 : 0.22}
        colors={[
          "hsl(165, 16%, 9%)",
          "hsl(150, 12%, 46%)",
          "hsl(214, 9%, 23%)",
          "hsl(38, 14%, 67%)",
        ]}
      />
    </div>
  );
}
