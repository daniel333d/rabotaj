"use client";

import { useI18n } from "@/lib/i18n/context";
import { jobs } from "@/lib/data/jobs";
import { JobCard } from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/home/SectionHeading";

export function LatestJobs() {
  const { t } = useI18n();
  const featured = jobs.slice(0, 6);

  return (
    <section className="bg-white">
      <div className="container-page py-16 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading kicker={t.latestJobs.kicker} title={t.latestJobs.title} intro={t.latestJobs.intro} />
          <Button href="/jobs" variant="outline" className="hidden shrink-0 sm:inline-flex">
            {t.latestJobs.cta}
          </Button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </div>

        <Button href="/jobs" variant="outline" className="mt-8 flex sm:hidden">
          {t.latestJobs.cta}
        </Button>
      </div>
    </section>
  );
}
