"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { SpringOptions } from "framer-motion";
import { cn } from "@/lib/utils";

function generateStars(count: number, starColor: string) {
  const shadows: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 4000) - 2000;
    const y = Math.floor(Math.random() * 4000) - 2000;
    shadows.push(`${x}px ${y}px ${starColor}`);
  }
  return shadows.join(", ");
}

function StarLayer({
  count = 1000,
  size = 1,
  transition = { repeat: Infinity, duration: 50, ease: "linear" },
  starColor = "#fff",
  className,
}: {
  count: number;
  size: number;
  transition: { repeat: number; duration: number; ease: string };
  starColor: string;
  className?: string;
}) {
  const [boxShadow, setBoxShadow] = React.useState<string>("");
  React.useEffect(() => {
    setBoxShadow(generateStars(count, starColor));
  }, [count, starColor]);

  return (
    <motion.div
      animate={{ y: [0, -2000] }}
      transition={transition}
      className={cn("absolute top-0 left-0 w-full h-[2000px]", className)}
    >
      <div className="absolute bg-transparent rounded-full" style={{ width: `${size}px`, height: `${size}px`, boxShadow }} />
      <div className="absolute bg-transparent rounded-full top-[2000px]" style={{ width: `${size}px`, height: `${size}px`, boxShadow }} />
    </motion.div>
  );
}

export function StarsBackground({
  children,
  className,
  factor = 0.05,
  speed = 50,
  transition = { stiffness: 50, damping: 20 },
  starColor = "#fff",
}: {
  children?: React.ReactNode;
  className?: string;
  factor?: number;
  speed?: number;
  transition?: SpringOptions;
  starColor?: string;
}) {
  const offsetX = useMotionValue(1);
  const offsetY = useMotionValue(1);
  const springX = useSpring(offsetX, transition);
  const springY = useSpring(offsetY, transition);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      offsetX.set(-(e.clientX - cx) * factor);
      offsetY.set(-(e.clientY - cy) * factor);
    },
    [offsetX, offsetY, factor]
  );

  return (
    <div
      className={cn("relative size-full overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_#1a1a2e_0%,_#000_100%)]", className)}
      onMouseMove={handleMouseMove}
    >
      <motion.div style={{ x: springX, y: springY }}>
        <StarLayer count={1000} size={1} transition={{ repeat: Infinity, duration: speed, ease: "linear" }} starColor={starColor} />
        <StarLayer count={400} size={2} transition={{ repeat: Infinity, duration: speed * 2, ease: "linear" }} starColor={starColor} />
        <StarLayer count={200} size={3} transition={{ repeat: Infinity, duration: speed * 3, ease: "linear" }} starColor={starColor} />
      </motion.div>
    </div>
  );
}
