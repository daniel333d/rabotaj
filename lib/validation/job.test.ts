import { describe, expect, it } from "vitest";
import { jobSchema, slugSchema } from "@/lib/validation/job";

const baseJob = {
  title: "Senior Frontend Developer",
  slug: "senior-frontend-developer",
  country: "Polska",
  city: "Warszawa",
  workMode: "hybrid" as const,
  contractType: "b2b" as const,
  salaryMin: 15000,
  salaryMax: 20000,
  salaryCurrency: "PLN",
  salaryPeriod: "month" as const,
  experienceLevel: "senior" as const,
  workLanguage: "polski",
  requirements: ["React"],
  niceToHave: [],
  noExperienceRequired: false,
  description: "A".repeat(50),
  responsibilities: ["Build things"],
  benefits: [],
  accommodationProvided: false,
  recruitmentProcess: [],
  responseTimeDays: 2,
  startDate: undefined
};

describe("slugSchema", () => {
  it("accepts a lowercase hyphenated slug", () => {
    expect(slugSchema.safeParse("senior-frontend-developer").success).toBe(true);
  });

  it("rejects uppercase or spaces", () => {
    expect(slugSchema.safeParse("Senior Frontend").success).toBe(false);
  });

  it("rejects a slug that is too short", () => {
    expect(slugSchema.safeParse("ab").success).toBe(false);
  });
});

describe("jobSchema", () => {
  it("accepts a fully valid job payload", () => {
    expect(jobSchema.safeParse(baseJob).success).toBe(true);
  });

  it("rejects when salaryMin is greater than salaryMax", () => {
    const result = jobSchema.safeParse({ ...baseJob, salaryMin: 20000, salaryMax: 10000 });
    expect(result.success).toBe(false);
  });

  it("accepts when salary fields are omitted (undisclosed)", () => {
    const result = jobSchema.safeParse({ ...baseJob, salaryMin: undefined, salaryMax: undefined });
    expect(result.success).toBe(true);
  });

  it("rejects a description shorter than 40 characters", () => {
    const result = jobSchema.safeParse({ ...baseJob, description: "Too short" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid work mode", () => {
    const result = jobSchema.safeParse({ ...baseJob, workMode: "flexible" });
    expect(result.success).toBe(false);
  });
});
