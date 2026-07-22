"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

type ActionResult = { ok: boolean };

async function withAdmin(run: (admin: NonNullable<ReturnType<typeof createAdminClient>>) => Promise<boolean>): Promise<ActionResult> {
  if (!(await requireAdmin())) return { ok: false };
  const admin = createAdminClient();
  if (!admin) return { ok: false };
  const ok = await run(admin);
  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/admin/companies");
  revalidatePath("/admin/users");
  return { ok };
}

export async function approveJobAction(jobId: string): Promise<ActionResult> {
  const result = await withAdmin(async (admin) => {
    const { error } = await admin
      .from("jobs")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", jobId);
    return !error;
  });
  // Published-jobs reads are cached (see lib/data/db-jobs.ts) — invalidate
  // immediately instead of waiting out the revalidate window.
  if (result.ok) revalidateTag("jobs");
  return result;
}

export async function rejectJobAction(jobId: string): Promise<ActionResult> {
  const result = await withAdmin(async (admin) => {
    const { error } = await admin.from("jobs").update({ status: "rejected" }).eq("id", jobId);
    return !error;
  });
  if (result.ok) revalidateTag("jobs");
  return result;
}

export async function verifyCompanyAction(companyId: string, verified: boolean): Promise<ActionResult> {
  const result = await withAdmin(async (admin) => {
    const { error } = await admin.from("companies").update({ verified }).eq("id", companyId);
    return !error;
  });
  if (result.ok) revalidateTag("companies");
  return result;
}

export async function blockUserAction(userId: string, blocked: boolean): Promise<ActionResult> {
  return withAdmin(async (admin) => {
    const { error } = await admin.from("profiles").update({ is_blocked: blocked }).eq("id", userId);
    return !error;
  });
}
