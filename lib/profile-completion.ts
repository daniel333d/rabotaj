export type ProfileCompletionInput = {
  professionalTitle: string | null;
  summary: string | null;
  expectedSalaryMin: number | null;
  expectedSalaryMax: number | null;
  preferredWorkMode: string | null;
  availabilityDate: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  experienceCount: number;
  educationCount: number;
  skillsCount: number;
  languagesCount: number;
};

type CompletionCriterion = { id: string; points: number; met: boolean };

const CRITERIA: { id: string; points: number; check: (p: ProfileCompletionInput) => boolean }[] = [
  { id: "professionalTitle", points: 15, check: (p) => Boolean(p.professionalTitle?.trim()) },
  { id: "summary", points: 10, check: (p) => Boolean(p.summary?.trim()) },
  { id: "location", points: 10, check: (p) => Boolean(p.city?.trim() && p.country?.trim()) },
  { id: "phone", points: 10, check: (p) => Boolean(p.phone?.trim()) },
  { id: "expectedSalary", points: 10, check: (p) => Boolean(p.expectedSalaryMin && p.expectedSalaryMax) },
  { id: "preferredWorkMode", points: 5, check: (p) => Boolean(p.preferredWorkMode) },
  { id: "availabilityDate", points: 5, check: (p) => Boolean(p.availabilityDate) },
  { id: "experience", points: 15, check: (p) => p.experienceCount > 0 },
  { id: "education", points: 10, check: (p) => p.educationCount > 0 },
  { id: "skills", points: 5, check: (p) => p.skillsCount > 0 },
  { id: "languages", points: 5, check: (p) => p.languagesCount > 0 }
];

export const PROFILE_COMPLETION_MAX = CRITERIA.reduce((sum, c) => sum + c.points, 0);

/** Single source of truth for Career Passport completion — same pattern as calculateRabotajScore. */
export function calculateProfileCompletion(input: ProfileCompletionInput): {
  score: number;
  breakdown: CompletionCriterion[];
} {
  const breakdown = CRITERIA.map((c) => ({ id: c.id, points: c.points, met: c.check(input) }));
  const score = Math.min(100, Math.max(0, breakdown.reduce((sum, c) => sum + (c.met ? c.points : 0), 0)));
  return { score, breakdown };
}
