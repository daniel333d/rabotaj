export default function JobsLoading() {
  return (
    <div className="bg-surface">
      <div className="container-page py-10 sm:py-14">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-border" />
        <div className="mt-3 h-4 w-24 animate-pulse rounded bg-border" />

        <div className="mt-6 h-16 animate-pulse rounded-2xl bg-border/60" />

        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden h-96 animate-pulse rounded-2xl bg-border/60 lg:block" />
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-2xl border border-border bg-white p-5 shadow-card">
                <div className="flex items-start gap-3.5">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-border" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-border" />
                    <div className="h-3 w-1/2 rounded bg-border" />
                  </div>
                </div>
                <div className="mt-5 h-3 w-full rounded bg-border" />
                <div className="mt-2 h-3 w-2/3 rounded bg-border" />
                <div className="mt-6 h-16 rounded-xl bg-border/70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
