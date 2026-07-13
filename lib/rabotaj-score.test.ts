import { describe, expect, it } from "vitest";
import {
  RABOTAJ_SCORE_MAX,
  calculateRabotajScore,
  getMissingCriteriaSorted,
  getRabotajScoreLevel,
  type RabotajScoreInput
} from "@/lib/rabotaj-score";
import { jobs } from "@/lib/data/jobs";

const completeJob: RabotajScoreInput = {
  salaryDisclosed: true,
  salaryMin: 8000,
  salaryMax: 12000,
  verifiedEmployer: true,
  contractType: "Umowa o pracę",
  workModel: "hybrid",
  city: "Warszawa",
  country: "Polska",
  language: "polski / angielski",
  responsibilities: ["Obowiązek 1"],
  requirements: ["Wymaganie 1"],
  benefits: ["Benefit 1"],
  process: ["Etap 1"],
  expectedResponseTime: "Zwykle w ciągu 2 dni",
  startDate: "Od zaraz"
};

describe("RABOTAJ_SCORE_MAX", () => {
  it("sums to exactly 100 points across all criteria", () => {
    expect(RABOTAJ_SCORE_MAX).toBe(100);
  });
});

describe("calculateRabotajScore", () => {
  it("returns 100 for a fully complete job posting", () => {
    const result = calculateRabotajScore(completeJob);
    expect(result.score).toBe(100);
    expect(result.level).toBe("excellent");
    expect(result.missingCriteria).toHaveLength(0);
    expect(result.completedCriteria).toHaveLength(12);
  });

  it("deducts 20 points when the salary range is missing", () => {
    const result = calculateRabotajScore({ ...completeJob, salaryMin: 0, salaryMax: 0 });
    expect(result.score).toBe(80);
    expect(result.missingCriteria).toContain("salaryRange");
  });

  it("deducts 20 points when salary numbers exist but salaryDisclosed is false", () => {
    const result = calculateRabotajScore({ ...completeJob, salaryDisclosed: false });
    expect(result.score).toBe(80);
    expect(result.missingCriteria).toContain("salaryRange");
  });

  it("deducts 15 points when the employer is not verified", () => {
    const result = calculateRabotajScore({ ...completeJob, verifiedEmployer: false });
    expect(result.score).toBe(85);
    expect(result.missingCriteria).toContain("verifiedEmployer");
    expect(result.level).toBe("excellent");
  });

  it("treats empty benefits and requirements arrays as unmet criteria", () => {
    const result = calculateRabotajScore({ ...completeJob, benefits: [], requirements: [] });
    expect(result.score).toBe(87); // 100 - 5 (benefits) - 8 (requirements)
    expect(result.missingCriteria).toEqual(expect.arrayContaining(["benefits", "requirements"]));
    expect(result.completedCriteria).not.toContain("benefits");
    expect(result.completedCriteria).not.toContain("requirements");
  });

  it("scores a partially completed job by summing only met criteria", () => {
    const partial: RabotajScoreInput = {
      salaryDisclosed: false,
      salaryMin: 0,
      salaryMax: 0,
      verifiedEmployer: false,
      contractType: "B2B",
      workModel: "remote",
      city: "Kraków",
      country: "Polska",
      language: "",
      responsibilities: [],
      requirements: [],
      benefits: [],
      process: [],
      expectedResponseTime: undefined,
      startDate: undefined
    };
    // Only contractType(8) + workModel(5) + location(5) = 18
    const result = calculateRabotajScore(partial);
    expect(result.score).toBe(18);
    expect(result.level).toBe("low");
  });

  it("never exceeds 100 even if somehow more points were awarded", () => {
    const result = calculateRabotajScore(completeJob);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("never goes below 0", () => {
    const empty: RabotajScoreInput = {
      salaryDisclosed: false,
      salaryMin: 0,
      salaryMax: 0,
      verifiedEmployer: false,
      contractType: "" as RabotajScoreInput["contractType"],
      workModel: "" as RabotajScoreInput["workModel"],
      city: "",
      country: "",
      language: "",
      responsibilities: [],
      requirements: [],
      benefits: [],
      process: [],
      expectedResponseTime: undefined,
      startDate: undefined
    };
    const result = calculateRabotajScore(empty);
    expect(result.score).toBe(0);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.level).toBe("low");
    expect(result.completedCriteria).toHaveLength(0);
    expect(result.missingCriteria).toHaveLength(12);
  });
});

describe("getRabotajScoreLevel", () => {
  it("assigns excellent for 85-100", () => {
    expect(getRabotajScoreLevel(100)).toBe("excellent");
    expect(getRabotajScoreLevel(85)).toBe("excellent");
  });

  it("assigns good for 70-84", () => {
    expect(getRabotajScoreLevel(84)).toBe("good");
    expect(getRabotajScoreLevel(70)).toBe("good");
  });

  it("assigns average for 50-69", () => {
    expect(getRabotajScoreLevel(69)).toBe("average");
    expect(getRabotajScoreLevel(50)).toBe("average");
  });

  it("assigns low for 0-49", () => {
    expect(getRabotajScoreLevel(49)).toBe("low");
    expect(getRabotajScoreLevel(0)).toBe("low");
  });
});

describe("getMissingCriteriaSorted", () => {
  it("sorts missing criteria by points descending, highest impact first", () => {
    const result = calculateRabotajScore({
      ...completeJob,
      salaryMin: 0,
      salaryMax: 0,
      benefits: [],
      startDate: undefined
    });
    const sorted = getMissingCriteriaSorted(result);
    const points = sorted.map((c) => c.points);
    expect(points).toEqual([...points].sort((a, b) => b - a));
    expect(sorted[0].id).toBe("salaryRange");
  });
});

describe("demo job catalogue", () => {
  it("computes scores in the 0-100 range for every demo job", () => {
    for (const job of jobs) {
      const result = calculateRabotajScore(job);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    }
  });

  it("includes a spread of demo jobs across every transparency level", () => {
    const levels = jobs.map((job) => calculateRabotajScore(job).level);
    expect(levels.filter((l) => l === "excellent").length).toBeGreaterThanOrEqual(2);
    expect(levels.filter((l) => l === "good").length).toBeGreaterThanOrEqual(2);
    expect(levels.filter((l) => l === "average").length).toBeGreaterThanOrEqual(2);
    expect(levels.filter((l) => l === "low").length).toBeGreaterThanOrEqual(2);
  });
});
