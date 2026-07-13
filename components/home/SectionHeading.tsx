import { cn } from "@/lib/utils";

export function SectionHeading({
  kicker,
  title,
  intro,
  light = false,
  align = "left"
}: {
  kicker: string;
  title: string;
  intro?: string;
  light?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className={cn("text-xs font-bold uppercase tracking-[0.16em]", light ? "text-blue-300" : "text-brand")}>
        {kicker}
      </p>
      <h2
        className={cn(
          "mt-3 text-balance font-heading text-[1.75rem] font-extrabold leading-tight sm:text-4xl",
          light ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {intro ? (
        <p className={cn("mt-4 text-balance text-base leading-7", light ? "text-white/70" : "text-muted")}>{intro}</p>
      ) : null}
    </div>
  );
}
