import type { MetadataRoute } from "next";
import { getAllCompaniesFromDb, getPublishedJobs } from "@/lib/data/db-jobs";
import { jobs as staticJobs } from "@/lib/data/jobs";
import { companies as staticCompanies } from "@/lib/data/companies";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES: { path: string; changeFrequency: "daily" | "weekly"; priority: number }[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/jobs", changeFrequency: "daily", priority: 0.9 },
  { path: "/companies", changeFrequency: "weekly", priority: 0.7 },
  { path: "/employers", changeFrequency: "weekly", priority: 0.6 },
  { path: "/career-center", changeFrequency: "weekly", priority: 0.5 },
  { path: "/career-passport", changeFrequency: "weekly", priority: 0.5 },
  { path: "/salary", changeFrequency: "weekly", priority: 0.5 },
  { path: "/about", changeFrequency: "weekly", priority: 0.4 },
  { path: "/contact", changeFrequency: "weekly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "weekly", priority: 0.2 },
  { path: "/terms", changeFrequency: "weekly", priority: 0.2 }
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Falls back to the bundled demo data until Supabase is configured/seeded,
  // matching the pattern used by app/jobs/page.tsx and app/companies/page.tsx.
  const [dbJobs, dbCompanies] = await Promise.all([getPublishedJobs(), getAllCompaniesFromDb()]);
  const jobs = dbJobs ?? staticJobs;
  const companies = dbCompanies ?? staticCompanies;

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority
  }));

  const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${SITE_URL}/jobs/${job.slug}`,
    lastModified: job.publishedAt,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const companyEntries: MetadataRoute.Sitemap = companies.map((company) => ({
    url: `${SITE_URL}/companies/${company.slug}`,
    changeFrequency: "weekly",
    priority: 0.5
  }));

  return [...staticEntries, ...jobEntries, ...companyEntries];
}
