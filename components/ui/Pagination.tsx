"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  onChange
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Paginacja">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-ink transition-colors duration-150 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Poprzednia strona"
      >
        <ChevronLeft size={17} aria-hidden="true" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-semibold transition-colors duration-150",
            p === page ? "border-brand bg-brand text-white" : "border-border text-ink hover:border-brand hover:text-brand"
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-ink transition-colors duration-150 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Następna strona"
      >
        <ChevronRight size={17} aria-hidden="true" />
      </button>
    </nav>
  );
}
