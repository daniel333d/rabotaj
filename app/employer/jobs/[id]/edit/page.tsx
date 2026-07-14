import { notFound } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";
import { getEmployerCompany, getEmployerJobById } from "@/lib/data/db-employer";
import { JobWizard } from "@/components/employer/JobWizard";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getSessionProfile();
  if (!profile) return null;

  const company = await getEmployerCompany(profile.id);
  if (!company) notFound();

  const job = await getEmployerJobById(id, company.id);
  if (!job) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">Edytuj ogłoszenie</h1>
      <div className="mt-8">
        <JobWizard
          mode="edit"
          jobId={job.id}
          initialStatus={job.status}
          initialValues={{
            title: job.title,
            slug: job.slug,
            country: job.country,
            city: job.city,
            workMode: job.work_mode,
            contractType: job.contract_type,
            salaryMin: job.salary_min?.toString() ?? "",
            salaryMax: job.salary_max?.toString() ?? "",
            salaryCurrency: job.salary_currency,
            salaryPeriod: job.salary_period,
            experienceLevel: job.experience_level,
            workLanguage: job.work_language ?? "",
            requirements: job.requirements.join("\n"),
            niceToHave: job.nice_to_have.join("\n"),
            noExperienceRequired: job.no_experience_required,
            skills: job.job_skills.map((s) => s.skill_name).join("\n"),
            description: job.description ?? "",
            responsibilities: job.responsibilities.join("\n"),
            benefits: job.benefits.join("\n"),
            accommodationProvided: job.accommodation_provided,
            recruitmentProcess: job.recruitment_process.join("\n"),
            responseTimeDays: job.response_time_days?.toString() ?? "",
            startDate: job.start_date ?? ""
          }}
        />
      </div>
    </div>
  );
}
