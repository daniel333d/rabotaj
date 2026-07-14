"use client";

import { useState, useTransition } from "react";
import { Ban, CheckCircle2 } from "lucide-react";
import { useToast } from "@/lib/toast-context";
import { blockUserAction } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

export function AdminUserActions({ userId, blocked }: { userId: string; blocked: boolean }) {
  const { showToast } = useToast();
  const [value, setValue] = useState(blocked);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !value;
    startTransition(async () => {
      const result = await blockUserAction(userId, next);
      if (result.ok) {
        setValue(next);
        showToast(next ? "Użytkownik zablokowany" : "Użytkownik odblokowany");
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
        value ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100" : "border-border bg-white text-ink hover:border-red-300 hover:text-red-600"
      )}
    >
      {value ? <CheckCircle2 size={12} aria-hidden="true" /> : <Ban size={12} aria-hidden="true" />}
      {value ? "Odblokuj" : "Zablokuj"}
    </button>
  );
}
