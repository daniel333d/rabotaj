import { z } from "zod";

const currentYear = new Date().getFullYear();

export const companySlugSchema = z
  .string()
  .trim()
  .min(2, "Slug musi mieć co najmniej 2 znaki")
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug może zawierać tylko małe litery, cyfry i myślniki");

export const companySchema = z.object({
  name: z.string().trim().min(2, "Podaj nazwę firmy").max(120),
  slug: companySlugSchema,
  description: z.string().trim().max(2000).optional(),
  industry: z.string().trim().max(120).optional(),
  website: z
    .string()
    .trim()
    .url("Podaj poprawny adres URL, np. https://firma.pl")
    .max(255)
    .optional()
    .or(z.literal("")),
  country: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
  employeeCount: z.string().trim().max(40).optional(),
  foundedYear: z.coerce.number().int().min(1800).max(currentYear).nullable().optional()
});

export type CompanyInput = z.infer<typeof companySchema>;
