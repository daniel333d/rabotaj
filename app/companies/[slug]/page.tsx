import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { companies, getCompanyBySlug } from "@/lib/data/companies";
import { CompanyDetailView } from "@/components/companies/CompanyDetailView";

export function generateStaticParams() {
  return companies.map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return { title: "Firma — Rabotaj.com" };
  return {
    title: `${company.name} — Rabotaj.com`,
    description: company.description
  };
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  return <CompanyDetailView company={company} />;
}
