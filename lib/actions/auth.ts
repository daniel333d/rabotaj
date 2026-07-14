"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { loginSchema, registerSchema, requestPasswordResetSchema, updatePasswordSchema } from "@/lib/validation/auth";
import { getPostAuthRedirect } from "@/lib/auth/redirect";
import type { UserRole } from "@/lib/supabase/database.types";

export type ActionState = {
  error?: string;
  success?: boolean;
  message?: string;
};

async function getOrigin() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}

export async function registerAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: "backend-not-configured" };

  const parsed = registerSchema.safeParse({
    role: formData.get("role"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "invalid-input" };
  }

  const supabase = await createClient();
  if (!supabase) return { error: "backend-not-configured" };

  const origin = await getOrigin();
  const { role, firstName, lastName, email, password } = parsed.data;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, first_name: firstName, last_name: lastName },
      emailRedirectTo: `${origin}/auth/callback`
    }
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "email-already-registered" };
    }
    return { error: "generic-error" };
  }

  // Email confirmation disabled on the project -> session is already active.
  if (data.session) {
    redirect(getPostAuthRedirect(role as UserRole));
  }

  return { success: true, message: "check-email" };
}

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: "backend-not-configured" };

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "invalid-input" };
  }

  const supabase = await createClient();
  if (!supabase) return { error: "backend-not-configured" };

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { error: "invalid-credentials" };
  }

  const { data: profile } = await supabase.from("profiles").select("role, is_blocked").eq("id", data.user.id).single();

  if (profile?.is_blocked) {
    await supabase.auth.signOut();
    return { error: "account-blocked" };
  }

  redirect(getPostAuthRedirect((profile?.role as UserRole) ?? "candidate"));
}

export async function logoutAction() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordResetAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: "backend-not-configured" };

  const parsed = requestPasswordResetSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "invalid-input" };
  }

  const supabase = await createClient();
  if (!supabase) return { error: "backend-not-configured" };

  const origin = await getOrigin();
  // Supabase intentionally does not reveal whether the address is registered.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`
  });

  return { success: true, message: "reset-email-sent" };
}

export async function updatePasswordAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: "backend-not-configured" };

  const parsed = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "invalid-input" };
  }

  const supabase = await createClient();
  if (!supabase) return { error: "backend-not-configured" };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: "generic-error" };

  return { success: true, message: "password-updated" };
}
