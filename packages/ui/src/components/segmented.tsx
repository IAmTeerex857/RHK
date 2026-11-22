"use client";

/*
 * Segmented control and tabs. The selected thumb glides between options (shared layout id).
 * Options can carry a count ("All 38 · Cleared 37 · Running 1").
 */

import { motion } from "motion/react";
import { useId, type ReactNode } from "react";
import { cn } from "../lib/cn";

export type SegmentOption<V extends string> = { value: V; label: ReactNode; count?: number; icon?: ReactNode };

export function Segmented<V extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
  "aria-label": ariaLabel,
  full,
}: {
  options: SegmentOption<V>[];
  value: V;
  onChange: (v: V) => void;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
  /** Stretch options to fill the width. */
  full?: boolean;
}) {
  const id = useId();
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("inline-flex rounded-full border border-line bg-sunken p-1", full && "flex w-full", className)}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium transition-colors",
              size === "sm" ? "h-7 px-3 text-[13px]" : "h-8 px-3.5 text-[14px]",
              full && "flex-1",
              active ? "text-ink" : "text-ink-muted hover:text-ink",
            )}
          >
            {active ? (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-full border border-line bg-card shadow-subtle"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            ) : null}
            <span className="relative inline-flex items-center gap-1.5">
              {o.icon}
              {o.label}
              {o.count !== undefined ? <span className={cn("tabular", active ? "text-ink-muted" : "text-ink-muted/80")}>{o.count}</span> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Underlined page tabs (Flow 02 · Audience 26 · Rules). */
export function Tabs<V extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: SegmentOption<V>[];
  value: V;
  onChange: (v: V) => void;
  className?: string;
}) {
  const id = useId();
  return (
    <div role="tablist" className={cn("scrollbar-none flex gap-5 overflow-x-auto border-b border-line", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative inline-flex h-11 shrink-0 items-center gap-2 text-[14.5px] font-medium transition-colors",
              active ? "text-ink" : "text-ink-muted hover:text-ink",
            )}
          >
            {o.icon}
            {o.label}
            {o.count !== undefined ? (
              <span className="inline-grid h-5 min-w-5 place-items-center rounded-md bg-raised px-1 text-[12px] tabular text-ink-soft">{o.count}</span>
            ) : null}
            {active ? (
              <motion.span layoutId={`tab-${id}`} className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-ink" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
