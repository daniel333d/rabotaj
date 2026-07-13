import type { RabotajScoreLevel } from "@/lib/rabotaj-score";

type LevelTheme = {
  ring: string;
  text: string;
  softBg: string;
  border: string;
};

/** Calm, non-alarming palette — never the sole carrier of meaning (always paired with the numeric score + level name). */
export const levelTheme: Record<RabotajScoreLevel, LevelTheme> = {
  excellent: { ring: "#16A36A", text: "text-success", softBg: "bg-green-50", border: "border-success/30" },
  good: { ring: "#2563EB", text: "text-brand", softBg: "bg-brand-light", border: "border-brand/30" },
  average: { ring: "#B45309", text: "text-amber-700", softBg: "bg-amber-50", border: "border-amber-200" },
  low: { ring: "#667085", text: "text-muted", softBg: "bg-surface", border: "border-border" }
};
