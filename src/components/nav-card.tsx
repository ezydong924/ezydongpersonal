import Link from "next/link";
import type { ComponentType } from "react";

interface IconProps {
  className?: string;
}

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<IconProps>;
}

export default function NavCard({ title, description, href, icon: Icon }: NavCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-10 backdrop-blur-sm transition-all duration-500 hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] hover:scale-[1.02] card-glow"
    >
      <Icon className="w-9 h-9 mb-4 text-white/60 transition-all duration-500 group-hover:text-white group-hover:scale-110" />
      <h2 className="text-[21px] font-semibold tracking-[-0.02em] text-white">
        {title}
      </h2>
      <p className="mt-1.5 text-[15px] text-white/50 font-normal tracking-[-0.01em] group-hover:text-white/70 transition-colors duration-500">
        {description}
      </p>
    </Link>
  );
}
