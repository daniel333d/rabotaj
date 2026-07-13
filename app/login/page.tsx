"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/lib/toast-context";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    showToast("Zalogowano (wersja demonstracyjna)");
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-surface px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-elevated">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
          <LogIn size={20} aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-heading text-xl font-extrabold text-ink">{t.auth.loginTitle}</h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Field label={t.auth.email} type="email" value={email} onChange={setEmail} required />
          <Field label={t.auth.password} type="password" value={password} onChange={setPassword} required />
          <Button type="submit" variant="primary" className="mt-2 w-full">
            {t.auth.loginCta}
          </Button>
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
  type,
  value,
  onChange,
  required
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
      />
    </label>
  );
}
