import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Briefcase, Building2, Users } from "lucide-react";
import { getSessionProfile } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Server-enforced: reads the caller's own session role, never a client-supplied value. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-3 py-16 text-center">
        <h1 className="font-heading text-xl font-bold text-ink">Panel administratora</h1>
        <p className="max-w-sm text-sm text-muted">Backend nie jest jeszcze skonfigurowany.</p>
      </div>
    );
  }

  const profile = await getSessionProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/");

  const links = [
    { href: "/admin", label: "Przegląd", icon: LayoutDashboard },
    { href: "/admin/jobs", label: "Oferty", icon: Briefcase },
    { href: "/admin/companies", label: "Firmy", icon: Building2 },
    { href: "/admin/users", label: "Użytkownicy", icon: Users }
  ];

  return (
    <div className="bg-surface">
      <div className="container-page py-10 sm:py-14">
        <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Panel administratora">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:border-brand hover:text-brand"
            >
              <link.icon size={15} aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
