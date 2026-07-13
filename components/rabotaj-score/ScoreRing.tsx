import { cn } from "@/lib/utils";

export function ScoreRing({
  score,
  size = 40,
  colorHex,
  className
}: {
  score: number;
  size?: number;
  colorHex: string;
  className?: string;
}) {
  const stroke = size <= 32 ? 3 : 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E4E8F0" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorHex}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center font-bold text-ink",
          size <= 32 ? "text-[9px]" : size <= 48 ? "text-[11px]" : "text-base"
        )}
      >
        {score}
      </span>
    </div>
  );
}
