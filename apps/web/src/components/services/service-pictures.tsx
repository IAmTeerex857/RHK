"use client";

/*
 * One small piece of the product per service on the Services page, after the Stageshow skill's
 * rules: one thing per picture, real words only on what it is about, quiet bars for the rest,
 * and one small motion that plays once as the card scrolls in.
 */

import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { cn } from "@rhk/ui/lib/cn";

/** Picture frame: a quiet raised panel. `play` is true once it is well in view (or straight away with reduced motion). */
function Frame({ children, className }: { children: (play: boolean) => ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  return (
    <div ref={ref} aria-hidden className={cn("relative overflow-hidden rounded-2xl bg-raised p-5", className)}>
      {children(inView || !!reduce)}
    </div>
  );
}

const spring = { type: "spring" as const, stiffness: 380, damping: 26 };
const card = "rounded-xl border border-line bg-card shadow-card";

/* 01 · Before & after school: the week, morning and afternoon */
function BeforeAfter() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const rows = { "Before school": [1, 1, 1, 1, 1], "After school": [1, 0, 1, 0, 1] };
  return (
    <Frame>
      {(play) => (
        <div className={cn(card, "p-4")}>
          <div className="grid grid-cols-[auto_repeat(5,minmax(0,1fr))] items-center gap-x-1.5 gap-y-2.5">
            <span />
            {days.map((d) => (
              <span key={d} className="text-center text-[11px] text-ink-muted">
                {d}
              </span>
            ))}
            {Object.entries(rows).map(([label, on], r) => (
              <div key={label} className="contents">
                <span className="pr-2 text-[13px] font-medium">{label}</span>
                {on.map((v, i) => (
                  <motion.span
                    key={i}
                    initial={false}
                    animate={{ scale: play && v ? 1 : 0.9 }}
                    transition={{ ...spring, delay: play ? 0.15 + (r * 5 + i) * 0.05 : 0 }}
                    style={{ transitionDelay: `${play ? 0.15 + (r * 5 + i) * 0.05 : 0}s` }}
                    className={cn(
                      "grid aspect-square w-full max-w-10 place-items-center justify-self-center rounded-lg border border-line-strong transition-colors duration-300",
                      play && v ? "bg-bus-400" : "bg-card",
                    )}
                  >
                    {play && v ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </Frame>
  );
}

/* 02 · Daily trips: pick one day and book it */
function DailyTrips() {
  const days = [
    ["Mon", "10"],
    ["Tue", "11"],
    ["Wed", "12"],
    ["Thu", "13"],
    ["Fri", "14"],
  ];
  return (
    <Frame>
      {(play) => (
        <div className="flex flex-col gap-4">
          <div className="flex gap-1.5">
            {days.map(([d, n], i) => {
              const on = play && i === 2;
              return (
                <motion.span
                  key={d}
                  initial={false}
                  animate={{ y: on ? -3 : 0 }}
                  transition={{ ...spring, delay: play ? 0.4 : 0 }}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-0.5 rounded-xl border py-2.5 transition-colors duration-300",
                    on ? "border-bus-500 bg-bus-400" : "border-line bg-card",
                  )}
                >
                  <span className={cn("text-[11px]", on ? "text-ink" : "text-ink-muted")}>{d}</span>
                  <span className="font-display text-[18px] font-semibold tabular-nums">{n}</span>
                </motion.span>
              );
            })}
          </div>
          <div className={cn(card, "flex items-center justify-between gap-3 p-3 pl-4")}>
            <span className="text-[14px] text-ink-soft">Wed 12 · after school</span>
            <motion.span
              initial={false}
              animate={{ scale: play ? [1, 0.95, 1] : 1 }}
              transition={{ delay: play ? 1 : 0, duration: 0.35 }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-[13px] font-medium text-cream"
            >
              Book this day
            </motion.span>
          </div>
        </div>
      )}
    </Frame>
  );
}

/* 03 · Satellite stops: a meeting point on a map */
function Satellite() {
  return (
    <Frame className="theme-light h-[190px] bg-[#dff3e8] p-0">
      {(play) => (
        <>
          <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
            {[
              [16, 16, 120, 70],
              [160, 16, 90, 60],
              [276, 110, 110, 90],
              [16, 120, 110, 84],
              [150, 140, 100, 64],
            ].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx="12" fill="#fff" opacity="0.8" />
            ))}
            <ellipse cx="330" cy="50" rx="44" ry="26" fill="#bfe9d2" />
            <path d="M0 100 H400 M140 0 V220 M262 0 V220" stroke="#fff" strokeWidth="14" />
          </svg>
          <motion.div
            initial={false}
            animate={{ y: play ? 0 : -24, opacity: play ? 1 : 0 }}
            transition={{ ...spring, delay: play ? 0.25 : 0 }}
            className="absolute left-[50%] top-[46%] flex -translate-x-1/2 -translate-y-full flex-col items-center"
          >
            <span className={cn(card, "whitespace-nowrap px-3 py-1.5 text-[13px] font-medium")}>Meeting point · 7:05</span>
            <MapPin className="mt-1 size-7 fill-coral text-ink" strokeWidth={1.75} />
          </motion.div>
        </>
      )}
    </Frame>
  );
}

/* 04 · One-way trips: there or back, one leg */
function OneWay() {
  return (
    <Frame>
      {(play) => (
        <div className="flex flex-col gap-4">
          <div className="relative grid grid-cols-2 rounded-xl bg-card p-1 shadow-card">
            <motion.span
              initial={false}
              animate={{ x: play ? "100%" : "0%" }}
              transition={{ ...spring, delay: play ? 0.4 : 0 }}
              className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg bg-bus-400"
            />
            {/* the label over the yellow pill keeps dark ink in both themes */}
            <span className={cn("relative py-2 text-center text-[14px] font-medium transition-colors duration-300", !play && "text-outline")}>
              To school
            </span>
            <span className={cn("relative py-2 text-center text-[14px] font-medium transition-colors duration-300", play && "text-outline")}>
              Home
            </span>
          </div>
          <div className={cn(card, "flex items-center gap-3 p-4")}>
            <span className="size-3 rounded-full border-2 border-ink bg-white" />
            <span className="h-2 w-16 rounded-full bg-raised" />
            <ArrowRight className="size-4 text-ink-muted" />
            <span className="size-3 rounded-full border-2 border-ink bg-mint" />
            <span className="text-[14px] font-medium">Home</span>
            <span className="ml-auto text-[13px] tabular-nums text-ink-muted">3:15</span>
          </div>
        </div>
      )}
    </Frame>
  );
}

/* 05 · Round trips: both legs, one driver */
function RoundTrips() {
  const legs = [
    { time: "7:05", label: "To school" },
    { time: "3:15", label: "Back home" },
  ];
  return (
    <Frame>
      {(play) => (
        <div className={cn(card, "relative p-4")}>
          <motion.span
            initial={false}
            animate={{ scaleY: play ? 1 : 0 }}
            transition={{ duration: 0.7, delay: play ? 0.3 : 0, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[27px] top-[30px] h-[70px] w-[3px] origin-top rounded-full bg-bus-400"
          />
          {legs.map((l, i) => (
            <div key={l.label} className={cn("relative flex items-center gap-3", i ? "mt-9" : "")}>
              <motion.span
                initial={false}
                style={{ transitionDelay: `${play ? 0.3 + i * 0.6 : 0}s` }}
                className={cn(
                  "grid size-6 place-items-center rounded-full border-2 border-ink transition-colors duration-300",
                  play ? "bg-mint" : "bg-card",
                )}
              >
                {play ? <Check className="size-3" strokeWidth={3} /> : null}
              </motion.span>
              <span className="text-[15px] font-medium">{l.label}</span>
              <span className="ml-auto text-[13px] tabular-nums text-ink-muted">{l.time}</span>
            </div>
          ))}
          <div className="mt-5 flex gap-2 border-t border-line pt-4">
            <span className="h-2 w-24 rounded-full bg-raised" />
            <span className="h-2 w-14 rounded-full bg-raised" />
          </div>
        </div>
      )}
    </Frame>
  );
}

/* 06 · Monthly plans: a month of school days */
function Monthly() {
  // a 5-week month starting on a Monday; weekends empty
  const cells = Array.from({ length: 35 }, (_, i) => i);
  return (
    <Frame>
      {(play) => (
        <div className={cn(card, "p-4")}>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-[15px] font-semibold">This month</span>
            <span className="text-[12px] text-ink-muted">Round trips</span>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {cells.map((i) => {
              const weekday = i % 7 < 5;
              return (
                <span
                  key={i}
                  style={{ transitionDelay: `${play ? 0.2 + i * 0.012 : 0}s` }}
                  className={cn(
                    "h-[18px] rounded-[5px] transition-colors duration-200",
                    play && weekday ? "bg-bus-200" : weekday ? "bg-raised" : "bg-card",
                  )}
                />
              );
            })}
          </div>
        </div>
      )}
    </Frame>
  );
}

/* 07 · Field trips: a trip booked for the group */
function FieldTrips() {
  return (
    <Frame className="flex items-center justify-center py-7">
      {(play) => (
        <motion.div
          initial={false}
          animate={{ rotate: play ? -3 : 0, y: play ? 0 : 6 }}
          transition={{ ...spring, delay: play ? 0.2 : 0 }}
          className={cn(card, "w-full max-w-[300px] overflow-hidden")}
        >
          <div className="flex items-center justify-between bg-coral px-4 py-3">
            <span className="font-display text-[16px] font-semibold">Field trip</span>
            <span className="text-[12px] font-medium tabular-nums">Fri 14</span>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-4">
            <div className="flex flex-col gap-2">
              <span className="h-2 w-28 rounded-full bg-raised" />
              <span className="h-2 w-16 rounded-full bg-raised" />
            </div>
            <motion.span
              initial={false}
              animate={{ scale: play ? 1 : 0, rotate: play ? -8 : 0 }}
              transition={{ ...spring, delay: play ? 0.7 : 0 }}
              className="inline-flex items-center gap-1 rounded-md border-2 border-ink bg-mint px-2 py-0.5 text-[12px] font-semibold"
            >
              <Check className="size-3" strokeWidth={3} />
              Booked
            </motion.span>
          </div>
        </motion.div>
      )}
    </Frame>
  );
}

/* 08 · Summer programs: the summer weeks as a range */
function Summer() {
  const weeks = ["Jun 2", "Jun 9", "Jun 16", "Jun 23", "Jun 30", "Jul 7"];
  return (
    <Frame>
      {(play) => (
        <div className={cn(card, "p-4")}>
          <div className="flex items-baseline justify-between">
            <span className="font-display text-[15px] font-semibold">Summer</span>
            <span className="text-[12px] text-ink-muted">Weekdays</span>
          </div>
          <div className="relative mt-5 grid grid-cols-6">
            <motion.span
              initial={false}
              animate={{ scaleX: play ? 1 : 0 }}
              transition={{ duration: 0.9, delay: play ? 0.3 : 0, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-[8.33%] right-[8.33%] top-[9px] h-[18px] origin-left rounded-full bg-bus-200"
            />
            {weeks.map((w, i) => {
              const end = i === 0 || i === weeks.length - 1;
              return (
                <div key={w} className="relative flex flex-col items-center gap-2">
                  <span
                    className={cn(
                      "grid size-9 place-items-center rounded-full text-[12px] font-semibold",
                      end ? "bg-bus-400" : "bg-transparent",
                    )}
                  >
                    {end ? <Check className="size-4" strokeWidth={2.5} /> : <span className="size-1.5 rounded-full bg-ink/40" />}
                  </span>
                  <span className="whitespace-nowrap text-[11px] text-ink-muted">{w}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Frame>
  );
}

export const servicePictures: Record<string, () => ReactNode> = {
  "before-after-school": BeforeAfter,
  "daily-trips": DailyTrips,
  "satellite-stops": Satellite,
  "one-way-trips": OneWay,
  "round-trips": RoundTrips,
  "monthly-plans": Monthly,
  "field-trips": FieldTrips,
  "summer-programs": Summer,
};
