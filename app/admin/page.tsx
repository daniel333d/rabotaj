import { Users, Building2, Briefcase, FileClock, ShieldCheck, FileText } from "lucide-react";
import { getAdminStats } from "@/lib/data/db-admin";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();
  if (!stats) return <p className="text-sm text-muted">Brak dostępu do statystyk.</p>;

  const cards = [
    { icon: Users, label: "Użytkownicy łącznie", value: stats.totalUsers },
    { icon: Users, label: "Kandydaci", value: stats.totalCandidates },
    { icon: Briefcase, label: "Pracodawcy", value: stats.totalEmployers },
    { icon: Building2, label: "Firmy", value: stats.totalCompanies },
    { icon: ShieldCheck, label: "Firmy zweryfikowane", value: stats.verifiedCompanies },
    { icon: FileClock, label: "Oferty oczekujące", value: stats.pendingJobs },
    { icon: Briefcase, label: "Oferty opublikowane", value: stats.publishedJobs },
    { icon: FileText, label: "Aplikacje łącznie", value: stats.totalApplications }
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">Przegląd platformy</h1>
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
    </div>
  );
}
