import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { companies, getCompanyBySlug } from "@/lib/data/companies";
import { getCompanyBySlugFromDb, getPublishedJobs } from "@/lib/data/db-jobs";
import { CompanyDetailView } from "@/components/companies/CompanyDetailView";

export function generateStaticParams() {
  return companies.map((company) => ({ slug: company.slug }));
}

async function resolveCompany(slug: string) {
  const dbCompany = await getCompanyBySlugFromDb(slug);
  if (dbCompany) return { company: dbCompany, source: "db" as const };

  const staticCompany = getCompanyBySlug(slug);
  if (staticCompany) return { company: staticCompany, source: "static" as const };

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
  const resolved = await resolveCompany(slug);
  if (!resolved) return { title: "Firma — Rabotaj.com" };

  const { company } = resolved;
  const origin = await getOrigin();
  const url = `${origin}/companies/${company.slug}`;
  const title = `${company.name} — Rabotaj.com`;

  return {
    title,
    description: company.description,
    alternates: { canonical: url },
    openGraph: { title, description: company.description, url, type: "website", siteName: "Rabotaj.com" }
  };
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = await resolveCompany(slug);
  if (!resolved) notFound();

  const { company, source } = resolved;
  const jobs = source === "db" ? ((await getPublishedJobs()) ?? undefined) : undefined;

  return <CompanyDetailView company={company} jobs={jobs} />;
}
