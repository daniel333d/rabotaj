import { Suspense } from "react";
import type { Metadata } from "next";
import { JobsPageClient } from "./JobsPageClient";

export const metadata: Metadata = {
  title: "Oferty pracy — Rabotaj.com",
  description: "Przeglądaj oferty pracy w Polsce i całej Europie."
};

export default function JobsPage() {
  return (
    <Suspense fallback={null}>
      <JobsPageClient />
    </Suspense>
  );
}
