import type { Job } from "@/lib/data/jobs";
import pl from "@/lib/i18n/locales/pl";

export type RabotajScoreLevel = "excellent" | "good" | "average" | "low";

export type RabotajScoreCriterionId =
  | "salaryRange"
  | "verifiedEmployer"
  | "contractType"
  | "workModel"
  | "location"
  | "workLanguage"
  | "responsibilities"
  | "requirements"
  | "benefits"
  | "recruitmentProcess"
  | "expectedResponseTime"
  | "startDate";

export type RabotajScoreCriterion = {
  id: RabotajScoreCriterionId;
  points: number;
  met: boolean;
};

export type RabotajScoreResult = {
  score: number;
  level: RabotajScoreLevel;
  label: string;
  completedCriteria: RabotajScoreCriterionId[];
  missingCriteria: RabotajScoreCriterionId[];
  breakdown: RabotajScoreCriterion[];
};

/**
 * The fields a job (or a draft job-posting form) must expose to be scored.
 * Kept separate from the full `Job` type so the employer-form live preview
 * can score a partial draft without fabricating unrelated fields (slug,
 * matchPercent, publishedAt, ...).
 */
export type RabotajScoreInput = Pick<
  Job,
  | "salaryDisclosed"
  | "salaryMin"
  | "salaryMax"
  | "verifiedEmployer"
  | "contractType"
  | "workModel"
  | "city"
  | "country"
  | "language"
  | "responsibilities"
  | "requirements"
  | "benefits"
  | "process"
  | "expectedResponseTime"
  | "startDate"
>;

type CriterionDefinition = {
  id: RabotajScoreCriterionId;
  points: number;
  check: (job: RabotajScoreInput) => boolean;
};

/** Single source of truth for the Rabotaj Score rubric — total = 100 points. */
export const RABOTAJ_SCORE_CRITERIA: CriterionDefinition[] = [
  {
    id: "salaryRange",
    points: 20,
    check: (job) => job.salaryDisclosed && job.salaryMin > 0 && job.salaryMax > 0
  },
  {
    id: "verifiedEmployer",
    points: 15,
    check: (job) => job.verifiedEmployer === true
  },
  {
    id: "contractType",
    points: 8,
    check: (job) => Boolean(job.contractType)
  },
  {
    id: "workModel",
    points: 5,
    check: (job) => Boolean(job.workModel)
  },
  {
    id: "location",
    points: 5,
    check: (job) => Boolean(job.city?.trim() && job.country?.trim())
  },
  {
    id: "workLanguage",
    points: 7,
    check: (job) => Boolean(job.language?.trim())
  },
  {
    id: "responsibilities",
    points: 10,
    check: (job) => job.responsibilities.length > 0
  },
  {
    id: "requirements",
    points: 8,
    check: (job) => job.requirements.length > 0
  },
  {
    id: "benefits",
    points: 5,
    check: (job) => job.benefits.length > 0
  },
  {
    id: "recruitmentProcess",
    points: 7,
    check: (job) => job.process.length > 0
  },
  {
    id: "expectedResponseTime",
    points: 5,
    check: (job) => Boolean(job.expectedResponseTime?.trim())
  },
  {
    id: "startDate",
    points: 5,
    check: (job) => Boolean(job.startDate?.trim())
  }
];

export const RABOTAJ_SCORE_MAX = RABOTAJ_SCORE_CRITERIA.reduce((sum, c) => sum + c.points, 0);

export function getRabotajScoreLevel(score: number): RabotajScoreLevel {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "average";
  return "low";
}

export function calculateRabotajScore(job: RabotajScoreInput): RabotajScoreResult {
  const breakdown: RabotajScoreCriterion[] = RABOTAJ_SCORE_CRITERIA.map((criterion) => ({
    id: criterion.id,
    points: criterion.points,
    met: criterion.check(job)
  }));

  const rawScore = breakdown.reduce((sum, criterion) => sum + (criterion.met ? criterion.points : 0), 0);
  const score = Math.min(100, Math.max(0, rawScore));
  const level = getRabotajScoreLevel(score);

  return {
    score,
    level,
    label: pl.rabotajScore.levels[level],
    completedCriteria: breakdown.filter((c) => c.met).map((c) => c.id),
    missingCriteria: breakdown.filter((c) => !c.met).map((c) => c.id),
    breakdown
  };
}

/** Missing criteria sorted by point value (highest impact first) — drives suggestion lists. */
export function getMissingCriteriaSorted(result: RabotajScoreResult): RabotajScoreCriterion[] {
  return result.breakdown.filter((c) => !c.met).sort((a, b) => b.points - a.points);
}

export function getMetCriteria(result: RabotajScoreResult): RabotajScoreCriterion[] {
  return result.breakdown.filter((c) => c.met);
}
