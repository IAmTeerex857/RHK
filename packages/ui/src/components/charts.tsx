"use client";

/*
 * Charts and meters, plain SVG/HTML, no chart library.
 * Rules (dataviz method): one blue ramp for magnitude; past periods hatched, the current
 * one solid; status colours only for state; thin marks with 4px rounded ends; every mark
 * has a hover tooltip; text stays in ink tokens, never in the series colour.
 */

import { motion, useReducedMotion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

/* ------------------------------------------------------------------ progress */

/** Hatched progress bar with an optional target marker ("Bar 98%"). */
export function HatchBar({
  value,
  target,
  min = 0,
  max = 1,
  minLabel,
  targetLabel,
  tone = "data",
  className,
}: {
  value: number;
  target?: number;
  min?: number;
  max?: number;
  minLabel?: string;
  targetLabel?: string;
  tone?: "data" | "good" | "warn" | "bad";
  className?: string;
}) {
  const pct = (v: number) => `${Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100))}%`;
  const color = { data: "text-data-500", good: "text-good", warn: "text-warn", bad: "text-bad" }[tone];
  return (
    <div className={className}>
      <div className="relative h-3 rounded-full bg-raised">
        <motion.div
          className={cn("hatch absolute inset-y-0 left-0 rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: pct(value) }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        {target !== undefined ? (
          <span className="absolute -inset-y-1.5 w-0.5 rounded-full bg-ink" style={{ left: pct(target) }} aria-hidden />
        ) : null}
      </div>
      {minLabel || targetLabel ? (
        <div className="relative mt-2 h-4 text-[12px] text-ink-muted">
          {minLabel ? <span className="absolute left-0">{minLabel}</span> : null}
          {targetLabel && target !== undefined ? (
            <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: pct(target) }}>
              {targetLabel}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** Row of pill segments, filled up to `value` of `total` (seat counts, steps, plan usage). */
export function SegmentBar({
  value,
  total,
  tone = "data",
  size = "md",
  className,
  label,
}: {
  value: number;
  total: number;
  tone?: "data" | "good" | "warn" | "bad" | "ink" | "brand" | "onBrand";
  size?: "sm" | "md";
  className?: string;
  label?: string;
}) {
  const fill = { data: "bg-data-500", good: "bg-good", warn: "bg-warn", bad: "bg-bad", ink: "bg-ink", brand: "bg-bus-400", onBrand: "bg-[#1d1a2f]" }[tone];
  return (
    <div className={cn("flex gap-[3px]", className)} role="meter" aria-valuenow={value} aria-valuemax={total} aria-label={label}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn("flex-1 rounded-full", size === "sm" ? "h-2" : "h-3", i < value ? fill : tone === "onBrand" ? "bg-[#1d1a2f]/15" : "bg-raised")}
        />
      ))}
    </div>
  );
}

/** Ticked gauge (EV "battery level" bar): dense ticks with a marker for now and target. */
export function TickGauge({ value, target, ticks = 48, className }: { value: number; target?: number; ticks?: number; className?: string }) {
  const at = Math.round(value * (ticks - 1));
  const tAt = target !== undefined ? Math.round(target * (ticks - 1)) : -1;
  return (
    <div className={cn("flex h-14 items-center gap-[3px] rounded-full bg-raised px-5", className)} aria-hidden>
      {Array.from({ length: ticks }, (_, i) => {
        const near = Math.max(0, 1 - Math.abs(i - at) / 6);
        const h = 10 + near * 22;
        const done = i <= at;
        return (
          <span
            key={i}
            className={cn("w-[3px] flex-1 rounded-full", i === tAt ? "bg-ink" : done ? "bg-good" : "bg-line-strong")}
            style={{ height: i === tAt ? 32 : h, opacity: done ? 0.45 + near * 0.55 : 1 }}
          />
        );
      })}
    </div>
  );
}

/** Ring gauge (progress around a circle). */
export function Ring({
  value,
  size = 56,
  stroke = 5,
  tone = "good",
  children,
  className,
  track = "var(--color-line-strong)",
}: {
  value: number;
  size?: number;
  stroke?: number;
  tone?: "good" | "data" | "warn" | "bad" | "brand" | "ink";
  children?: ReactNode;
  className?: string;
  track?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = {
    good: "var(--color-good)",
    data: "var(--color-data-500)",
    warn: "var(--color-warn)",
    bad: "var(--color-bad)",
    brand: "var(--color-bus-400)",
    ink: "var(--color-ink)",
  }[tone];
  return (
    <span className={cn("relative inline-grid shrink-0 place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - Math.min(1, Math.max(0, value))) }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ tooltip */

function Tip({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-line bg-card px-3 py-2 text-[12.5px] text-ink shadow-float">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ bar chart */

export type BarDatum = { label: string; value: number; note?: string };

/**
 * Vertical bars: earlier periods hatched, the last (current) one solid, optional dashed
 * reference line ("Bar 98%"). Hover any bar for its value.
 */
export function BarChart({
  data,
  height = 220,
  reference,
  referenceLabel,
  format = (v) => String(v),
  min = 0,
  max,
  className,
  highlightLast = true,
  tone = "data",
}: {
  data: BarDatum[];
  height?: number;
  reference?: number;
  referenceLabel?: string;
  format?: (v: number) => string;
  min?: number;
  max?: number;
  className?: string;
  highlightLast?: boolean;
  tone?: "data" | "brand";
}) {
  const [hover, setHover] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const top = max ?? Math.max(...data.map((d) => d.value), reference ?? 0) * 1.08;
  const h = (v: number) => `${Math.max(2, ((v - min) / (top - min)) * 100)}%`;
  const solid = tone === "brand" ? "bg-bus-400" : "bg-data-500";
  const hatchColor = tone === "brand" ? "text-bus-500/70" : "text-data-400/70";
  return (
    <div className={className}>
      <div className="relative" style={{ height }}>
        {reference !== undefined ? (
          <div className="absolute inset-x-0 z-10 border-t border-dashed border-ink-muted/60" style={{ bottom: h(reference) }}>
            {referenceLabel ? <span className="absolute -top-5 left-0 text-[12px] text-ink-muted">{referenceLabel}</span> : null}
          </div>
        ) : null}
        <div className="absolute inset-0 flex items-end gap-[6px]">
          {data.map((d, i) => {
            const isLast = highlightLast && i === data.length - 1;
            return (
              <div
                key={d.label + i}
                className="relative flex h-full flex-1 items-end justify-center"
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
              >
                {hover === i ? (
                  <Tip>
                    <span className="font-medium">{format(d.value)}</span>
                    <span className="ml-1.5 text-ink-muted">{d.note ?? d.label}</span>
                  </Tip>
                ) : null}
                {isLast ? (
                  <span className="absolute left-1/2 -translate-x-1/2 text-[12.5px] font-medium tabular text-ink" style={{ bottom: `calc(${h(d.value)} + 6px)` }}>
                    {format(d.value)}
                  </span>
                ) : null}
                <motion.span
                  className={cn(
                    "w-full max-w-[22px] rounded-t-[4px] rounded-b-[2px]",
                    isLast ? solid : cn("hatch", hatchColor),
                    hover !== null && hover !== i && "opacity-50",
                  )}
                  initial={reduce ? false : { height: 0 }}
                  animate={{ height: h(d.value) }}
                  transition={{ duration: 0.6, delay: reduce ? 0 : i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-ink-muted tabular">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ heatmap */

/**
 * Rounded-cell heatmap on the blue ramp (5 steps). `values[row][col]` in 0..1.
 * Null cells are "no service" and render as an empty well.
 */
export function Heatmap({
  rows,
  cols,
  values,
  format,
  className,
  cellClassName,
  legend = ["Fewer", "More"],
  colEvery = 1,
}: {
  rows: string[];
  cols: string[];
  values: (number | null)[][];
  format: (row: string, col: string, v: number | null) => string;
  className?: string;
  cellClassName?: string;
  legend?: [string, string] | null;
  /** Show every nth column label. */
  colEvery?: number;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const step = (v: number) =>
    v < 0.15 ? "bg-data-100" : v < 0.35 ? "bg-data-200" : v < 0.55 ? "bg-data-300" : v < 0.8 ? "bg-data-400" : "bg-data-600";
  return (
    <div className={className}>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `auto repeat(${cols.length}, minmax(0, 1fr))` }}>
        {rows.map((r, ri) => (
          <div key={r} className="contents">
            <span className="pr-2 text-[12.5px] leading-[26px] text-ink-muted">{r}</span>
            {cols.map((c, ci) => {
              const v = values[ri]?.[ci] ?? null;
              const k = `${ri}-${ci}`;
              return (
                <span
                  key={k}
                  className={cn(
                    "relative h-[26px] rounded-[7px] transition-transform",
                    v === null ? "bg-raised" : step(v),
                    hover === k && "scale-110",
                    cellClassName,
                  )}
                  onPointerEnter={() => setHover(k)}
                  onPointerLeave={() => setHover(null)}
                >
                  {hover === k ? <Tip>{format(r, c, v)}</Tip> : null}
                </span>
              );
            })}
          </div>
        ))}
        <span />
        {cols.map((c, ci) => (
          <span key={c} className="pt-1 text-center text-[11.5px] text-ink-muted">
            {ci % colEvery === 0 ? c : ""}
          </span>
        ))}
      </div>
      {legend ? (
        <div className="mt-3 flex items-center gap-1.5 text-[12px] text-ink-muted">
          {legend[0]}
          {["bg-data-100", "bg-data-200", "bg-data-300", "bg-data-400", "bg-data-600"].map((c) => (
            <span key={c} className={cn("size-3 rounded-[4px]", c)} />
          ))}
          {legend[1]}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ sparkline */

export function Sparkline({
  values,
  width = 120,
  height = 36,
  className,
  tone = "data",
}: {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
  tone?: "data" | "good" | "bad";
}) {
  const id = useId();
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * (width - 4) + 2, height - 3 - ((v - lo) / (hi - lo || 1)) * (height - 6)]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const color = { data: "var(--color-data-500)", good: "var(--color-good)", bad: "var(--color-bad)" }[tone];
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.18" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${width - 2} ${height} L2 ${height} Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {last ? <circle cx={last[0]} cy={last[1]} r="3.5" fill={color} stroke="var(--color-card)" strokeWidth="2" /> : null}
    </svg>
  );
}

/* ------------------------------------------------------------------ stacked share bar */

/** One horizontal bar split into shares, 2px surface gaps, legend rows below. */
export function ShareBar({
  parts,
  className,
}: {
  parts: { label: string; value: number; className: string; note?: string }[];
  className?: string;
}) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  return (
    <div className={className}>
      <div className="flex h-3 gap-[2px] overflow-hidden rounded-full">
        {parts.map((p) => (
          <span key={p.label} className={cn("h-full first:rounded-l-full last:rounded-r-full", p.className)} style={{ width: `${(p.value / total) * 100}%` }} title={`${p.label}: ${p.note ?? p.value}`} />
        ))}
      </div>
      <ul className="mt-4 divide-y divide-line">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center justify-between py-2.5 text-[14px]">
            <span className="flex items-center gap-2.5 text-ink">
              <span className={cn("size-2.5 rounded-[3px]", p.className)} />
              {p.label}
            </span>
            <span className="flex items-center gap-4 tabular">
              <span className="font-medium text-ink">{p.note ?? p.value}</span>
              <span className="w-10 text-right text-ink-muted">{Math.round((p.value / total) * 100)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
