import { z } from "zod";

/** 'admin' is intentionally not part of this union — it can never be chosen at signup. */
export const signupRoleSchema = z.enum(["candidate", "employer"]);
export type SignupRole = z.infer<typeof signupRoleSchema>;

export const registerSchema = z
  .object({
    role: signupRoleSchema,
    firstName: z.string().trim().min(1, "Podaj imię").max(80),
    lastName: z.string().trim().min(1, "Podaj nazwisko").max(80),
    email: z.string().trim().min(1, "Podaj adres e-mail").email("Nieprawidłowy adres e-mail"),
    password: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać wielką literę")
      .regex(/[0-9]/, "Hasło musi zawierać cyfrę"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"]
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Podaj adres e-mail").email("Nieprawidłowy adres e-mail"),
  password: z.string().min(1, "Podaj hasło")
});

export type LoginInput = z.infer<typeof loginSchema>;

export const requestPasswordResetSchema = z.object({
  email: z.string().trim().min(1, "Podaj adres e-mail").email("Nieprawidłowy adres e-mail")
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać wielką literę")
      .regex(/[0-9]/, "Hasło musi zawierać cyfrę"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"]
  });
