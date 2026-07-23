import { cn } from "@/lib/utils";

/**
 * Single source of truth for the wordmark — renders as one unbroken word
 * "RABOTAJ" with only the final letter in brand blue. No whitespace, no
 * separate word boundary; `whitespace-nowrap` guards against wrapping ever
 * introducing a visual break.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("whitespace-nowrap font-heading font-extrabold tracking-tight text-ink", className)}>
      RABOTA<span className="text-brand">J</span>
    </span>
  );
}
