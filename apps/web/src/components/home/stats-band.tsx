import { stats } from "@/content/site";
import { RoadPoint } from "../route/road-point";


export function StatsBand() {
  return (
    <section className="relative">
      <div className="container-page relative">
        <div data-road-clear className="relative z-[1] grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-ink text-cream shadow-float md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative flex flex-col gap-2 border-cream/10 p-5 md:p-7 [&:nth-child(n+3)]:border-t md:[&:nth-child(n+3)]:border-t-0 [&:not(:first-child)]:md:border-l [&:nth-child(even)]:border-l"
            >
              <p className="font-display text-[34px] font-semibold leading-none tracking-[-0.025em] md:text-[44px] tabular-nums">
                {s.value}
                <span className="ml-1 text-[16px] font-semibold tracking-normal text-cream/60 md:text-[18px]">{s.suffix}</span>
              </p>
              <p className="text-[14px] leading-snug text-cream/70 md:text-[15px]">{s.label}</p>
            </div>
          ))}
        </div>
        {/* after the band the road swings out to the right, beside the next heading */}
        <RoadPoint className="absolute hidden lg:block" style={{ left: "84%", bottom: "-150px" }} />
        <RoadPoint className="absolute lg:hidden" style={{ left: "128%", bottom: "-180px" }} />
      </div>
    </section>
  );
}
