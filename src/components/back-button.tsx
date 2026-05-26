import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

interface BackButtonProps {
  href: string;
  label: string;
}

export default function BackButton({ href, label }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm"
    >
      <ArrowLeftIcon />
      {label}
    </Link>
  );
}
