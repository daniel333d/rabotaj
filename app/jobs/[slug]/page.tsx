import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { jobs, getJobBySlug } from "@/lib/data/jobs";
import { getCompanyBySlug } from "@/lib/data/companies";
import { JobDetailView } from "@/components/jobs/JobDetailView";

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return { title: "Oferta pracy — Rabotaj.com" };
  const company = getCompanyBySlug(job.companySlug);
  return {
    title: `${job.title} — ${company?.name ?? ""} | Rabotaj.com`,
    description: job.description
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();

  return <JobDetailView job={job} />;
}
