"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, Plus, User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { logoutAction } from "@/lib/actions/auth";
import { getPostAuthRedirect } from "@/lib/auth/redirect";
import type { SessionProfile } from "@/lib/auth/session";

export function Navbar({ profile }: { profile: SessionProfile | null }) {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/jobs", label: t.nav.jobs },
    { href: "/companies", label: t.nav.companies },
    { href: "/salary", label: t.nav.salary },
    { href: "/career-center", label: t.nav.careerCenter },
    { href: "/employers", label: t.nav.employers }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link href="/" className="font-heading text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          RABOTA<span className="text-brand">J</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Główna nawigacja">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-ink transition-colors duration-150 hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          {profile ? (
            <UserMenu profile={profile} />
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                {t.nav.login}
              </Button>
              <Button href="/register" variant="outline" size="sm">
                {t.nav.register}
              </Button>
            </>
          )}
          <Button href="/employers" variant="primary" size="sm">
            <Plus size={16} aria-hidden="true" />
            {t.nav.postJob}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-ink lg:hidden"
          aria-label={t.common.filters === "Filtry" ? "Otwórz menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/40" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="animate-fade-in absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col gap-6 overflow-y-auto bg-white p-6 shadow-elevated">
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-extrabold text-ink">
                RABOTA<span className="text-brand">J</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-ink"
                aria-label={t.common.close}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-col gap-1" aria-label="Nawigacja mobilna">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-semibold text-ink transition-colors duration-150 hover:bg-brand-light hover:text-brand"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <LanguageSwitcher className="self-start" />

            <div className="mt-auto flex flex-col gap-3 border-t border-border pt-6">
              {profile ? (
                <>
                  <Button
                    href={getPostAuthRedirect(profile.role)}
                    variant="outline"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard size={16} aria-hidden="true" />
                    {profile.firstName ?? profile.email}
                  </Button>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:border-brand hover:text-brand"
                    >
                      <LogOut size={16} aria-hidden="true" />
                      {t.nav.logout}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Button href="/login" variant="outline" onClick={() => setMobileOpen(false)}>
                    {t.nav.login}
                  </Button>
                  <Button href="/register" variant="secondary" onClick={() => setMobileOpen(false)}>
                    {t.nav.register}
                  </Button>
                </>
              )}
              <Button href="/employers" variant="primary" onClick={() => setMobileOpen(false)}>
                <Plus size={16} aria-hidden="true" />
                {t.nav.postJob}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function UserMenu({ profile }: { profile: SessionProfile }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-ink transition-colors duration-200 hover:border-brand hover:text-brand"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-light text-brand">
          <User size={13} aria-hidden="true" />
        </span>
        {profile.firstName ?? profile.email}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="animate-fade-in absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-elevated"
        >
          <Link
            href={getPostAuthRedirect(profile.role)}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-150 hover:bg-brand-light hover:text-brand"
          >
            <LayoutDashboard size={15} aria-hidden="true" />
            {t.nav.dashboard}
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-ink transition-colors duration-150 hover:bg-brand-light hover:text-brand"
            >
              <LogOut size={15} aria-hidden="true" />
              {t.nav.logout}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
