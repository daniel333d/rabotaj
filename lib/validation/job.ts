import { z } from "zod";

export const workModeSchema = z.enum(["remote", "hybrid", "onsite"]);
export const contractTypeSchema = z.enum(["employment", "b2b", "mandate", "temporary"]);
export const experienceLevelSchema = z.enum(["no_experience", "junior", "mid", "senior"]);
export const salaryPeriodSchema = z.enum(["month", "year", "hour"]);

const lineListSchema = z.array(z.string().trim().min(1)).max(20);

/** Slugs are derived from the job title but are user-editable, so validate the format directly. */
export const slugSchema = z
  .string()
  .trim()
  .min(3, "Slug musi mieć co najmniej 3 znaki")
  .max(120)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug może zawierać tylko małe litery, cyfry i myślniki");

/** Every field the job wizard collects, as one flat object — steps are `.pick()`s of this. */
const jobFieldsSchema = z.object({
  title: z.string().trim().min(3, "Podaj tytuł stanowiska").max(140),
  slug: slugSchema,
  country: z.string().trim().min(1, "Podaj kraj").max(80),
  city: z.string().trim().min(1, "Podaj miasto").max(80),
  workMode: workModeSchema,
  contractType: contractTypeSchema,
  salaryMin: z.coerce.number().int().nonnegative().nullable().optional(),
  salaryMax: z.coerce.number().int().nonnegative().nullable().optional(),
  salaryCurrency: z.string().trim().length(3, "Użyj kodu waluty, np. PLN").default("PLN"),
  salaryPeriod: salaryPeriodSchema.default("month"),
  experienceLevel: experienceLevelSchema,
  workLanguage: z.string().trim().max(120).optional(),
  requirements: lineListSchema,
  niceToHave: lineListSchema,
  noExperienceRequired: z.boolean().default(false),
  description: z.string().trim().min(40, "Opis powinien mieć co najmniej 40 znaków").max(4000),
  responsibilities: lineListSchema,
  benefits: lineListSchema,
  accommodationProvided: z.boolean().default(false),
  recruitmentProcess: lineListSchema,
  responseTimeDays: z.coerce.number().int().positive().max(60).nullable().optional(),
  startDate: z.string().trim().optional()
});

export const jobStepBasicsSchema = jobFieldsSchema.pick({ title: true, slug: true });
export const jobStepLocationSchema = jobFieldsSchema.pick({ country: true, city: true, workMode: true });
export const jobStepCompensationSchema = jobFieldsSchema
  .pick({ contractType: true, salaryMin: true, salaryMax: true, salaryCurrency: true, salaryPeriod: true })
  .refine((data) => !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax, {
    message: "Wynagrodzenie „od” nie może być wyższe niż „do”",
    path: ["salaryMax"]
  });
export const jobStepRequirementsSchema = jobFieldsSchema.pick({
  experienceLevel: true,
  workLanguage: true,
  requirements: true,
  niceToHave: true,
  noExperienceRequired: true
});
export const jobStepDescriptionSchema = jobFieldsSchema.pick({ description: true, responsibilities: true });
export const jobStepBenefitsSchema = jobFieldsSchema.pick({ benefits: true, accommodationProvided: true });
export const jobStepProcessSchema = jobFieldsSchema.pick({
  recruitmentProcess: true,
  responseTimeDays: true,
  startDate: true
});

/** Full job payload — validated together server-side before insert/update. */
export const jobSchema = jobFieldsSchema.refine(
  (data) => !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax,
  { message: "Wynagrodzenie „od” nie może być wyższe niż „do”", path: ["salaryMax"] }
);

export type JobInput = z.infer<typeof jobSchema>;
