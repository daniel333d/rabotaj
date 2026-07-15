import { describe, expect, it } from "vitest";
import { applicationSchema, employerApplicationStatusSchema } from "@/lib/validation/application";

describe("applicationSchema", () => {
  it("accepts a minimal valid payload", () => {
    expect(applicationSchema.safeParse({ jobId: "550e8400-e29b-41d4-a716-446655440000" }).success).toBe(true);
  });

  it("rejects a non-UUID jobId", () => {
    expect(applicationSchema.safeParse({ jobId: "not-a-uuid" }).success).toBe(false);
  });

  it("accepts hand-authored fixture ids without an RFC 4122 version nibble", () => {
    // Matches the seed data in supabase/seed.sql (e.g. d0000000-0000-0000-0000-000000000002).
    expect(applicationSchema.safeParse({ jobId: "d0000000-0000-0000-0000-000000000002" }).success).toBe(true);
  });

  it("rejects a negative expected salary", () => {
    const result = applicationSchema.safeParse({
      jobId: "550e8400-e29b-41d4-a716-446655440000",
      expectedSalary: -100
    });
    expect(result.success).toBe(false);
  });
});

describe("employerApplicationStatusSchema", () => {
  it("accepts every employer-manageable status", () => {
    for (const status of ["submitted", "viewed", "shortlisted", "interview", "offer", "hired", "rejected"]) {
      expect(employerApplicationStatusSchema.safeParse(status).success).toBe(true);
    }
  });

  it("rejects 'withdrawn' — that transition is candidate-only", () => {
    expect(employerApplicationStatusSchema.safeParse("withdrawn").success).toBe(false);
  });
});
