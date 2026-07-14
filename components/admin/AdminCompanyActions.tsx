"use client";

import { useState, useTransition } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { useToast } from "@/lib/toast-context";
import { verifyCompanyAction } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

export function AdminCompanyActions({ companyId, verified }: { companyId: string; verified: boolean }) {
  const { showToast } = useToast();
  const [value, setValue] = useState(verified);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !value;
    startTransition(async () => {
      const result = await verifyCompanyAction(companyId, next);
      if (result.ok) {
        setValue(next);
        showToast(next ? "Firma zweryfikowana" : "Cofnięto weryfikację firmy");
      }
    });
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors duration-150 disabled:opacity-60",
        value ? "border-success/30 bg-green-50 text-success hover:bg-green-100" : "border-border bg-white text-ink hover:border-brand hover:text-brand"
      )}
    >
      {value ? <ShieldCheck size={12} aria-hidden="true" /> : <ShieldOff size={12} aria-hidden="true" />}
      {value ? "Zweryfikowana" : "Zweryfikuj"}
    </button>
  );
}
