"use client";

import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedText({ text, className = "", style }: AnimatedTextProps) {
  const chars = text.split("");

  return (
    <motion.h1
      className={`inline-block text-center cursor-default ${className}`}
      style={style}
      initial="rest"
      whileHover="hover"
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          variants={{
            rest: { y: 0, scale: 1 },
            hover: {
              y: -6,
              scale: 1.12,
              transition: {
                type: "spring",
                stiffness: 280,
                damping: 14,
                delay: i * 0.025,
              },
            },
          }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
