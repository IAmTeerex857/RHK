"use client";

/*
 * A looping "ride day" demo of the parent alerts.
 * Pattern adapted from Beautiful UI's Task Rows (MIT, © 2026 Shane Levine): rows enter staggered,
 * the active row shows a sweeping ring, then pops to a check and a pill.
 */

import { AnimatePresence, motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@rhk/ui/lib/cn";
import { rideAlerts } from "@/content/site";

const tones = {
  sky: "bg-sky-soft text-[#1f6fa8] dark:text-[#8fcdf8]",
  bus: "bg-bus-100 text-bus-700 dark:text-bus-300",
  mint: "bg-mint-soft text-[#1d7a52] dark:text-[#7fdcb2]",
  lilac: "bg-lilac-soft text-[#5b3fc4] dark:text-[#bba6ff]",
} as const;

function Ring({ n }: { n: number }) {
  const size = 30;
  const r = 12.5;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative grid size-[30px] shrink-0 place-items-center">
      <svg width={size} height={size} className="absolute inset-0 animate-[rhk-spin_1.1s_linear_infinite]">
        <circle cx={15} cy={15} r={r} fill="none" stroke="var(--color-sand)" strokeWidth={3} />
        <circle cx={15} cy={15} r={r} fill="none" stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" strokeDasharray={`${c * 0.28} ${c}`} />
      </svg>
      <span className="relative font-display text-[12px] font-semibold tabular-nums">{n}</span>
    </span>
  );
}

function Check() {
  return (
    <motion.span
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className="grid size-[30px] shrink-0 place-items-center rounded-full border border-line bg-mint text-ink"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </motion.span>
  );
}

export function RideTracker({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [played, setStep] = useState(0);
  const step = reduce ? rideAlerts.length : played;

  useEffect(() => {
    if (!inView || reduce) return;
    const t = setTimeout(
      () => setStep((s) => (s >= rideAlerts.length + 1 ? 0 : s + 1)),
      step === 0 ? 500 : step > rideAlerts.length ? 2600 : 1500,
    );
    return () => clearTimeout(t);
  }, [inView, step, reduce]);

  const done = Math.min(step, rideAlerts.length);
  const progress = done / rideAlerts.length;

  return (
    <div ref={ref} className={cn("rounded-2xl border border-line bg-card p-4 shadow-float md:p-5", className)}>
      <div className="flex items-center justify-between gap-3 px-1 pb-4">
        <div>
          <p className="font-display text-[13px] font-semibold text-ink-muted">Today · Morning ride</p>
          <p className="mt-1 font-display text-[19px] font-semibold tracking-[-0.02em]">Ava&rsquo;s ride to school</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-raised px-2.5 py-1 text-[12px] font-medium text-ink-soft">
          <span className="relative flex size-2">
                        <span className="relative inline-flex size-2 rounded-full bg-coral" />
          </span>
          LIVE
        </span>
      </div>

      <div className="mb-4 h-2.5 overflow-hidden rounded-pill border border-line bg-paper">
        <motion.div className="h-full bg-bus-400" animate={{ width: `${progress * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
      </div>

      <ul className="flex min-h-[292px] flex-col gap-2">
        <AnimatePresence initial={false}>
          {rideAlerts.map((a, i) => {
            if (i > done) return null;
            const isDone = i < done;
            return (
              <motion.li
                key={a.title}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-3 py-2.5",
                  isDone ? "border-transparent bg-raised" : "border-line-strong bg-card shadow-subtle",
                )}
              >
                {isDone ? <Check /> : <Ring n={i + 1} />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[15px] font-semibold">{a.title}</p>
                  <p className="truncate text-[13px] text-ink-muted">{a.detail}</p>
                </div>
                <span className={cn("rounded-lg px-2 py-0.5 text-[12px] font-semibold tabular-nums", tones[a.tone])}>{a.time}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
