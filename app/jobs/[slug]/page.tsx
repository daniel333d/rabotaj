import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { jobs, getJobBySlug, getSimilarJobs } from "@/lib/data/jobs";
import { getCompanyBySlug } from "@/lib/data/companies";
import { getPublishedJobBySlug, getPublishedJobIdBySlug, getSimilarPublishedJobs, recordJobView } from "@/lib/data/db-jobs";
import { getSessionProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { JobDetailView } from "@/components/jobs/JobDetailView";
import { buildJobPostingJsonLd } from "@/lib/seo/job-posting";

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

async function resolveJob(slug: string) {
  const dbJob = await getPublishedJobBySlug(slug);
  if (dbJob) return { job: dbJob, source: "db" as const };

  const staticJob = getJobBySlug(slug);
  if (staticJob) return { job: staticJob, source: "static" as const };

  return null;
}

async function getOrigin() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveJob(slug);
  if (!resolved) return { title: "Oferta pracy — Rabotaj.com" };

  const { job } = resolved;
  const company = getCompanyBySlug(job.companySlug);
  const origin = await getOrigin();
  const url = `${origin}/jobs/${job.slug}`;
  const title = `${job.title} — ${company?.name ?? ""} | Rabotaj.com`;
  const description = job.description || `${job.title} w ${company?.name ?? ""}, ${job.city}, ${job.country}.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Rabotaj.com"
    }
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = await resolveJob(slug);
  if (!resolved) notFound();

  const { job, source } = resolved;
  const company = getCompanyBySlug(job.companySlug);
  if (!company) notFound();

  const similar = source === "db" ? await getSimilarPublishedJobs(job) : getSimilarJobs(job);

  let jobId: string | null = null;
  let isLoggedIn = false;
  let alreadyApplied = false;
  let initialSaved = false;

  if (source === "db") {
    jobId = await getPublishedJobIdBySlug(slug);
    const profile = await getSessionProfile();
    isLoggedIn = Boolean(profile);

    if (jobId) {
      void recordJobView(jobId, profile?.id ?? null);

      if (profile) {
        const supabase = await createClient();
        if (supabase) {
          const [{ data: application }, { data: saved }] = await Promise.all([
            supabase.from("applications").select("id").eq("job_id", jobId).eq("candidate_user_id", profile.id).maybeSingle(),
            supabase.from("saved_jobs").select("id").eq("job_id", jobId).eq("user_id", profile.id).maybeSingle()
          ]);
          alreadyApplied = Boolean(application);
          initialSaved = Boolean(saved);
        }
      }
    }
  }

  const origin = await getOrigin();
  const jsonLd = buildJobPostingJsonLd(job, company, `${origin}/jobs/${job.slug}`);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <JobDetailView
        job={job}
        similar={similar}
        jobId={jobId ?? undefined}
        isLoggedIn={isLoggedIn}
        alreadyApplied={alreadyApplied}
        initialSaved={initialSaved}
      />
    </>
  );
}
