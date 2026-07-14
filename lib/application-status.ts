import type { ApplicationStatus } from "@/lib/supabase/database.types";
import type { Dictionary } from "@/lib/i18n/locales/pl";

/** Maps a DB status onto the existing 5-step visual pipeline (applicationStatus.steps). -1 = terminal state shown separately. */
const STEP_INDEX: Record<ApplicationStatus, number> = {
  submitted: 0,
  viewed: 1,
  shortlisted: 2,
  interview: 3,
  offer: 4,
  hired: -1,
  rejected: -1,
  withdrawn: -1
};

export function getApplicationStatusStepIndex(status: ApplicationStatus): number {
  return STEP_INDEX[status];
}

export function getApplicationStatusLabel(status: ApplicationStatus, t: Dictionary): string {
  const stepIndex = STEP_INDEX[status];
  if (stepIndex >= 0) return t.applicationStatus.steps[stepIndex];
  if (status === "hired") return t.applicationStatus.hired;
  if (status === "rejected") return t.applicationStatus.rejected;
  return t.applicationStatus.withdrawnStatus;
}

export function isApplicationTerminal(status: ApplicationStatus): boolean {
  return status === "hired" || status === "rejected" || status === "withdrawn";
}
