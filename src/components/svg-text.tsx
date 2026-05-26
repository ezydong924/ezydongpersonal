"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";

interface SvgTextProps {
  svg: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
}

export function SvgText({
  svg,
  children,
  className = "",
  fontSize = "20vw",
  fontWeight = "bold",
}: SvgTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const content = React.Children.toArray(children).join("");
  const maskId = React.useId();

  useEffect(() => {
    if (!textRef.current) return;
    const update = () => {
      const r = textRef.current?.getBoundingClientRect();
      if (r) setDims({ w: Math.max(r.width, 200), h: Math.max(r.height, 100) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(textRef.current);
    return () => ro.disconnect();
  }, [content, fontSize, fontWeight]);

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={textRef}
        className="opacity-0 absolute pointer-events-none font-bold whitespace-nowrap"
        style={{ fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize, fontWeight, fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        {content}
      </div>
      <svg
        className="block"
        width={dims.w}
        height={dims.h}
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        style={{ fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize, fontWeight, fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="black" />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="white"
              style={{ fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize, fontWeight, fontFamily: "system-ui, -apple-system, sans-serif" }}>
              {content}
            </text>
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          <foreignObject width="100%" height="100%" style={{ overflow: "visible" }}>
            <div style={{ width: `${dims.w}px`, height: `${dims.h}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "400px", height: "200px", transform: `scale(${Math.max(dims.w / 400, dims.h / 200)})`, transformOrigin: "center" }}>
                {svg}
              </div>
            </div>
          </foreignObject>
        </g>
      </svg>
      <span className="sr-only">{content}</span>
    </div>
  );
}
