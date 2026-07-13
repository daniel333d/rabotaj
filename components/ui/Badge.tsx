import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "blue" | "green" | "neutral" | "navy";

const toneClasses: Record<Tone, string> = {
  blue: "bg-brand-light text-brand",
  green: "bg-green-50 text-success",
  neutral: "bg-surface text-muted border border-border",
  navy: "bg-navy text-white"
};

export function Badge({
  children,
  tone = "neutral",
  icon,
  className
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
