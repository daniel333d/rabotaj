import { z } from "zod";

export const applicationSchema = z.object({
  jobId: z.string().uuid("Nieprawidłowy identyfikator oferty"),
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
