"use client";

import { motion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "p" | "span";
  delay?: number;
}

export default function EntranceText({ text, className = "", as: Tag = "h1", delay = 0 }: Props) {
  return (
    <Tag className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: delay + i * 0.06, ease: "easeOut" }}
        >
          {char}
        </motion.span>
      ))}
    </Tag>
  );
}
