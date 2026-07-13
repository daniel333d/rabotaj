"use client";

import { useI18n } from "@/lib/i18n/context";
import { defaultFilters, filterOptions, type FilterState } from "@/lib/filters";

export function FilterPanel({
  filters,
  onChange,
  hideTitle = false
}: {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  hideTitle?: boolean;
}) {
  const { t } = useI18n();

  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className={`flex items-center ${hideTitle ? "justify-end" : "justify-between"}`}>
        {!hideTitle && <h2 className="font-heading text-base font-bold text-ink">{t.jobsPage.filtersTitle}</h2>}
        <button
          type="button"
          onClick={() => onChange(defaultFilters)}
          className="text-xs font-semibold text-brand hover:underline"
        >
          {t.common.clearFilters}
        </button>
      </div>

      <Select
        label={t.jobsPage.filterCountry}
        value={filters.country}
        onChange={(value) => update("country", value)}
        options={filterOptions.countries}
      />
      <Select
        label={t.jobsPage.filterCity}
        value={filters.city}
        onChange={(value) => update("city", value)}
        options={filterOptions.cities}
      />

      <Toggle
        label={t.jobsPage.filterRemote}
        checked={filters.remoteOnly}
        onChange={(value) => update("remoteOnly", value)}
      />

      <div>
        <label htmlFor="filter-salary" className="text-xs font-semibold text-ink">
          {t.jobsPage.filterSalary}: {filters.minSalary > 0 ? `od ${new Intl.NumberFormat("pl-PL").format(filters.minSalary)}` : "dowolne"}
        </label>
        <input
          id="filter-salary"
          type="range"
          min={0}
          max={20000}
          step={1000}
          value={filters.minSalary}
          onChange={(event) => update("minSalary", Number(event.target.value))}
          className="mt-2 w-full accent-brand"
        />
      </div>

      <Select
        label={t.jobsPage.filterContract}
        value={filters.contractType}
        onChange={(value) => update("contractType", value)}
        options={filterOptions.contractTypes}
      />
      <Select
        label={t.jobsPage.filterExperience}
        value={filters.experience}
        onChange={(value) => update("experience", value)}
        options={filterOptions.experiences}
      />
      <Select
        label={t.jobsPage.filterLanguage}
        value={filters.language}
        onChange={(value) => update("language", value)}
        options={filterOptions.languages}
      />
      <Select
        label={t.jobsPage.filterIndustry}
        value={filters.industry}
        onChange={(value) => update("industry", value)}
        options={filterOptions.industries}
      />

      <Toggle
        label={t.jobsPage.filterVerified}
        checked={filters.verifiedOnly}
        onChange={(value) => update("verifiedOnly", value)}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-ink">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
      >
        <option value="">Wszystkie</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-brand" : "bg-border"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
