"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { localeOptions, useI18n } from "@/lib/i18n/context";
import { useToast } from "@/lib/toast-context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-ink transition-colors duration-200 hover:border-brand hover:text-brand"
      >
        <Globe size={16} aria-hidden="true" />
        {locale.toUpperCase()}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="animate-fade-in absolute right-0 top-full z-30 mt-2 w-40 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-elevated"
        >
          {localeOptions.map((option) => (
            <li key={option.code}>
              <button
                type="button"
                role="option"
                aria-selected={locale === option.code}
                onClick={() => {
                  setLocale(option.code);
                  setOpen(false);
                  showToast(t.toast.languageChanged);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium transition-colors duration-150 hover:bg-brand-light hover:text-brand",
                  locale === option.code ? "text-brand" : "text-ink"
                )}
              >
                {option.label}
                <span className="text-xs text-muted">{option.code.toUpperCase()}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
