"use client";

import { useId } from "react";
import { useI18n } from "@/lib/i18n/context";
import { calculateRabotajScore, type RabotajScoreInput, type RabotajScoreResult } from "@/lib/rabotaj-score";
import { levelTheme } from "./levelTheme";
import { ScoreRing } from "./ScoreRing";
import { RabotajScoreDetails } from "./RabotajScoreDetails";
import { cn } from "@/lib/utils";

export type RabotajScoreVariant = "compact" | "standard" | "detailed";

export function RabotajScore({
  job,
  variant = "standard",
  className
}: {
  job: RabotajScoreInput;
  variant?: RabotajScoreVariant;
  className?: string;
}) {
  const result = calculateRabotajScore(job);

  if (variant === "compact") return <CompactRabotajScore result={result} className={className} />;
  if (variant === "detailed") return <RabotajScoreDetails result={result} className={className} />;
  return <StandardRabotajScore result={result} className={className} />;
}

/** Small badge + accessible tooltip (hover, focus, or click — all reveal the same panel). Used on job cards. */
function CompactRabotajScore({ result, className }: { result: RabotajScoreResult; className?: string }) {
  const { t } = useI18n();
  const theme = levelTheme[result.level];
  const tooltipId = useId();

  return (
    <div className={cn("group/score relative inline-flex", className)}>
      <button
        type="button"
        aria-describedby={tooltipId}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-white py-1 pl-1 pr-2.5 transition-colors duration-150 hover:border-brand/40 focus-visible:outline-2 focus-visible:outline-brand"
      >
        <ScoreRing score={result.score} size={22} colorHex={theme.ring} />
        <span className="text-[11px] font-bold text-ink">
          {t.rabotajScore.title} {result.score}/100
        </span>
      </button>

      <div
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-border bg-white p-3.5 opacity-0 shadow-elevated transition-opacity duration-150 group-hover/score:opacity-100 group-focus-within/score:opacity-100"
      >
        <p className={cn("text-xs font-bold", theme.text)}>
          {result.score}/100 · {t.rabotajScore.levels[result.level]}
        </p>
        <p className="mt-1.5 text-[11px] leading-5 text-muted">{t.rabotajScore.tooltipDisclaimer}</p>
      </div>
    </div>
  );
}

/** Ring + score + level + thin progress bar. Used on the main /jobs results list — secondary to title/salary/apply. */
function StandardRabotajScore({ result, className }: { result: RabotajScoreResult; className?: string }) {
  const { t } = useI18n();
  const theme = levelTheme[result.level];

  return (
    <div className={cn("flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-3 py-2.5", className)}>
      <ScoreRing score={result.score} size={34} colorHex={theme.ring} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-ink">{t.rabotajScore.title}</span>
          <span className="text-xs font-bold text-ink">{result.score}/100</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border" role="presentation">
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${result.score}%`, backgroundColor: theme.ring }}
          />
        </div>
        <p className={cn("mt-1 text-[11px] font-semibold", theme.text)}>{t.rabotajScore.levels[result.level]}</p>
      </div>
    </div>
  );
}
