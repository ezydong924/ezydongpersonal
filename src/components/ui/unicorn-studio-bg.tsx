"use client";

import { useState, useEffect } from "react";
import UnicornScene from "unicornstudio-react";

export default function UnicornStudioBg() {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <UnicornScene
        production={true}
        projectId="erpu4mAlEe8kmhaGKYe9"
        width={size.width}
        height={size.height}
      />
    </div>
  );
}
