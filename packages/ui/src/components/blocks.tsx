"use client";

/*
 * Composed blocks used across the portals.
 */

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { Check, ChevronRight, ChevronsRight } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

/* ------------------------------------------------------------------ stat */

export type StatTone = "teal" | "blue" | "violet" | "orange" | "yellow" | "coral" | "green";
const statTone: Record<StatTone, string> = {
  teal: "bg-route-1 text-white",
  blue: "bg-route-2 text-white",
  violet: "bg-route-3 text-white",
  orange: "bg-route-4 text-white",
  yellow: "bg-bus-400 text-[#1d1a2f]",
  coral: "bg-coral text-white",
  green: "bg-good text-white",
};

/** KPI: label, big number with a small unit, a delta and a muted comparison. */
export function Stat({
  label,
  value,
  unit,
  delta,
  note,
  icon,
  iconTone,
  size = "md",
  className,
  children,
}: {
  /** Fills the icon into a small coloured square, like the reference stat cards. */
  iconTone?: StatTone;
  label?: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  delta?: ReactNode;
  note?: ReactNode;
  icon?: ReactNode;
  size?: "md" | "lg" | "xl";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      {label ? (
        <p className="mb-2 flex items-center gap-2 text-[13px] text-ink-muted">
          {icon && iconTone ? (
            <span className={cn("grid size-5 place-items-center rounded-md [&_svg]:size-3 [&_svg]:stroke-[2.25]", statTone[iconTone])}>{icon}</span>
          ) : icon ? (
            <span className="text-ink-muted [&_svg]:size-4">{icon}</span>
          ) : null}
          {label}
        </p>
      ) : null}
      <p
        className={cn(
          "flex items-baseline gap-1.5 font-display font-medium tracking-[-0.04em] text-ink tabular",
          { md: "text-[30px] leading-none", lg: "text-[44px] leading-none", xl: "text-[64px] leading-[0.95]" }[size],
        )}
      >
        {value}
        {unit ? <span className="text-[0.42em] font-normal tracking-normal text-ink-muted">{unit}</span> : null}
      </p>
      {delta || note ? (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
          {delta}
          {note}
        </p>
      ) : null}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ list rows */

/** "Needs you" row: icon well, title, muted line, chevron. */
export function ActionRow({
  icon,
  tone = "neutral",
  title,
  subtitle,
  meta,
  href,
  onClick,
  className,
  LinkAs,
}: {
  icon?: ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad" | "info";
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  LinkAs?: React.ElementType;
}) {
  const well = {
    neutral: "bg-raised text-ink-soft",
    good: "bg-mint-soft text-good",
    warn: "bg-bus-100 text-warn",
    bad: "bg-coral-soft text-bad",
    info: "bg-sky-soft text-data-500",
  }[tone];
  const inner = (
    <>
      {icon ? <span className={cn("grid size-10 shrink-0 place-items-center rounded-full [&_svg]:size-[18px]", well)}>{icon}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium text-ink">{title}</span>
        {subtitle ? <span className="mt-0.5 block truncate text-[13px] text-ink-muted">{subtitle}</span> : null}
      </span>
      {meta ? <span className="shrink-0 text-[13px] text-ink-muted tabular">{meta}</span> : null}
      {href || onClick ? <ChevronRight className="size-4 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5" /> : null}
    </>
  );
  const cls = cn("group flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors", (href || onClick) && "hover:bg-raised", className);
  if (href) {
    const L = LinkAs ?? "a";
    return (
      <L href={href} className={cls}>
        {inner}
      </L>
    );
  }
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={cls}>
        {inner}
      </button>
    );
  return <div className={cls}>{inner}</div>;
}

/* ------------------------------------------------------------------ empty state */

export function EmptyState({ icon, title, body, action, className }: { icon?: ReactNode; title: ReactNode; body?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      {icon ? <span className="grid size-12 place-items-center rounded-2xl border border-line bg-raised text-ink-muted [&_svg]:size-5">{icon}</span> : null}
      <p className="mt-4 text-[15px] font-medium text-ink">{title}</p>
      {body ? <p className="mt-1 max-w-sm text-[14px] text-ink-muted">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ steps / tree */

export type Step = {
  title: ReactNode;
  detail?: ReactNode;
  meta?: ReactNode;
  state: "done" | "current" | "todo" | "skipped" | "alert";
  children?: ReactNode;
};

/**
 * Vertical steps joined by a rail (the "research run" tree): done ticks, the current step
 * spins, alerts in coral. Used for route stops and the application pipeline.
 */
export function Steps({ steps, className, dense }: { steps: Step[]; className?: string; dense?: boolean }) {
  return (
    <ol className={cn("relative", className)}>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={i} className={cn("relative flex gap-3.5", dense ? "pb-4" : "pb-6", last && "pb-0")}>
            {!last ? (
              <span
                aria-hidden
                className={cn("absolute left-[11px] top-7 bottom-1 w-px", s.state === "done" ? "bg-good/60" : "bg-line-strong")}
              />
            ) : null}
            <span className="relative z-[1] mt-0.5 grid size-6 shrink-0 place-items-center">
              {s.state === "done" ? (
                <span className="grid size-6 place-items-center rounded-full bg-good text-white">
                  <Check className="size-3.5 stroke-[3]" />
                </span>
              ) : s.state === "current" ? (
                <span className="relative grid size-6 place-items-center rounded-full border-2 border-data-500 bg-card">
                  <span className="size-2 animate-pulse rounded-full bg-data-500" />
                </span>
              ) : s.state === "alert" ? (
                <span className="grid size-6 place-items-center rounded-full bg-bad text-[13px] font-bold text-white">!</span>
              ) : s.state === "skipped" ? (
                <span className="grid size-6 place-items-center rounded-full border border-dashed border-line-strong bg-card text-[11px] text-ink-muted">–</span>
              ) : (
                <span className="size-6 rounded-full border border-line-strong bg-card" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className={cn("text-[15px] font-medium", s.state === "todo" || s.state === "skipped" ? "text-ink-soft" : "text-ink", s.state === "alert" && "text-bad")}>
                  {s.title}
                </p>
                {s.meta ? <span className="shrink-0 font-mono text-[13px] text-ink-muted tabular">{s.meta}</span> : null}
              </div>
              {s.detail ? <div className="mt-0.5 text-[13px] text-ink-muted">{s.detail}</div> : null}
              {s.children ? <div className="mt-3">{s.children}</div> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ week strip */

export function WeekStrip({
  days,
  value,
  onChange,
  className,
}: {
  days: { key: string; dow: string; date: string; dots?: number; off?: boolean }[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-7 gap-1", className)} role="tablist" aria-label="Days">
      {days.map((d) => {
        const on = d.key === value;
        return (
          <button
            key={d.key}
            type="button"
            role="tab"
            aria-selected={on}
            disabled={d.off}
            onClick={() => onChange(d.key)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl py-2.5 transition-colors disabled:opacity-40",
              on ? "bg-ink text-cream" : "text-ink hover:bg-raised",
            )}
          >
            <span className={cn("text-[12px]", on ? "text-cream/70" : "text-ink-muted")}>{d.dow}</span>
            <span className="font-display text-[18px] font-medium tabular">{d.date}</span>
            <span className="flex h-1.5 gap-0.5">
              {Array.from({ length: d.dots ?? 0 }, (_, i) => (
                <span key={i} className={cn("size-1.5 rounded-full", on ? "bg-bus-400" : "bg-data-400")} />
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ slide to confirm */

/**
 * Drag the knob to the end to confirm (start route, close route). A deliberate gesture for
 * actions a driver must not trigger by a stray tap. Keyboard: focus the knob, press Enter.
 */
export function SlideToConfirm({
  label,
  doneLabel = "Done",
  onConfirm,
  tone = "brand",
  className,
}: {
  label: string;
  doneLabel?: string;
  onConfirm: () => void;
  tone?: "brand" | "ink" | "bad";
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();
  const fade = useTransform(x, [0, 140], [1, 0]);
  const max = () => (track.current ? track.current.offsetWidth - 64 : 240);
  const finish = () => {
    setDone(true);
    animate(x, max(), { duration: reduce ? 0 : 0.2 });
    onConfirm();
  };
  const bg = { brand: "bg-bus-400 text-[#1d1a2f]", ink: "bg-ink text-cream", bad: "bg-coral text-white" }[tone];
  return (
    <div ref={track} className={cn("relative h-16 overflow-hidden rounded-full p-1.5", bg, className)}>
      <motion.span style={{ opacity: fade }} className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 pl-10 text-[16px] font-medium">
        {label}
        <ChevronsRight className="size-5 opacity-60" />
      </motion.span>
      {done ? <span className="absolute inset-0 grid place-items-center text-[16px] font-medium">{doneLabel}</span> : null}
      <motion.button
        type="button"
        aria-label={label}
        drag={done ? false : "x"}
        dragConstraints={track}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={() => (x.get() > max() * 0.82 ? finish() : animate(x, 0, { type: "spring", stiffness: 500, damping: 35 }))}
        onKeyDown={(e) => e.key === "Enter" && !done && finish()}
        className="relative z-10 grid size-[52px] cursor-grab place-items-center rounded-full bg-card text-ink shadow-[0_2px_8px_rgb(0_0_0/0.18)] active:cursor-grabbing"
      >
        {done ? <Check className="size-5 stroke-[2.5]" /> : <ChevronsRight className="size-5" />}
      </motion.button>
    </div>
  );
}

/* ------------------------------------------------------------------ route map */

export type MapStop = { id: string; x: number; y: number; label: string; state: "done" | "next" | "todo" | "school" };

/**
 * Stylised route map (until Google Maps is connected): a soft street grid, the route as a
 * road, stops as pins, the van as a puck with a heading. Coordinates are 0–100.
 */
export function RouteMap({
  stops,
  van,
  className,
  path,
  vans,
  color = "var(--color-data-500)",
}: {
  stops: MapStop[];
  /** Route colour for the line and the next stop (see routeColor). */
  color?: string;
  van?: { x: number; y: number; label?: string };
  className?: string;
  /** Polyline through these points; defaults to the stops in order. */
  path?: { x: number; y: number }[];
  /** Extra vans (fleet view). */
  vans?: { id: string; x: number; y: number; label: string; tone: "good" | "warn" | "bad" | "data"; color?: string }[];
}) {
  const pts = path ?? stops;
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");
  const tone = { good: "var(--color-good)", warn: "var(--color-warn)", bad: "var(--color-bad)", data: "var(--color-data-500)" };
  return (
    <div className={cn("relative overflow-hidden bg-[#eef0ec] dark:bg-[#15171c]", className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <pattern id="rhk-blocks" width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="12" height="12" className="fill-[#e3e6e0] dark:fill-[#1b1e24]" />
            <rect x="1.2" y="1.2" width="9.6" height="9.6" rx="1.2" className="fill-[#f6f7f4] dark:fill-[#20232a]" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#rhk-blocks)" />
        <path d="M-5 62 C 20 58, 40 70, 60 60 S 95 40, 110 44" className="stroke-[#cfe3f6] dark:stroke-[#1d3550]" strokeWidth="5" fill="none" />
        <rect x="64" y="8" width="22" height="16" rx="3" className="fill-[#dcefd9] dark:fill-[#1b2a20]" />
        <rect x="6" y="74" width="16" height="18" rx="3" className="fill-[#dcefd9] dark:fill-[#1b2a20]" />
        <path d={d} fill="none" className="stroke-white dark:stroke-[#2c3038]" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {stops.map((s) => (
        <span
          key={s.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          title={s.label}
        >
          {s.state === "school" ? (
            <span className="grid size-7 place-items-center rounded-lg border-2 border-white bg-ink text-[11px] font-bold text-cream shadow-md dark:border-[#2c3038]">S</span>
          ) : (
            <span
              className={cn(
                "block rounded-full border-2 border-white shadow dark:border-[#2c3038]",
                s.state === "done" ? "size-3 bg-good" : s.state === "next" ? "size-4" : "size-3 bg-ink-muted",
              )}
              style={s.state === "next" ? { background: color, boxShadow: `0 0 0 4px color-mix(in oklab, ${color} 25%, transparent)` } : undefined}
            />
          )}
        </span>
      ))}
      {vans?.map((v) => (
        <span key={v.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${v.x}%`, top: `${v.y}%` }}>
          <span className="flex items-center gap-1.5 rounded-full border border-line bg-card py-1 pl-1 pr-2.5 text-[12px] font-medium text-ink shadow-float">
            <span className="grid size-5 place-items-center rounded-full text-[11px] text-white" style={{ background: v.color ?? tone[v.tone] }}>
              ▲
            </span>
            {v.color && v.tone !== "good" && v.tone !== "data" ? <span className="size-1.5 rounded-full" style={{ background: tone[v.tone] }} aria-hidden /> : null}
            {v.label}
          </span>
        </span>
      ))}
      {van ? (
        <span className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${van.x}%`, top: `${van.y}%` }}>
          <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-bus-400/40" />
          <span className="relative grid size-9 place-items-center rounded-full border-[3px] border-white bg-bus-400 shadow-float dark:border-[#2c3038]">
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
              <path d="M5 11V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4m-14 0h14m-14 0v5h14v-5M7.5 18.5v1m9-1v1" fill="none" stroke="#1d1a2f" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          {van.label ? (
            <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[11px] font-medium text-cream">{van.label}</span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ misc */

/** Monospace footer line with dividers: "Time 4.4s | Sources 8 | Tokens 8.0k". */
export function MetaStrip({ items, className }: { items: { label: string; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("flex divide-x divide-line", className)}>
      {items.map((i) => (
        <div key={i.label} className="px-4 first:pl-0">
          <dt className="text-[13px] text-ink-muted">{i.label}</dt>
          <dd className="mt-0.5 font-mono text-[18px] font-medium text-ink tabular">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Two-tone greeting: "Hi Tanya, here's today." */
export function Greeting({ strong, soft, className }: { strong: string; soft: string; className?: string }) {
  return (
    <h1 className={cn("font-display text-[28px] font-medium leading-[1.08] tracking-[-0.04em] sm:text-[32px]", className)}>
      <span className="text-ink">{strong}</span> <span className="text-ink-muted">{soft}</span>
    </h1>
  );
}
