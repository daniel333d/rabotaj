"use client";

import { Send, Eye, UserCheck, CalendarCheck, Trophy } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SectionHeading } from "@/components/home/SectionHeading";

const icons = [Send, Eye, UserCheck, CalendarCheck, Trophy];

export function ApplicationStatus() {
  const { t } = useI18n();

  return (
    <section className="bg-white">
      <div className="container-page py-16 sm:py-20">
        <SectionHeading kicker={t.applicationStatus.kicker} title={t.applicationStatus.title} align="center" />

        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {t.applicationStatus.steps.map((step, index) => {
            const Icon = icons[index];
            const active = index <= 2;
            return (
              <div key={step} className="flex flex-1 items-center gap-3 sm:flex-col sm:text-center">
                <div className="flex items-center sm:w-full">
                  {index > 0 && (
                    <span
                      className={`hidden h-px flex-1 sm:block ${active ? "bg-success" : "bg-border"}`}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                      active ? "border-success bg-green-50 text-success" : "border-border bg-white text-muted"
                    }`}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  {index < t.applicationStatus.steps.length - 1 && (
                    <span
                      className={`hidden h-px flex-1 sm:block ${index < 2 ? "bg-success" : "bg-border"}`}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className={`text-sm font-semibold ${active ? "text-ink" : "text-muted"}`}>{step}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
