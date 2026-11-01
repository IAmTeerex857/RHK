"use client";

/*
 * How it works: one small piece of the product per stop, after the Stageshow skill's rules (one
 * thing per picture, real words only where the eye lands, one small motion that plays once as
 * the card scrolls in).
 */

import { motion, useInView, useReducedMotion } from "motion/react";
import { Check, Lock } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@rhk/ui/lib/cn";
import { applicationFee } from "@/content/site";
import { LogoMark } from "../site/logo";

/** Runs a short script once, when the picture is well into view. Reduced motion jumps to the end. */
function usePlayOnce<T>(steps: { at: number; to: T }[], start: T, end: T) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [state, setState] = useState<T>(start);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      const t = window.setTimeout(() => setState(end), 0);
      return () => window.clearTimeout(t);
    }
    const timers = steps.map((s) => window.setTimeout(() => setState(s.to), s.at));
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);
  return { ref, state };
}

function Frame({ children, className, innerRef }: { children: ReactNode; className?: string; innerRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={innerRef} className={cn("relative overflow-hidden rounded-xl bg-raised", className)}>
      {children}
    </div>
  );
}

/* ---- 1 · Apply online: the child's name types in, then the pay button sends ---- */

const NAME = "Ava Smith";

function ApplyPicture() {
  const { ref, state } = usePlayOnce<number>(
    [
      ...NAME.split("").map((_, i) => ({ at: 300 + i * 70, to: i + 1 })),
      { at: 300 + NAME.length * 70 + 450, to: 100 },
      { at: 300 + NAME.length * 70 + 900, to: 200 },
    ],
    0,
    200,
  );
  const typed = NAME.slice(0, Math.min(state, NAME.length));
  const pressed = state === 100;
  const sent = state >= 200;
  return (
    <Frame innerRef={ref} className="flex flex-col gap-3 p-4">
      <div className="rounded-xl border border-line bg-white p-4 shadow-card">
        <p className="text-[12px] text-ink-muted">Child&rsquo;s full name</p>
        <div className="mt-1.5 flex h-10 items-center rounded-lg border border-line-strong px-3 text-[15px]">
          {typed}
          {!sent ? <span className="ml-px h-5 w-px animate-[rhk-blink_1s_steps(1)_infinite] bg-ink" /> : null}
        </div>
        <div className="mt-3 flex gap-2">
          <span className="h-2 w-20 rounded-full bg-raised" />
          <span className="h-2 w-12 rounded-full bg-raised" />
        </div>
      </div>
      <motion.div
        animate={{ scale: pressed ? 0.96 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "flex h-11 items-center justify-center gap-2 rounded-xl text-[15px] font-medium transition-colors duration-300",
          sent ? "bg-mint text-ink" : "bg-bus-400 text-ink",
        )}
      >
        {sent ? (
          <>
            <Check className="size-4" strokeWidth={2.5} />
            Sent
          </>
        ) : (
          <>Pay ${applicationFee} and apply</>
        )}
      </motion.div>
    </Frame>
  );
}

/* ---- 2 · We confirm your spot: the welcome text arrives ---- */

function ConfirmPicture() {
  const { ref, state } = usePlayOnce<number>([{ at: 300, to: 1 }, { at: 1500, to: 2 }], 0, 2);
  return (
    <Frame innerRef={ref} className="flex min-h-[150px] flex-col justify-end gap-2 p-5">
      <div className="flex items-center gap-2 text-[12px] text-ink-muted">
        <LogoMark className="size-5" />
        Rush Hour Kids
      </div>
      <motion.div
        initial={false}
        animate={{ opacity: state >= 1 ? 1 : 0, y: state >= 1 ? 0 : 8 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="max-w-[88%] self-start rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[14px] leading-snug shadow-card"
      >
        {state >= 2 ? (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="block">
            You&rsquo;re in. Welcome to Rush Hour Kids. Your app access code is on its way.
          </motion.span>
        ) : (
          <span className="flex gap-1 py-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2 animate-pulse rounded-full bg-ink/30" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </span>
        )}
      </motion.div>
    </Frame>
  );
}

/* ---- 3 · Plan your week: "Repeat last week" switches on and the days fill ---- */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const LAST_WEEK = [true, true, false, true, true];

function PlanPicture() {
  const { ref, state } = usePlayOnce<number>(
    [{ at: 500, to: 1 }, ...DAYS.map((_, i) => ({ at: 800 + i * 110, to: 2 + i }))],
    0,
    10,
  );
  const on = state >= 1;
  return (
    <Frame innerRef={ref} className="p-5">
      <div className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 shadow-card">
        <span className="text-[14px] font-medium">Repeat last week</span>
        <span className={cn("relative h-6 w-10 rounded-full transition-colors duration-300", on ? "bg-mint" : "bg-[#d9d7e0]")}>
          <motion.span
            initial={false}
            animate={{ left: on ? 18 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-0.5 size-5 rounded-full bg-white shadow-subtle"
          />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {DAYS.map((d, i) => {
          const filled = LAST_WEEK[i] && state >= 2 + i;
          return (
            <div key={d} className="flex flex-col items-center gap-1.5">
              <span className="text-[12px] text-ink-muted">{d}</span>
              <motion.span
                initial={false}
                animate={{ scale: filled ? 1 : 0.92 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                className={cn(
                  "grid h-11 w-full place-items-center rounded-lg border transition-colors duration-200",
                  filled ? "border-bus-500 bg-bus-400" : "border-line-strong bg-white",
                )}
              >
                {filled ? <Check className="size-4" strokeWidth={2.5} /> : null}
              </motion.span>
            </div>
          );
        })}
      </div>
    </Frame>
  );
}

/* ---- 4 · Ride and relax: two alerts land on the lock screen ---- */

const ALERTS = [
  { title: "Driver is 8 min away", time: "7:05" },
  { title: "Ava boarded safely", time: "7:13" },
];

function RidePicture() {
  const { ref, state } = usePlayOnce<number>([{ at: 300, to: 1 }, { at: 1300, to: 2 }], 0, 2);
  return (
    <Frame innerRef={ref} className="min-h-[176px] bg-[linear-gradient(170deg,#8ea9d6,#aca3cf)] p-4">
      <div className="flex items-center justify-center gap-1.5 text-[12px] font-medium text-white/85">
        <Lock className="size-3" />
        Tuesday
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {ALERTS.slice(0, state)
          .slice()
          .reverse()
          .map((a) => (
            <motion.div
              key={a.title}
              layout
              initial={{ opacity: 0, y: -14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="flex items-center gap-3 rounded-2xl bg-white/85 px-3 py-2.5 backdrop-blur-md"
            >
              <LogoMark className="size-8 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[12px] font-semibold">Rush Hour Kids</span>
                  <span className="text-[11px] text-ink-muted">{a.time}</span>
                </div>
                <p className="truncate text-[13px] leading-snug">{a.title}</p>
              </div>
            </motion.div>
          ))}
      </div>
    </Frame>
  );
}

export const stepPictures = [ApplyPicture, ConfirmPicture, PlanPicture, RidePicture];
