"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search, MapPin } from "lucide-react";
import type { Job } from "@/lib/data/jobs";
import { applyFilters, defaultFilters, getFilterOptions, sortJobs, type FilterState, type SortOption } from "@/lib/filters";
import { JobCard } from "@/components/jobs/JobCard";
import { FilterPanel } from "@/components/jobs/FilterPanel";
import { Pagination } from "@/components/ui/Pagination";
import { useI18n } from "@/lib/i18n/context";

const PAGE_SIZE = 6;

export function JobsPageClient({ jobs }: { jobs: Job[] }) {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const filterOptions = useMemo(() => getFilterOptions(jobs), [jobs]);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [locationQuery, setLocationQuery] = useState(searchParams.get("loc") ?? "");
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    workMode: searchParams.get("remote") === "1" ? "remote" : "",
    accommodationOnly: searchParams.get("accommodation") === "1",
    industry: searchParams.get("industry") ?? "",
    experience: searchParams.get("experience") ?? "",
    country: searchParams.get("country") ?? ""
  }));
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const result = applyFilters(jobs, query, filters, locationQuery);
    return sortJobs(result, sort);
  }, [jobs, query, locationQuery, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateFilters(next: FilterState) {
    setFilters(next);
    setPage(1);
  }

  return (
    <div className="bg-surface">
      <div className="container-page py-10 sm:py-14">
        <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">{t.jobsPage.title}</h1>
        <p className="mt-1.5 text-sm text-muted">
          {filtered.length} {t.jobsPage.resultsCount}
        </p>

        <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-border bg-white p-2 shadow-card sm:flex-row sm:items-center">
          <label className="flex flex-1 items-center gap-3 rounded-xl px-3 py-2.5">
            <Search size={18} className="shrink-0 text-muted" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder={t.hero.positionPlaceholder}
              className="w-full border-none bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
            />
          </label>
          <div className="hidden h-8 w-px bg-border sm:block" aria-hidden="true" />
          <label className="flex flex-1 items-center gap-3 rounded-xl px-3 py-2.5">
            <MapPin size={18} className="shrink-0 text-muted" aria-hidden="true" />
            <input
              value={locationQuery}
              onChange={(event) => {
                setLocationQuery(event.target.value);
                setPage(1);
              }}
              placeholder={t.hero.locationPlaceholder}
              className="w-full border-none bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-soft">
              <FilterPanel filters={filters} onChange={updateFilters} options={filterOptions} />
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink lg:hidden"
              >
                <SlidersHorizontal size={16} aria-hidden="true" />
                {t.common.filters}
              </button>

              <label className="ml-auto flex min-w-0 items-center gap-2 text-sm text-muted">
                {t.common.sortBy}
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOption)}
                  className="max-w-full rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
                >
                  <option value="newest">{t.jobsPage.sortNewest}</option>
                  <option value="salary-high">{t.jobsPage.sortSalaryHigh}</option>
                  <option value="match">{t.jobsPage.sortMatch}</option>
                  <option value="score-high">{t.rabotajScore.sortHighestScore}</option>
                </select>
              </label>
            </div>

            {pageItems.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {pageItems.map((job) => (
                  <JobCard key={job.slug} job={job} />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-white p-14 text-center text-sm text-muted">
                {t.jobsPage.noResults}
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/40" onClick={() => setMobileFiltersOpen(false)} aria-hidden="true" />
          <div className="animate-fade-in absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-elevated">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-heading text-base font-bold text-ink">{t.jobsPage.filtersTitle}</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-ink"
                aria-label={t.common.close}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <FilterPanel filters={filters} onChange={updateFilters} options={filterOptions} hideTitle />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-xl bg-brand py-3.5 text-sm font-bold text-white"
            >
              {t.common.showResults} ({filtered.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
