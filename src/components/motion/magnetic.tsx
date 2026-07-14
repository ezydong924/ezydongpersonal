"use client";

import { type PointerEvent, type ReactNode, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function Magnetic({ children, className, strength = 0.16 }: MagneticProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 240, damping: 18, mass: 0.35 });
  const y = useSpring(useMotionValue(0), { stiffness: 240, damping: 18, mass: 0.35 });

  function resetPosition() {
    x.set(0);
    y.set(0);
  }

  function updatePosition(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType === "touch" || !elementRef.current) return;

    const bounds = elementRef.current.getBoundingClientRect();
    x.set((event.clientX - (bounds.left + bounds.width / 2)) * strength);
    y.set((event.clientY - (bounds.top + bounds.height / 2)) * strength);
  }

  return (
    <motion.div
      ref={elementRef}
      className={className}
      style={{ x, y }}
      onPointerMove={updatePosition}
      onPointerLeave={resetPosition}
      onPointerCancel={resetPosition}
    >
      {children}
    </motion.div>
  );
}
