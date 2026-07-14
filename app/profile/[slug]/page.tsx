import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Plane, Languages, Wrench, Wallet, CalendarDays } from "lucide-react";
import { getPublicCandidateProfile } from "@/lib/data/db-candidate";
import { workModelLabel } from "@/lib/format";
import type { WorkModel } from "@/lib/data/jobs";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublicCandidateProfile(slug);
  if (!profile) return { title: "Profil — Rabotaj.com" };
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
  return { title: `${name || "Career Passport"} — Rabotaj.com`, description: profile.professionalTitle ?? undefined };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getPublicCandidateProfile(slug);
  if (!profile) notFound();

  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Career Passport";
  const initials = (profile.firstName?.[0] ?? "") + (profile.lastName?.[0] ?? "") || "??";

  return (
    <div className="bg-surface">
      <div className="container-page max-w-2xl py-12 sm:py-16">
        <div className="rounded-2xl border border-border bg-white p-7 shadow-elevated">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-navy font-heading text-xl font-bold text-white">
              {initials.toUpperCase()}
            </span>
            <div>
              <p className="font-heading text-lg font-bold text-ink">{name}</p>
              {profile.professionalTitle && <p className="text-sm text-muted">{profile.professionalTitle}</p>}
              {(profile.city || profile.country) && (
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                  <MapPin size={12} aria-hidden="true" /> {[profile.city, profile.country].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </div>

          {profile.summary && <p className="mt-5 text-sm leading-6 text-ink/80">{profile.summary}</p>}

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
            <Field icon={Plane} label="Gotowość do relokacji" value={profile.relocationReady ? "Tak" : "Nie"} />
            <Field
              icon={Languages}
              label="Języki"
              value={profile.languages.length > 0 ? profile.languages.map((l) => l.languageCode.toUpperCase()).join(", ") : "—"}
            />
            <Field
              icon={Wrench}
              label="Umiejętności"
              value={profile.skills.length > 0 ? profile.skills.map((s) => s.skillName).join(", ") : "—"}
            />
            <Field
              icon={Wallet}
              label="Oczekiwane wynagrodzenie"
              value={
                profile.expectedSalaryMin && profile.expectedSalaryMax
                  ? `${profile.expectedSalaryMin}–${profile.expectedSalaryMax} ${profile.salaryCurrency}`
                  : "—"
              }
            />
            {profile.preferredWorkMode && (
              <Field icon={CalendarDays} label="Model pracy" value={workModelLabel(profile.preferredWorkMode as WorkModel)} />
            )}
          </dl>

          <div className="mt-6 border-t border-border pt-5">
            <div className="flex items-center justify-between text-xs font-semibold text-ink">
              <span>Kompletność profilu</span>
              <span className="text-success">{profile.profileCompletion}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-success" style={{ width: `${profile.profileCompletion}%` }} />
            </div>
          </div>
        </div>

        {profile.experience.length > 0 && (
          <section className="mt-8">
            <h2 className="font-heading text-lg font-bold text-ink">Doświadczenie</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {profile.experience.map((item, index) => (
                <li key={index} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                  <p className="text-sm font-bold text-ink">{item.position}</p>
                  <p className="text-xs text-muted">
                    {item.companyName} · {item.startDate.slice(0, 7)} – {item.isCurrent ? "obecnie" : item.endDate?.slice(0, 7) ?? ""}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {profile.education.length > 0 && (
          <section className="mt-8">
            <h2 className="font-heading text-lg font-bold text-ink">Wykształcenie</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {profile.education.map((item, index) => (
                <li key={index} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
                  <p className="text-sm font-bold text-ink">{item.institution}</p>
                  <p className="text-xs text-muted">{[item.degree, item.field].filter(Boolean).join(" · ")}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div>
      <dt className="inline-flex items-center gap-1.5 text-xs text-muted">
        <Icon size={13} aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-ink">{value}</dd>
    </div>
  );
}
