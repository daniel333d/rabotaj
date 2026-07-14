import Link from "next/link";
import { Briefcase, Clock3, FileClock, Users } from "lucide-react";
import { getSessionProfile } from "@/lib/auth/session";
import { getEmployerCompany, getEmployerStats } from "@/lib/data/db-employer";

export default async function EmployerDashboardPage() {
  const profile = await getSessionProfile();
  if (!profile) return null;

  const company = await getEmployerCompany(profile.id);

  if (!company) {
    return (
      <div className="max-w-md rounded-2xl border border-dashed border-border bg-white p-10 text-center">
        <p className="text-sm text-muted">Nie masz jeszcze profilu firmy.</p>
        <Link
          href="/employer/company"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700"
        >
          Utwórz profil firmy
        </Link>
      </div>
    );
  }

  const stats = await getEmployerStats(company.id);

  const cards = [
    { icon: Briefcase, label: "Opublikowane oferty", value: stats.published },
    { icon: FileClock, label: "Oczekujące na moderację", value: stats.pendingReview },
    { icon: Clock3, label: "Szkice", value: stats.draft },
    { icon: Users, label: "Aplikacje łącznie", value: stats.totalApplications }
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">Witaj, {company.name}</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand">
              <card.icon size={18} aria-hidden="true" />
            </span>
            <p className="mt-3 font-heading text-2xl font-extrabold text-ink">{card.value}</p>
            <p className="text-xs text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/employer/jobs/new"
          className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700"
        >
          + Dodaj ogłoszenie
        </Link>
        <Link
          href="/employer/jobs"
          className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-5 py-3 text-sm font-bold text-ink transition-colors duration-200 hover:border-brand hover:text-brand"
        >
          Zobacz wszystkie oferty
        </Link>
      </div>
    </div>
  );
}
