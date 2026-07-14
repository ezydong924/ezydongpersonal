"use client";

import { type PointerEvent, type ReactNode, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
};

export function TiltCard({ children, className, maxTilt = 4 }: TiltCardProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.4 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.4 });

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  function updateTilt(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType === "touch" || !elementRef.current) return;

    const bounds = elementRef.current.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateX.set(pointerY * -maxTilt * 2);
    rotateY.set(pointerX * maxTilt * 2);
  }

  return (
    <motion.div
      ref={elementRef}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      onPointerMove={updateTilt}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
    >
      {children}
    </motion.div>
  );
}
