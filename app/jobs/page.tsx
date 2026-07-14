import { Suspense } from "react";
import type { Metadata } from "next";
import { jobs as staticJobs } from "@/lib/data/jobs";
import { getPublishedJobs } from "@/lib/data/db-jobs";
import { JobsPageClient } from "./JobsPageClient";

export const metadata: Metadata = {
  title: "Oferty pracy — Rabotaj.com",
  description: "Przeglądaj oferty pracy w Polsce i całej Europie."
};

export default async function JobsPage() {
  // Falls back to the bundled demo listings until a Supabase project is
  // configured and seeded — see supabase/README.md.
  const dbJobs = await getPublishedJobs();
  const jobs = dbJobs ?? staticJobs;

  return (
    <Suspense fallback={null}>
      <JobsPageClient jobs={jobs} />
    </Suspense>
  );
}
