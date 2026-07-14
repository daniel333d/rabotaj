"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { UserPlus, AlertCircle, CheckCircle2, Search, Briefcase } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { registerAction, type ActionState } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const initialState: ActionState = {};

function errorKey(error?: string) {
  switch (error) {
    case "backend-not-configured":
      return "backendNotConfigured";
    case "email-already-registered":
      return "emailAlreadyRegistered";
    default:
      return error ? "genericError" : undefined;
  }
}

export default function RegisterPage() {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const [role, setRole] = useState<"candidate" | "employer">("candidate");
  const key = errorKey(state.error);

  if (state.success && state.message === "check-email") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-surface px-6 py-16">
        <div className="flex w-full max-w-sm items-start gap-3 rounded-2xl border border-success/30 bg-green-50 p-6 shadow-elevated">
          <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
          <p className="text-sm font-semibold text-ink">{t.auth.registerSuccessCheckEmail}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-surface px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-elevated">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
          <UserPlus size={20} aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-heading text-xl font-extrabold text-ink">{t.auth.registerTitle}</h1>

        {key && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700" role="alert">
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            {t.auth[key as keyof typeof t.auth]}
          </div>
        )}

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div>
            <span className="text-xs font-semibold text-ink">{t.auth.roleQuestion}</span>
            <input type="hidden" name="role" value={role} />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <RoleOption
                icon={Search}
                label={t.auth.roleCandidate}
                active={role === "candidate"}
                onClick={() => setRole("candidate")}
              />
              <RoleOption
                icon={Briefcase}
                label={t.auth.roleEmployer}
                active={role === "employer"}
                onClick={() => setRole("employer")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t.auth.firstName} name="firstName" type="text" required />
            <Field label={t.auth.lastName} name="lastName" type="text" required />
          </div>
          <Field label={t.auth.email} name="email" type="email" required />
          <Field label={t.auth.password} name="password" type="password" required />
          <Field label={t.auth.confirmPassword} name="confirmPassword" type="password" required />

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? t.common.loading : t.auth.registerCta}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {t.auth.haveAccount}{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            {t.auth.loginLink}
          </Link>
        </p>
      </div>
    </div>
  );
}

function RoleOption({
  icon: Icon,
  label,
  active,
  onClick
}: {
  icon: typeof Search;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-semibold transition-colors duration-150",
        active ? "border-brand bg-brand-light text-brand" : "border-border text-muted hover:border-brand hover:text-brand"
      )}
    >
      <Icon size={16} aria-hidden="true" />
      {label}
    </button>
  );
}

function Field({
  label,
  name,
  type,
  required
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
      />
    </label>
  );
}
