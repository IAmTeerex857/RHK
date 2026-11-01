"use client";

import Link from "next/link";
import { LinkButton } from "@/components/site/link-button";
import { motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@rhk/ui/lib/cn";
import { services } from "@/content/site";
import { RoadPoint } from "../route/road-point";
import { SectionHeading } from "./section-heading";
import { ServiceIcon } from "./service-icon";

/*
 * Services as a "big square" bento: four columns, the core service as a 2 × 2 hero showing the
 * week planner, one wide tile with a trip ticket, and the rest small. One inverted tile and one
 * yellow tile break up the white ones.
 */

type Tone = "white" | "ink" | "yellow";
const layout: Record<string, { span?: string; tone?: Tone }> = {
  "before-after-school": { span: "sm:col-span-2 lg:row-span-2" },
  "satellite-stops": { tone: "ink" },
  "field-trips": { span: "sm:col-span-2" },
  "summer-programs": { tone: "yellow" },
};

const DAYS = ["M", "T", "W", "T", "F"];
const PLAN = {
  "Before school": [true, true, true, true, true],
  "After school": [true, false, true, false, true],
};

function WeekPlanner() {
  const rides = Object.values(PLAN).flat().filter(Boolean).length;
  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card md:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-[16px] font-semibold">This week</span>
        <span className="text-[14px] tabular-nums text-ink-muted">{rides} rides</span>
      </div>
      <div className="mt-auto grid grid-cols-[auto_repeat(5,minmax(0,1fr))] items-center gap-x-2 gap-y-3 pt-6">
        <span />
        {DAYS.map((d, i) => (
          <span key={i} className="text-center text-[12px] font-medium text-ink-muted">
            {d}
          </span>
        ))}
        {Object.entries(PLAN).map(([label, days]) => (
          <div key={label} className="contents">
            <span className="pr-2 text-[13px] font-medium text-ink">{label}</span>
            {days.map((on, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.06, type: "spring", stiffness: 320, damping: 20 }}
                className={cn(
                  "grid aspect-square w-full max-w-12 place-items-center justify-self-center rounded-xl border",
                  on ? "border-bus-500 bg-bus-400 text-ink" : "border-line-strong bg-white",
                )}
              >
                {on ? <Check className="size-4" strokeWidth={2.5} /> : null}
              </motion.span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Ticket() {
  return (
    <svg viewBox="0 0 220 120" className="h-auto w-full max-w-[220px]" aria-hidden>
      <g transform="rotate(-6 110 60)">
        <path
          d="M14 22 Q14 14 22 14 H198 Q206 14 206 22 V48 A12 12 0 0 0 206 72 V98 Q206 106 198 106 H22 Q14 106 14 98 V72 A12 12 0 0 0 14 48 Z"
          fill="#ff6a4d"
          stroke="#1d1a2f"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M150 20 V100" stroke="#1d1a2f" strokeWidth="2.5" strokeDasharray="4 6" strokeLinecap="round" />
        <text x="34" y="54" fontSize="13" fontWeight="600" fill="#1d1a2f" style={{ fontFamily: "var(--font-display)" }}>
          Trip day
        </text>
        <rect x="34" y="66" width="72" height="8" rx="4" fill="#1d1a2f" opacity="0.35" />
        <rect x="34" y="80" width="48" height="8" rx="4" fill="#1d1a2f" opacity="0.35" />
        {[160, 168, 172, 180, 186, 190].map((x, i) => (
          <rect key={x} x={x} y="36" width={i % 2 ? 3 : 5} height="48" fill="#1d1a2f" />
        ))}
      </g>
    </svg>
  );
}

export function ServicesGrid() {
  return (
    <section id="services" className="relative py-20 md:py-28">
      {/* road: beside the heading on the right, then under the grid and out the left side */}
      <RoadPoint className="absolute hidden lg:block" style={{ left: "88%", top: "150px" }} />
      <RoadPoint className="absolute lg:hidden" style={{ left: "130%", top: "120px" }} />

      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Our services"
            title="Every kind of ride, one friendly crew"
            body="From the daily school run to field trips and summer programs. Call us for a quote on any of them."
          />
          <LinkButton href="/services" variant="outline" arrow className="self-start md:self-auto">
            All services
          </LinkButton>
        </div>

        <div className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const l = layout[s.slug] ?? {};
            const hero = s.slug === "before-after-school";
            const wide = s.slug === "field-trips";
            const tone = l.tone ?? "white";
            return (
              <motion.div
                key={s.slug}
                className={l.span}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 180, damping: 22 }}
              >
                <Link
                  href={`/services#${s.slug}`}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 shadow-card transition-shadow duration-200 hover:shadow-float md:p-6",
                    tone === "white" && "border-line bg-white",
                    tone === "ink" && "border-ink bg-ink text-cream",
                    tone === "yellow" && "border-bus-500 bg-bus-400",
                    wide && "sm:flex-row sm:items-center sm:gap-6",
                  )}
                >
                  <span
                    className={cn(
                      "absolute right-4 top-4 grid size-9 place-items-center rounded-full border transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                      tone === "ink" ? "border-white/15 text-cream" : "border-line bg-white",
                    )}
                  >
                    <ArrowUpRight className="size-4" />
                  </span>

                  <div className={cn("flex flex-col", wide && "sm:flex-1")}>
                    {hero ? null : (
                      <ServiceIcon
                        icon={s.icon}
                        className={cn(
                          tone === "ink" && "bg-white/10 text-bus-300",
                          tone === "yellow" && "bg-white/50 text-ink",
                        )}
                      />
                    )}
                    <h3
                      className={cn(
                        "font-display font-semibold tracking-[-0.02em]",
                        hero ? "pr-12 text-[26px] leading-tight md:text-[30px]" : "mt-6 pr-6 text-[19px]",
                      )}
                    >
                      {s.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 leading-relaxed",
                        hero ? "max-w-md text-[16px]" : "text-[15px]",
                        tone === "ink" ? "text-cream/70" : tone === "yellow" ? "text-ink/75" : "text-ink-soft",
                      )}
                    >
                      {s.short}
                    </p>
                  </div>

                  {hero ? (
                    <div className="mt-6 flex flex-1 lg:mt-8">
                      <WeekPlanner />
                    </div>
                  ) : null}
                  {wide ? (
                    <div className="mt-5 flex justify-center sm:mt-0 sm:w-[44%]">
                      <Ticket />
                    </div>
                  ) : null}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
      <RoadPoint className="absolute hidden lg:block" style={{ left: "-10%", bottom: "40px" }} />
      <RoadPoint className="absolute lg:hidden" style={{ left: "-30%", bottom: "30px" }} />
    </section>
  );
}
