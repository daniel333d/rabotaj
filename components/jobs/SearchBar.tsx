"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function SearchBar({ className, initialQuery = "", initialLocation = "" }: { className?: string; initialQuery?: string; initialLocation?: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location.trim()) params.set("loc", location.trim());
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full flex-col gap-2 rounded-2xl border border-border bg-white p-2 shadow-elevated sm:flex-row sm:items-center",
        className
      )}
    >
      <label className="flex flex-1 items-center gap-3 rounded-xl px-3 py-3 sm:py-2">
        <Search size={19} className="shrink-0 text-muted" aria-hidden="true" />
        <span className="sr-only">{t.hero.positionLabel}</span>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.hero.positionPlaceholder}
          className="w-full border-none bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
        />
      </label>
      <div className="hidden h-8 w-px bg-border sm:block" aria-hidden="true" />
      <label className="flex flex-1 items-center gap-3 rounded-xl px-3 py-3 sm:py-2">
        <MapPin size={19} className="shrink-0 text-muted" aria-hidden="true" />
        <span className="sr-only">{t.hero.locationLabel}</span>
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder={t.hero.locationPlaceholder}
          className="w-full border-none bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="w-full shrink-0 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700 sm:w-auto sm:py-3"
      >
        {t.hero.cta}
      </button>
    </form>
  );
}
