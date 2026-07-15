import { z } from "zod";

// Postgres' `uuid` column accepts any 8-4-4-4-12 hex string, including the
// hand-authored fixture ids used by supabase/seed.sql (e.g. d0000000-0000-…),
// which don't carry an RFC 4122 version nibble. Zod's built-in `.uuid()`
// enforces that nibble, so we match the shape only — the real safety
// boundary is the DB foreign key + RLS, not this format check.
const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const applicationSchema = z.object({
  jobId: z.string().regex(uuidLike, "Nieprawidłowy identyfikator oferty"),
  message: z.string().trim().max(2000).optional(),
  expectedSalary: z.coerce.number().int().nonnegative().nullable().optional(),
  availabilityDate: z.string().trim().optional()
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

/** Statuses an employer may move an application to — 'withdrawn' is candidate-only. */
export const employerApplicationStatusSchema = z.enum([
  "submitted",
  "viewed",
  "shortlisted",
  "interview",
  "offer",
  "hired",
  "rejected"
]);

export type EmployerApplicationStatus = z.infer<typeof employerApplicationStatusSchema>;
