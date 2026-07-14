import type { Job } from "@/lib/data/jobs";
import { calculateRabotajScore } from "@/lib/rabotaj-score";

export type FilterState = {
  country: string;
  city: string;
  remoteOnly: boolean;
  accommodationOnly: boolean;
  minSalary: number;
  contractType: string;
  experience: string;
  language: string;
  industry: string;
  verifiedOnly: boolean;
  minScore: number;
};

export const defaultFilters: FilterState = {
  country: "",
  city: "",
  remoteOnly: false,
  accommodationOnly: false,
  minSalary: 0,
  contractType: "",
  experience: "",
  language: "",
  industry: "",
  verifiedOnly: false,
  minScore: 0
};

export const scoreFilterOptions = [50, 70, 85];

export type FilterOptions = ReturnType<typeof getFilterOptions>;

/** Derived from whichever job list is actually rendered (DB-backed or static fallback). */
export function getFilterOptions(jobs: Job[]) {
  return {
    countries: Array.from(new Set(jobs.map((job) => job.country))).sort(),
    cities: Array.from(new Set(jobs.map((job) => job.city))).sort(),
    contractTypes: Array.from(new Set(jobs.map((job) => job.contractType))).sort(),
    experiences: Array.from(new Set(jobs.map((job) => job.experience))),
    languages: Array.from(new Set(jobs.map((job) => job.language))).sort(),
    industries: Array.from(new Set(jobs.map((job) => job.industry))).sort()
  };
}

export type SortOption = "newest" | "salary-high" | "match" | "score-high";

export function applyFilters(list: Job[], query: string, filters: FilterState, locationQuery = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedLocation = locationQuery.trim().toLowerCase();

  return list.filter((job) => {
    if (normalizedQuery) {
      const haystack = `${job.title} ${job.city} ${job.country} ${job.skills.join(" ")} ${job.industry}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) return false;
    }
    if (normalizedLocation) {
      const locationHaystack = `${job.city} ${job.country} ${job.remote ? "zdalnie remote" : ""}`.toLowerCase();
      if (!locationHaystack.includes(normalizedLocation)) return false;
    }
    if (filters.country && job.country !== filters.country) return false;
    if (filters.city && job.city !== filters.city) return false;
    if (filters.remoteOnly && !job.remote) return false;
    if (filters.accommodationOnly && !job.accommodation) return false;
    if (filters.minSalary && job.salaryMax < filters.minSalary) return false;
    if (filters.contractType && job.contractType !== filters.contractType) return false;
    if (filters.experience && job.experience !== filters.experience) return false;
    if (filters.language && job.language !== filters.language) return false;
    if (filters.industry && job.industry !== filters.industry) return false;
    if (filters.verifiedOnly && !job.verifiedEmployer) return false;
    if (filters.minScore && calculateRabotajScore(job).score < filters.minScore) return false;
    return true;
  });
}

export function sortJobs(list: Job[], sort: SortOption) {
  const copy = [...list];
  switch (sort) {
    case "salary-high":
      return copy.sort((a, b) => b.salaryMax - a.salaryMax);
    case "match":
      return copy.sort((a, b) => b.matchPercent - a.matchPercent);
    case "score-high":
      return copy.sort((a, b) => calculateRabotajScore(b).score - calculateRabotajScore(a).score);
    case "newest":
    default:
      return copy.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
}
