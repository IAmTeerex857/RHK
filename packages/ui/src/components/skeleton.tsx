import { cn } from "../lib/cn";

/** A quiet placeholder block. Shimmer is disabled for people who prefer reduced motion. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("rounded-lg bg-raised motion-safe:animate-pulse", className)} />;
}

/** Fallback for record pages (a family, a route, a driver) while the record streams in. */
export function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading">
      <div className="pb-6 pt-4 lg:pt-6">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="mt-4 h-8 w-72 max-w-full" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="h-[420px] rounded-2xl border border-line bg-card p-5 lg:col-span-7">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-6 h-[320px] w-full rounded-xl" />
        </div>
        <div className="h-[420px] rounded-2xl border border-line bg-card p-5 lg:col-span-5">
          <Skeleton className="h-4 w-28" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="mt-5 flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="mt-2 h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
