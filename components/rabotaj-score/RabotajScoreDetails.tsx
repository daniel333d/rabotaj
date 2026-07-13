import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { RABOTAJ_SCORE_CRITERIA, type RabotajScoreResult } from "@/lib/rabotaj-score";
import { levelTheme } from "./levelTheme";
import { ScoreRing } from "./ScoreRing";
import { RabotajScoreBreakdown } from "./RabotajScoreBreakdown";
import { cn } from "@/lib/utils";

export function RabotajScoreDetails({
  result,
  className,
  showBreakdown = true,
  showHowWeCalculate = true
}: {
  result: RabotajScoreResult;
  className?: string;
  showBreakdown?: boolean;
  showHowWeCalculate?: boolean;
}) {
  const { t } = useI18n();
  const theme = levelTheme[result.level];

  return (
    <div className={cn("rounded-2xl border border-border bg-white p-6 shadow-soft", className)}>
      <h2 className="font-heading text-sm font-bold text-ink">{t.rabotajScore.titleMark}</h2>

      <div className="mt-4 flex items-center gap-4">
        <ScoreRing score={result.score} size={64} colorHex={theme.ring} />
        <div>
          <p className="font-heading text-2xl font-extrabold leading-none text-ink">
            {result.score}
            <span className="text-sm font-semibold text-muted">/100</span>
          </p>
          <p className={cn("mt-1.5 text-sm font-bold", theme.text)}>{t.rabotajScore.levels[result.level]}</p>
        </div>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-border" role="presentation">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${result.score}%`, backgroundColor: theme.ring }}
        />
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">{t.rabotajScore.shortDisclaimer}</p>

      {showBreakdown && <RabotajScoreBreakdown result={result} className="mt-6" />}

      {showHowWeCalculate && (
        <details className="group mt-6 rounded-xl border border-border bg-surface/60 px-4 py-3.5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-bold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
            {t.rabotajScore.howWeCalculate}
            <ChevronDown
              size={16}
              className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="mt-3.5 border-t border-border pt-3.5">
            <p className="text-xs leading-5 text-ink/70">{t.rabotajScore.howWeCalculateIntro}</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {RABOTAJ_SCORE_CRITERIA.map((criterion) => (
                <li key={criterion.id} className="flex items-center justify-between gap-3 text-xs text-ink/80">
                  <span>{t.rabotajScore.criteriaMet[criterion.id]}</span>
                  <span className="shrink-0 font-semibold text-ink">
                    +{criterion.points} {t.rabotajScore.points}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}

      <p className="mt-4 text-[11px] leading-5 text-muted">{t.rabotajScore.fullDisclaimer}</p>
    </div>
  );
}
