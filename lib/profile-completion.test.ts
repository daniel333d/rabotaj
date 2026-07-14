import { describe, expect, it } from "vitest";
import { calculateProfileCompletion, PROFILE_COMPLETION_MAX, type ProfileCompletionInput } from "@/lib/profile-completion";

const complete: ProfileCompletionInput = {
  professionalTitle: "Frontend Developer",
  summary: "Doświadczony developer.",
  expectedSalaryMin: 10000,
  expectedSalaryMax: 15000,
  preferredWorkMode: "hybrid",
  availabilityDate: "2026-01-01",
  phone: "+48600000000",
  city: "Warszawa",
  country: "Polska",
  experienceCount: 2,
  educationCount: 1,
  skillsCount: 3,
  languagesCount: 2
};

const empty: ProfileCompletionInput = {
  professionalTitle: null,
  summary: null,
  expectedSalaryMin: null,
  expectedSalaryMax: null,
  preferredWorkMode: null,
  availabilityDate: null,
  phone: null,
  city: null,
  country: null,
  experienceCount: 0,
  educationCount: 0,
  skillsCount: 0,
  languagesCount: 0
};

describe("PROFILE_COMPLETION_MAX", () => {
  it("sums to exactly 100", () => {
    expect(PROFILE_COMPLETION_MAX).toBe(100);
  });
});

describe("calculateProfileCompletion", () => {
  it("returns 100 for a fully complete profile", () => {
    expect(calculateProfileCompletion(complete).score).toBe(100);
  });

  it("returns 0 for an empty profile", () => {
    const result = calculateProfileCompletion(empty);
    expect(result.score).toBe(0);
    expect(result.breakdown.every((c) => !c.met)).toBe(true);
  });

  it("only counts expected salary when both min and max are present", () => {
    const partial = calculateProfileCompletion({ ...empty, expectedSalaryMin: 5000, expectedSalaryMax: null });
    const salaryCriterion = partial.breakdown.find((c) => c.id === "expectedSalary");
    expect(salaryCriterion?.met).toBe(false);
  });

  it("only counts location when both city and country are present", () => {
    const partial = calculateProfileCompletion({ ...empty, city: "Kraków", country: null });
    const locationCriterion = partial.breakdown.find((c) => c.id === "location");
    expect(locationCriterion?.met).toBe(false);
  });

  it("never exceeds 100 or drops below 0", () => {
    expect(calculateProfileCompletion(complete).score).toBeLessThanOrEqual(100);
    expect(calculateProfileCompletion(empty).score).toBeGreaterThanOrEqual(0);
  });
});
