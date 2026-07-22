import type { Job } from "@/lib/data/jobs";
import type { Company } from "@/lib/data/companies";

const EMPLOYMENT_TYPE: Record<Job["contractType"], string> = {
  "Umowa o pracę": "FULL_TIME",
  B2B: "CONTRACTOR",
  "Umowa zlecenie": "CONTRACTOR",
  "Praca tymczasowa": "TEMPORARY"
};

/** Generates schema.org JobPosting JSON-LD from the same data rendered on the page. */
export function buildJobPostingJsonLd(job: Job, company: Company, url: string) {
  const validThrough = new Date(job.publishedAt);
  validThrough.setDate(validThrough.getDate() + 60);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || job.responsibilities.join(" "),
    identifier: {
      "@type": "PropertyValue",
      name: company.name,
      value: job.slug
    },
    datePosted: job.publishedAt,
    validThrough: validThrough.toISOString(),
    employmentType: EMPLOYMENT_TYPE[job.contractType],
    hiringOrganization: {
      "@type": "Organization",
      name: company.name,
      sameAs: `${url.replace(/\/jobs\/.*/, "")}/companies/${company.slug}`
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.city,
        addressCountry: job.country
      }
    },
    directApply: true
  };

  if (job.remote) {
    jsonLd.jobLocationType = "TELECOMMUTE";
    jsonLd.applicantLocationRequirements = {
      "@type": "Country",
      name: job.country
    };
  }

  if (job.salaryDisclosed && job.salaryMin > 0 && job.salaryMax > 0) {
    jsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.currency,
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: "MONTH"
      }
    };
  }

  return jsonLd;
}

/**
 * Serializes JSON-LD for a `<script type="application/ld+json">` tag.
 * `JSON.stringify` alone does not escape `<`, so employer-controlled text
 * (e.g. `description`) could otherwise break out of the script tag and
 * inject markup. Escaping `<`, `>` and `&` as unicode sequences keeps the
 * JSON semantically identical while making that impossible.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
