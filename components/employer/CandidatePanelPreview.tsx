import { MoreHorizontal } from "lucide-react";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { MatchRing } from "@/components/ui/MatchRing";

const CANDIDATES = [
  { initials: "AK", color: "#2563EB", name: "Anna Kowalska", title: "UX/UI Designer · Kraków", match: 92, status: "Zaproszenie na rozmowę", tone: "blue" },
  { initials: "MN", color: "#16A36A", name: "Marek Nowicki", title: "Kierowca C+E · Gdańsk", match: 85, status: "Kandydat zakwalifikowany", tone: "green" },
  { initials: "JW", color: "#7C3AED", name: "Julia Wiśniewska", title: "Frontend Developer · Warszawa", match: 78, status: "Profil wyświetlony", tone: "neutral" },
  { initials: "PK", color: "#0891B2", name: "Piotr Kamiński", title: "Operator CNC · Gdynia", match: 74, status: "Aplikacja wysłana", tone: "neutral" }
] as const;

const TONE_CLASS: Record<string, string> = {
  blue: "bg-brand-light text-brand",
  green: "bg-green-50 text-success",
  neutral: "bg-surface text-muted border border-border"
};

export function CandidatePanelPreview() {
  return (
    <section className="bg-white">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand">Panel kandydatów</p>
            <h2 className="mt-3 font-heading text-2xl font-extrabold text-ink sm:text-3xl">
              Wszyscy kandydaci w jednym miejscu
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted">
              Przeglądaj zgłoszenia do swoich ofert, sprawdzaj dopasowanie kandydata i zmieniaj status rekrutacji bez
              przełączania się między arkuszami czy skrzynką e-mail.
            </p>
          </div>

          <div className="min-w-0 animate-fade-in rounded-2xl border border-border bg-surface/60 p-4 shadow-elevated sm:p-6">
            <div className="flex items-center justify-between px-1 pb-3">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Kandydaci · Senior Frontend Developer</p>
              <span className="text-xs font-semibold text-muted">4 z 12</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {CANDIDATES.map((candidate) => (
                <div key={candidate.name} className="flex items-center gap-3 rounded-xl border border-border bg-white p-3.5">
                  <CompanyLogo initials={candidate.initials} color={candidate.color} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">{candidate.name}</p>
                    <p className="truncate text-xs text-muted">{candidate.title}</p>
                  </div>
                  <MatchRing percent={candidate.match} size={34} />
                  <span className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline-block ${TONE_CLASS[candidate.tone]}`}>
                    {candidate.status}
                  </span>
                  <MoreHorizontal size={16} className="shrink-0 text-muted" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
