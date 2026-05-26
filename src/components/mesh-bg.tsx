"use client";

import { useRef, useState, useEffect } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

export default function MeshBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const enter = () => setIsActive(true);
    const leave = () => setIsActive(false);
    container.addEventListener("mouseenter", enter);
    container.addEventListener("mouseleave", leave);
    return () => {
      container.removeEventListener("mouseenter", enter);
      container.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#000000", "#06b6d4", "#0891b2", "#0e7490", "#6366f1"]}
        speed={isActive ? 0.5 : 0.3}
      />
    </div>
  );
}
