import { z } from "zod";

/** Loose E.164-ish check — accepts spaces/dashes, requires a leading + and 7-15 digits. */
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9][0-9\s-]{6,17}$/, "Podaj poprawny numer telefonu, np. +48 600 000 000");

export const candidateBasicsSchema = z.object({
  professionalTitle: z.string().trim().min(2, "Podaj tytuł zawodowy").max(120),
  summary: z.string().trim().max(1500).optional(),
  country: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
  phone: phoneSchema.optional().or(z.literal(""))
});

export const candidatePreferencesSchema = z
  .object({
    expectedSalaryMin: z.coerce.number().int().nonnegative().nullable().optional(),
    expectedSalaryMax: z.coerce.number().int().nonnegative().nullable().optional(),
    salaryCurrency: z.string().trim().length(3).default("PLN"),
    preferredWorkMode: z.enum(["remote", "hybrid", "onsite"]).nullable().optional(),
    relocationReady: z.boolean().default(false),
    availabilityDate: z.string().trim().optional(),
    isPublic: z.boolean().default(false)
  })
  .refine(
    (data) => !data.expectedSalaryMin || !data.expectedSalaryMax || data.expectedSalaryMin <= data.expectedSalaryMax,
    { message: "Wynagrodzenie „od” nie może być wyższe niż „do”", path: ["expectedSalaryMax"] }
  );

export const experienceSchema = z
  .object({
    companyName: z.string().trim().min(1, "Podaj nazwę firmy").max(140),
    position: z.string().trim().min(1, "Podaj stanowisko").max(140),
    location: z.string().trim().max(120).optional(),
    startDate: z.string().trim().min(1, "Podaj datę rozpoczęcia"),
    endDate: z.string().trim().optional(),
    isCurrent: z.boolean().default(false),
    description: z.string().trim().max(1000).optional()
  })
  .refine((data) => data.isCurrent || Boolean(data.endDate), {
    message: "Podaj datę zakończenia lub zaznacz „nadal pracuję”",
    path: ["endDate"]
  });

export const educationSchema = z.object({
  institution: z.string().trim().min(1, "Podaj nazwę uczelni/szkoły").max(140),
  field: z.string().trim().max(140).optional(),
  degree: z.string().trim().max(80).optional(),
  startDate: z.string().trim().min(1, "Podaj datę rozpoczęcia"),
  endDate: z.string().trim().optional()
});

export const skillSchema = z.object({
  skillName: z.string().trim().min(1, "Podaj nazwę umiejętności").max(80),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
  yearsExperience: z.coerce.number().min(0).max(50).optional()
});

export const languageSchema = z.object({
  languageCode: z.string().trim().min(2, "Podaj język").max(10),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2", "native"])
});
