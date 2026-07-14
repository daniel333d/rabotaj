"use client";

import { useActionState, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import {
  FileText,
  Bookmark,
  CalendarCheck,
  Gauge,
  ChevronRight,
  X,
  Bell,
  Settings as SettingsIcon,
  LayoutGrid,
  IdCard,
  FlaskConical
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/lib/toast-context";
import { JobCard } from "@/components/jobs/JobCard";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { getCompanyBySlug } from "@/lib/data/companies";
import { formatDate } from "@/lib/format";
import { getApplicationStatusLabel, isApplicationTerminal } from "@/lib/application-status";
import { withdrawApplicationAction } from "@/lib/actions/jobs";
import { updateAccountSettingsAction } from "@/lib/actions/candidate";
import type { ActionState } from "@/lib/actions/auth";
import type { SessionProfile } from "@/lib/auth/session";
import type { CandidateDashboardData } from "@/lib/data/db-candidate";
import type { ApplicationStatus } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

type Tab = "overview" | "applications" | "saved" | "passport" | "alerts" | "settings";

export function DashboardClient({
  profile,
  data,
  demo = false,
  dataUnavailable = false
}: {
  profile?: SessionProfile;
  data: CandidateDashboardData;
  demo?: boolean;
  dataUnavailable?: boolean;
}) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
    { id: "overview", label: t.dashboard.tabOverview, icon: LayoutGrid },
    { id: "applications", label: t.dashboard.tabApplications, icon: FileText },
    { id: "saved", label: t.dashboard.tabSaved, icon: Bookmark },
    { id: "passport", label: t.dashboard.tabPassport, icon: IdCard },
    { id: "alerts", label: t.dashboard.tabAlerts, icon: Bell },
    { id: "settings", label: t.dashboard.tabSettings, icon: SettingsIcon }
  ];

  const interviewsCount = data.applications.filter((a) => ["interview", "offer", "hired"].includes(a.status)).length;
  const displayName = demo ? "Anna" : profile?.firstName;

  return (
    <div className="bg-surface">
      <div className="container-page py-10 sm:py-14">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">
            {t.dashboard.welcome}
            {displayName ? `, ${displayName}` : ""}
          </h1>
          {demo && !dataUnavailable && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-muted">
              <FlaskConical size={12} aria-hidden="true" />
              {t.dashboard.demoView}
            </span>
          )}
          {dataUnavailable && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              {t.auth.genericError}
            </span>
          )}
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors duration-150",
                tab === item.id
                  ? "border-brand bg-brand-light text-brand"
                  : "border-border bg-white text-ink hover:border-brand hover:text-brand"
              )}
            >
              <item.icon size={15} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "overview" && <Overview data={data} interviewsCount={interviewsCount} onGoTo={setTab} demo={demo} />}
          {tab === "applications" && <ApplicationsTab data={data} demo={demo} />}
          {tab === "saved" && <SavedTab data={data} />}
          {tab === "passport" && <PassportTab data={data} />}
          {tab === "alerts" && <AlertsTab />}
          {tab === "settings" && <SettingsTab profile={profile} demo={demo} />}
        </div>
      </div>
    </div>
  );
}

function Overview({
  data,
  interviewsCount,
  onGoTo,
  demo
}: {
  data: CandidateDashboardData;
  interviewsCount: number;
  onGoTo: (tab: Tab) => void;
  demo: boolean;
}) {
  const { t } = useI18n();

  const stats = [
    { icon: FileText, label: t.dashboard.activeApplications, value: String(data.applications.length) },
    { icon: Bookmark, label: t.dashboard.savedJobsCount, value: String(data.savedJobs.length) },
    { icon: CalendarCheck, label: t.dashboard.interviews, value: String(interviewsCount) },
    { icon: Gauge, label: t.dashboard.passportCompleteness, value: `${data.profileCompletion}%` }
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand">
              <stat.icon size={18} aria-hidden="true" />
            </span>
            <p className="mt-3 font-heading text-2xl font-extrabold text-ink">{stat.value}</p>
            <p className="text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-ink">{t.dashboard.myApplications}</h2>
            <button type="button" onClick={() => onGoTo("applications")} className="text-xs font-semibold text-brand hover:underline">
              {t.common.seeAll}
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {data.applications.length === 0 && <EmptyState text={t.dashboard.noApplications} />}
            {data.applications.slice(0, 4).map((application) => (
              <ApplicationRow key={application.id} application={application} demo={demo} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-heading text-lg font-bold text-ink">{t.dashboard.recommended}</h2>
          <div className="mt-4 flex flex-col gap-5">
            {data.recommended.length === 0 && <EmptyState text={t.dashboard.noRecommended} />}
            {data.recommended.map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ApplicationsTab({ data, demo }: { data: CandidateDashboardData; demo: boolean }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-3">
      {data.applications.length === 0 && <EmptyState text={t.dashboard.noApplications} />}
      {data.applications.map((application) => (
        <ApplicationRow key={application.id} application={application} showWithdraw demo={demo} />
      ))}
    </div>
  );
}

/** Shows the application's real status plus a plain timeline of the five recruitment steps — no "simulate" control. */
function ApplicationRow({
  application,
  showWithdraw = false,
  demo
}: {
  application: CandidateDashboardData["applications"][number];
  showWithdraw?: boolean;
  demo: boolean;
}) {
  const { t, locale } = useI18n();
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [withdrawn, setWithdrawn] = useState(application.status === "withdrawn");
  const [expanded, setExpanded] = useState(false);
  const company = getCompanyBySlug(application.job.companySlug);
  const status = (withdrawn ? "withdrawn" : application.status) as ApplicationStatus;
  const label = getApplicationStatusLabel(status, t);
  const terminal = isApplicationTerminal(status);

  function handleWithdraw() {
    if (demo) {
      setWithdrawn(true);
      showToast(t.dashboard.withdrawn);
      return;
    }
    startTransition(async () => {
      const result = await withdrawApplicationAction(application.id);
      if (result.ok) {
        setWithdrawn(true);
        showToast(t.dashboard.withdrawn);
      }
    });
  }

  if (!company) return null;

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href={`/jobs/${application.job.slug}`} className="flex items-center gap-3">
          <CompanyLogo initials={company.initials} color={company.color} size={40} />
          <div>
            <p className="text-sm font-bold text-ink hover:text-brand">{application.job.title}</p>
            <p className="text-xs text-muted">
              {company.name} · {formatDate(application.createdAt, locale)}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-150",
              terminal && status !== "hired" ? "bg-surface text-muted" : "bg-brand-light text-brand"
            )}
          >
            {label}
            <ChevronRight size={12} className={cn("transition-transform duration-200", expanded && "rotate-90")} aria-hidden="true" />
          </button>
          {showWithdraw && !terminal && (
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors duration-150 hover:border-red-300 hover:text-red-600 disabled:opacity-60"
            >
              <X size={12} aria-hidden="true" />
              {t.dashboard.withdraw}
            </button>
          )}
        </div>
      </div>

      {expanded && !terminal && (
        <ol className="mt-5 flex flex-col gap-3 border-t border-border pt-4">
          {t.applicationStatus.steps.map((step, index) => {
            const stepStatuses: ApplicationStatus[] = ["submitted", "viewed", "shortlisted", "interview", "offer"];
            const currentIndex = stepStatuses.indexOf(status);
            const reached = index <= currentIndex;
            return (
              <li key={step} className="flex items-center gap-3 text-sm">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    reached ? "bg-success text-white" : "border border-border text-muted"
                  )}
                >
                  {index + 1}
                </span>
                <span className={reached ? "font-semibold text-ink" : "text-muted"}>{step}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function SavedTab({ data }: { data: CandidateDashboardData }) {
  const { t } = useI18n();
  if (data.savedJobs.length === 0) return <EmptyState text={t.dashboard.noSaved} />;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {data.savedJobs.map((job) => (
        <JobCard key={job.slug} job={job} />
      ))}
    </div>
  );
}

function PassportTab({ data }: { data: CandidateDashboardData }) {
  const { t } = useI18n();
  return (
    <div className="max-w-md rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between text-sm font-semibold text-ink">
        <span>{t.dashboard.passportCompleteness}</span>
        <span className="text-success">{data.profileCompletion}%</span>
      </div>
      <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-success transition-[width] duration-500" style={{ width: `${data.profileCompletion}%` }} />
      </div>
      <Link
        href="/career-passport"
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700"
      >
        {t.careerPassport.createCta}
      </Link>
    </div>
  );
}

function AlertsTab() {
  const { t } = useI18n();
  return (
    <div className="flex max-w-md items-start gap-3 rounded-2xl border border-dashed border-border bg-white p-6 text-sm text-muted">
      <Bell size={18} className="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
      {t.dashboard.alertsComingSoon}
    </div>
  );
}

const settingsInitialState: ActionState = {};

function SettingsTab({ profile, demo }: { profile?: SessionProfile; demo: boolean }) {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [state, formAction, pending] = useActionState(updateAccountSettingsAction, settingsInitialState);

  if (!demo && state.success) showToast(t.dashboard.settingsSaved);

  function handleDemoSubmit(event: FormEvent) {
    event.preventDefault();
    showToast(t.dashboard.settingsSaved);
  }

  return (
    <form
      action={demo ? undefined : formAction}
      onSubmit={demo ? handleDemoSubmit : undefined}
      className="flex max-w-md flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-soft"
    >
      <h2 className="font-heading text-base font-bold text-ink">{t.dashboard.settingsTitle}</h2>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.auth.firstName} name="firstName" defaultValue={demo ? "Anna" : (profile?.firstName ?? "")} />
        <Field label={t.auth.lastName} name="lastName" defaultValue={demo ? "Kowalska" : ""} />
      </div>
      <Field label={t.auth.email} name="email" defaultValue={demo ? "anna.kowalska@example.com" : (profile?.email ?? "")} disabled />
      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? t.common.loading : t.common.save}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  disabled
}: {
  label: string;
  name: string;
  defaultValue: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand disabled:bg-surface disabled:text-muted"
      />
    </label>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted">{text}</div>
  );
}
