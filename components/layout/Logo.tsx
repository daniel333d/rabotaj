import Image from "next/image";
import { cn } from "@/lib/utils";

const variants = {
  primary: { src: "/brand/logos/rabotaj-logo-primary.webp", width: 1080, height: 325 },
  compact: { src: "/brand/logos/rabotaj-logo-compact.webp", width: 385, height: 120 },
  mark: { src: "/brand/logos/rabotaj-mark.webp", width: 220, height: 215 }
} as const;

export function Logo({
  variant = "compact",
  className,
  priority
}: {
  variant?: keyof typeof variants;
  className?: string;
  priority?: boolean;
}) {
  const { src, width, height } = variants[variant];

  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={src}
        alt="Rabotaj.com"
        width={width}
        height={height}
        priority={priority}
        className="h-full w-auto"
      />
    </span>
  );
}
