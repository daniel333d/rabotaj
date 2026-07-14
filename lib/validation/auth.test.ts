import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema, signupRoleSchema } from "@/lib/validation/auth";

describe("signupRoleSchema", () => {
  it("accepts candidate and employer", () => {
    expect(signupRoleSchema.safeParse("candidate").success).toBe(true);
    expect(signupRoleSchema.safeParse("employer").success).toBe(true);
  });

  it("rejects admin — admin can never be self-assigned at signup", () => {
    expect(signupRoleSchema.safeParse("admin").success).toBe(false);
  });

  it("rejects arbitrary strings", () => {
    expect(signupRoleSchema.safeParse("superuser").success).toBe(false);
  });
});

describe("registerSchema", () => {
  const base = {
    role: "candidate" as const,
    firstName: "Anna",
    lastName: "Kowalska",
    email: "anna@example.com",
    password: "Password1",
    confirmPassword: "Password1"
  };

  it("accepts a valid registration payload", () => {
    expect(registerSchema.safeParse(base).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({ ...base, confirmPassword: "Different1" });
    expect(result.success).toBe(false);
  });

  it("rejects a password without an uppercase letter", () => {
    const result = registerSchema.safeParse({ ...base, password: "password1", confirmPassword: "password1" });
    expect(result.success).toBe(false);
  });

  it("rejects a password without a digit", () => {
    const result = registerSchema.safeParse({ ...base, password: "Password", confirmPassword: "Password" });
    expect(result.success).toBe(false);
  });

  it("rejects role 'admin' even if forged into the payload", () => {
    const result = registerSchema.safeParse({ ...base, role: "admin" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({ ...base, email: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts a valid login payload", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "anything" }).success).toBe(true);
  });

  it("rejects an empty password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });
});
