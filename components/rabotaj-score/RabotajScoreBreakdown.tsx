import { Check, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { getMetCriteria, getMissingCriteriaSorted, type RabotajScoreResult } from "@/lib/rabotaj-score";
import { cn } from "@/lib/utils";

export function RabotajScoreBreakdown({ result, className }: { result: RabotajScoreResult; className?: string }) {
  const { t } = useI18n();
  const met = getMetCriteria(result);
  const missing = getMissingCriteriaSorted(result);

  return (
    <div className={cn("grid gap-6 sm:grid-cols-2", className)}>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted">{t.rabotajScore.metCriteriaTitle}</h3>
        <ul className="mt-2.5 flex flex-col gap-2">
          {met.map((criterion) => (
            <li key={criterion.id} className="flex items-start gap-2 text-sm leading-5 text-ink/80">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-success"
                aria-hidden="true"
              >
                <Check size={12} />
              </span>
              {t.rabotajScore.criteriaMet[criterion.id]}
            </li>
          ))}
          {met.length === 0 && <li className="text-sm text-muted">—</li>}
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wide text-muted">{t.rabotajScore.missingCriteriaTitle}</h3>
        <ul className="mt-2.5 flex flex-col gap-2">
          {missing.map((criterion) => (
            <li key={criterion.id} className="flex items-start gap-2 text-sm leading-5 text-ink/60">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-muted"
                aria-hidden="true"
              >
                <X size={11} />
              </span>
              {t.rabotajScore.criteriaMissing[criterion.id]}
            </li>
          ))}
          {missing.length === 0 && <li className="text-sm text-muted">—</li>}
        </ul>
      </div>
    </div>
  );
}
