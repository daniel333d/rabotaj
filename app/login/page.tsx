"use client";

import { useActionState } from "react";
import Link from "next/link";
import { LogIn, AlertCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { loginAction, type ActionState } from "@/lib/actions/auth";

const initialState: ActionState = {};

function errorKey(error?: string) {
  switch (error) {
    case "backend-not-configured":
      return "backendNotConfigured";
    case "invalid-credentials":
      return "invalidCredentials";
    case "account-blocked":
      return "accountBlocked";
    default:
      return error ? "genericError" : undefined;
  }
}

export default function LoginPage() {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const key = errorKey(state.error);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-surface px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-elevated">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
          <LogIn size={20} aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-heading text-xl font-extrabold text-ink">{t.auth.loginTitle}</h1>

        {key && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700" role="alert">
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            {t.auth[key as keyof typeof t.auth]}
          </div>
        )}

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <Field label={t.auth.email} name="email" type="email" required />
          <Field label={t.auth.password} name="password" type="password" required />
          <div className="text-right">
            <Link href="/reset-password" className="text-xs font-semibold text-brand hover:underline">
              {t.auth.forgotPassword}
            </Link>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? t.common.loading : t.auth.loginCta}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {t.auth.noAccount}{" "}
          <Link href="/register" className="font-semibold text-brand hover:underline">
            {t.auth.registerLink}
          </Link>
        </p>
      </div>
    </div>
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
