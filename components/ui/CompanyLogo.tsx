import { cn } from "@/lib/utils";

export function CompanyLogo({
  initials,
  color,
  size = 48,
  className
}: {
  initials: string;
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-2xl font-heading font-bold text-white", className)}
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
