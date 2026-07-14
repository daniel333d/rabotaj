import { jobs, getJobBySlug } from "@/lib/data/jobs";
import type { CandidateDashboardData } from "@/lib/data/db-candidate";

/**
 * Hardcoded, realistic dashboard content shown when no Supabase project is
 * configured yet — so the candidate portal flow is fully demonstrable
 * without a backend. Never mutated; every UI interaction on top of this
 * (withdraw, save toggle, settings save) is simulated locally in the
 * component instead of calling a server action.
 */
export function getDashboardDemoData(): CandidateDashboardData {
  const applications: CandidateDashboardData["applications"] = [
    {
      id: "demo-app-1",
      status: "interview",
      message: "Z chęcią dołączę do zespołu, mam doświadczenie z podobnymi projektami.",
      expectedSalary: 21000,
      availabilityDate: "2026-08-01",
      createdAt: "2026-07-08",
      job: getJobBySlug("senior-frontend-developer-technova")!
    },
    {
      id: "demo-app-2",
      status: "shortlisted",
      message: null,
      expectedSalary: null,
      availabilityDate: null,
      createdAt: "2026-07-09",
      job: getJobBySlug("kierowca-c-e-nordcargo")!
    },
    {
      id: "demo-app-3",
      status: "viewed",
      message: null,
      expectedSalary: 16000,
      availabilityDate: null,
      createdAt: "2026-07-10",
      job: getJobBySlug("ux-ui-designer-brightdesk")!
    },
    {
      id: "demo-app-4",
      status: "submitted",
      message: null,
      expectedSalary: null,
      availabilityDate: "2026-08-15",
      createdAt: "2026-07-12",
      job: getJobBySlug("operator-cnc-baltic-manufacturing")!
    },
    {
      id: "demo-app-5",
      status: "offer",
      message: null,
      expectedSalary: 19500,
      availabilityDate: "2026-07-20",
      createdAt: "2026-07-01",
      job: getJobBySlug("backend-developer-node-technova")!
    }
  ];

  const savedSlugs = ["frontend-developer-react-brightdesk", "qa-engineer-technova", "spedytor-nordcargo", "kontroler-jakosci-baltic"];
  const savedJobs = savedSlugs.map((slug) => getJobBySlug(slug)!).filter(Boolean);

  const appliedSlugs = new Set(applications.map((a) => a.job.slug));
  const recommended = jobs.filter((job) => !appliedSlugs.has(job.slug) && !savedSlugs.includes(job.slug)).slice(0, 3);

  return { applications, savedJobs, recommended, profileCompletion: 75 };
}
