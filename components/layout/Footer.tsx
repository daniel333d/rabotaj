"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  const { t } = useI18n();

  const candidateLinks = [
    { href: "/jobs", label: t.nav.jobs },
    { href: "/companies", label: t.nav.companies },
    { href: "/career-passport", label: "Career Passport" },
    { href: "/salary", label: t.nav.salary },
    { href: "/career-center", label: t.nav.careerCenter }
  ];

  const employerLinks = [
    { href: "/employers", label: t.nav.employers },
    { href: "/employers#post-job", label: t.employersSection.postJob },
    { href: "/dashboard", label: "Panel kandydata" }
  ];

  const companyLinks = [
    { href: "/about", label: t.footer.about },
    { href: "/contact", label: t.footer.contact },
    { href: "/terms", label: t.footer.terms },
    { href: "/privacy", label: t.footer.privacy }
  ];

  return (
    <footer className="border-t border-border bg-surface-raised">
      <div className="container-page grid gap-10 py-14 sm:py-16 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Logo variant="compact" className="h-8" />
          <p className="mt-3 max-w-xs text-sm text-muted">{t.footer.tagline}</p>
        </div>

        <FooterColumn title={t.footer.forCandidates} links={candidateLinks} />
        <FooterColumn title={t.footer.forEmployers} links={employerLinks} />
        <FooterColumn title={t.footer.legal} links={companyLinks} />
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Rabotaj.com — {t.footer.rights}</p>
          <p>Made for Polska · Україна · Europa</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link, index) => (
          <li key={`${link.href}-${index}`}>
            <Link href={link.href} className="text-sm text-muted transition-colors duration-150 hover:text-brand">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
