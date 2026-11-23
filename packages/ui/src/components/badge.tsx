/*
 * Small status pieces. State colour never travels alone: every badge carries a word,
 * and status dots sit next to a label.
 */

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type Tone = "neutral" | "good" | "warn" | "bad" | "info" | "brand" | "lilac" | "ink";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-raised text-ink-soft border-line",
  good: "bg-mint-soft text-[color-mix(in_oklab,var(--color-good)_62%,var(--color-ink))] border-[color-mix(in_oklab,var(--color-good)_14%,transparent)]",
  warn: "bg-bus-100 text-[color-mix(in_oklab,var(--color-warn)_48%,var(--color-ink))] border-[color-mix(in_oklab,var(--color-warn)_18%,transparent)]",
  bad: "bg-coral-soft text-[color-mix(in_oklab,var(--color-bad)_66%,var(--color-ink))] border-[color-mix(in_oklab,var(--color-bad)_14%,transparent)]",
  info: "bg-sky-soft text-[color-mix(in_oklab,var(--color-data-500)_62%,var(--color-ink))] border-[color-mix(in_oklab,var(--color-data-500)_14%,transparent)]",
  brand: "bg-bus-100 text-ink border-[color-mix(in_oklab,var(--color-bus-500)_30%,transparent)]",
  lilac: "bg-lilac-soft text-[color-mix(in_oklab,var(--color-lilac)_60%,var(--color-ink))] border-[color-mix(in_oklab,var(--color-lilac)_16%,transparent)]",
  ink: "bg-ink text-cream border-ink",
};

const dotClasses: Record<Tone, string> = {
  neutral: "bg-ink-muted",
  good: "bg-good",
  warn: "bg-warn",
  bad: "bg-bad",
  info: "bg-data-400",
  brand: "bg-bus-400",
  lilac: "bg-lilac",
  ink: "bg-ink",
};

export function Badge({
  tone = "neutral",
  children,
  dot,
  mono,
  className,
  icon,
}: {
  tone?: Tone;
  children: ReactNode;
  /** Lead with a status dot. */
  dot?: boolean;
  /** Uppercase mono ("● HEALTHY"). */
  mono?: boolean;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-[13px] font-medium",
        mono && "mono-label h-6 text-[11px]",
        toneClasses[tone],
        className,
      )}
    >
      {dot ? <span className={cn("size-1.5 rounded-full", dotClasses[tone])} aria-hidden /> : null}
      {icon}
      {children}
    </span>
  );
}

/** Dot + label, no pill (table status cells). */
export function StatusDot({ tone, children, pulse, className }: { tone: Tone; children: ReactNode; pulse?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[14px] text-ink", className)}>
      <span className="relative grid size-2 place-items-center" aria-hidden>
        {pulse ? <span className={cn("absolute inset-0 animate-ping rounded-full opacity-60", dotClasses[tone])} /> : null}
        <span className={cn("relative size-2 rounded-full", dotClasses[tone])} />
      </span>
      {children}
    </span>
  );
}

/**
 * Change against a comparison period. Direction is shown by the arrow; good/bad by colour
 * (pass `goodWhen="down"` when lower is better, e.g. late drop-offs).
 */
export function Delta({
  value,
  suffix = "%",
  goodWhen = "up",
  className,
}: {
  value: number;
  suffix?: string;
  goodWhen?: "up" | "down";
  className?: string;
}) {
  const dir = value > 0 ? "up" : value < 0 ? "down" : "flat";
  const good = dir === "flat" ? null : dir === goodWhen;
  const Icon = dir === "up" ? ArrowUpRight : dir === "down" ? ArrowDownRight : Minus;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-0.5 rounded-full border px-2 text-[13px] font-medium tabular",
        good === null ? toneClasses.neutral : good ? toneClasses.good : toneClasses.bad,
        className,
      )}
    >
      <Icon className="size-3.5 stroke-[2]" aria-hidden />
      {value > 0 ? "+" : value < 0 ? "−" : ""}
      {Math.abs(value)}
      {suffix}
    </span>
  );
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-grid h-5 min-w-5 place-items-center rounded-md border border-line bg-raised px-1 font-mono text-[11px] font-medium text-ink-muted",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/** Small count pill for nav items; alerts get a soft coral fill. */
export function CountPill({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "alert"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[12px] font-medium tabular",
        tone === "alert" ? "bg-coral-soft text-[color-mix(in_oklab,var(--color-bad)_75%,var(--color-ink))]" : "bg-raised text-ink-soft",
        className,
      )}
    >
      {children}
    </span>
  );
}
