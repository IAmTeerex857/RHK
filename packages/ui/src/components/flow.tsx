"use client";

/*
 * Flows and trees, after the reference panels:
 * - FlowRouter: one source fanning out to several targets on curved, coloured lines with
 *   dots flowing along them ("Model router").
 * - FlowGraph: cards on a grid joined by curves ("Path to launch", workflow builder).
 * - Tree: indented rows with rounded elbow connectors ("Research run", nested sidebars).
 */

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/* ------------------------------------------------------------------ flow router */

export type FlowTarget = { id: string; label: ReactNode; sub?: ReactNode; value: number; valueLabel?: ReactNode; color: string; muted?: boolean };

export function FlowRouter({
  source,
  targets,
  height = 220,
  labelWidth = 200,
  className,
}: {
  source: { label: ReactNode; sub?: ReactNode };
  targets: FlowTarget[];
  height?: number;
  /** Width kept on the right for the target labels. */
  labelWidth?: number;
  className?: string;
}) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const reduce = useReducedMotion();
  const max = Math.max(1, ...targets.map((t) => t.value));
  const pad = 22;
  const sx = 10;
  const sy = height / 2;
  const ex = Math.max(sx + 80, w - labelWidth - 16);
  const ys = targets.map((_, i) => (targets.length === 1 ? sy : pad + (i * (height - pad * 2)) / (targets.length - 1)));

  return (
    <div className={className}>
      <p className="flex flex-wrap items-baseline gap-x-2 text-[12px] text-ink-muted">
        <span className="mono-label">{source.label}</span>
        {source.sub ? <span>{source.sub}</span> : null}
      </p>
      <div ref={ref} className="relative mt-2" style={{ height }}>
      {w > 0 ? (
        <svg width={w} height={height} className="absolute inset-0 overflow-visible" aria-hidden>
          {targets.map((t, i) => {
            const y = ys[i];
            const k = (ex - sx) * 0.45;
            const d = `M${sx} ${sy} C ${sx + k} ${sy}, ${ex - k} ${y}, ${ex} ${y}`;
            const thick = 3 + (t.value / max) * 9;
            return (
              <g key={t.id} opacity={t.muted ? 0.45 : 1}>
                <path d={d} fill="none" stroke={t.color} strokeOpacity={0.14} strokeWidth={thick} strokeLinecap="round" />
                <path d={d} fill="none" stroke={t.color} strokeOpacity={0.55} strokeWidth={1.25} />
                {t.value > 0 ? (
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={t.color}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray="0 9"
                    initial={false}
                    animate={reduce ? undefined : { strokeDashoffset: [0, -18] }}
                    transition={{ duration: 1.1 + i * 0.15, repeat: Infinity, ease: "linear" }}
                  />
                ) : null}
                <circle cx={ex} cy={y} r={5} fill={t.color} />
                <circle cx={ex} cy={y} r={9} fill={t.color} fillOpacity={0.16} />
              </g>
            );
          })}
          <circle cx={sx} cy={sy} r={6} className="fill-card stroke-ink" strokeWidth={1.5} />
        </svg>
      ) : null}
      {w > 0
        ? targets.map((t, i) => (
            <div
              key={t.id}
              className={cn("absolute flex -translate-y-1/2 items-baseline justify-between gap-3", t.muted && "opacity-60")}
              style={{ top: ys[i], left: ex + 18, width: Math.max(120, w - ex - 18) }}
            >
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-medium text-ink">{t.label}</span>
                {t.sub ? <span className="block truncate text-[12px] text-ink-muted">{t.sub}</span> : null}
              </span>
              <span className="shrink-0 font-mono text-[13px] text-ink-muted tabular">{t.valueLabel ?? t.value}</span>
            </div>
          ))
        : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ flow graph */

export type FlowNode = { id: string; col: number; row: number; children: ReactNode; className?: string };
export type FlowEdge = { from: string; to: string; color?: string; dashed?: boolean; active?: boolean };

/** Cards placed on a grid (col/row from 1) and joined right-to-left by curves. */
export function FlowGraph({ nodes, edges, cols, minWidth = 760, className }: { nodes: FlowNode[]; edges: FlowEdge[]; cols: number; minWidth?: number; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const refs = useRef(new Map<string, HTMLDivElement>());
  const reduce = useReducedMotion();
  const [rects, setRects] = useState<Record<string, { l: number; t: number; r: number; b: number }>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });

  useIsoLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const o = el.getBoundingClientRect();
      const next: typeof rects = {};
      refs.current.forEach((n, id) => {
        const r = n.getBoundingClientRect();
        next[id] = { l: r.left - o.left, t: r.top - o.top, r: r.right - o.left, b: r.bottom - o.top };
      });
      setRects(next);
      setSize({ w: el.scrollWidth, h: el.scrollHeight });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  return (
    <div className={cn("scrollbar-none overflow-x-auto", className)}>
      <div ref={box} className="relative grid gap-x-14 gap-y-5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, minWidth }}>
        {size.w ? (
          <svg width={size.w} height={size.h} className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
            {edges.map((e) => {
              const a = rects[e.from];
              const b = rects[e.to];
              if (!a || !b) return null;
              const x1 = a.r;
              const y1 = (a.t + a.b) / 2;
              const x2 = b.l;
              const y2 = (b.t + b.b) / 2;
              const k = Math.max(24, (x2 - x1) * 0.5);
              const d = `M${x1} ${y1} C ${x1 + k} ${y1}, ${x2 - k} ${y2}, ${x2} ${y2}`;
              const c = e.color ?? "var(--color-line-strong)";
              return (
                <g key={`${e.from}-${e.to}`}>
                  <path d={d} fill="none" stroke={c} strokeWidth={1.5} strokeDasharray={e.dashed ? "4 4" : undefined} strokeOpacity={e.active ? 0.5 : 1} />
                  {e.active ? (
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={c}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeDasharray="0 8"
                      initial={false}
                      animate={reduce ? undefined : { strokeDashoffset: [0, -16] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : null}
                  <circle cx={x2} cy={y2} r={3.5} fill={c} />
                </g>
              );
            })}
          </svg>
        ) : null}
        {nodes.map((n) => (
          <div
            key={n.id}
            ref={(el) => {
              if (el) refs.current.set(n.id, el);
              else refs.current.delete(n.id);
            }}
            className={cn("relative self-center", n.className)}
            style={{ gridColumn: n.col, gridRow: n.row }}
          >
            {n.children}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ tree */

export type TreeNode = {
  id: string;
  title: ReactNode;
  /** Muted text after the title. */
  detail?: ReactNode;
  /** Right-aligned mono meta (a time, a count). */
  meta?: ReactNode;
  /** 24px leading element: an icon, a status mark or an avatar. */
  icon?: ReactNode;
  tone?: "default" | "muted" | "good" | "bad";
  children?: TreeNode[];
};

/** Indented tree with rounded elbow connectors. */
export function Tree({ nodes, className }: { nodes: TreeNode[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {nodes.map((n) => (
        <TreeItem key={n.id} node={n} root />
      ))}
    </ul>
  );
}

function TreeItem({ node, root, last }: { node: TreeNode; root?: boolean; last?: boolean }) {
  return (
    <li className={cn("relative", !root && "pl-8")}>
      {!root && !last ? <span aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-line-strong" /> : null}
      {!root ? <span aria-hidden className="absolute left-[11px] top-0 h-[18px] w-[14px] rounded-bl-[8px] border-b border-l border-line-strong" /> : null}
      <div className="flex min-h-9 items-center gap-2.5 py-1">
        <span className="grid size-6 shrink-0 place-items-center text-ink-muted [&_svg]:size-4">{node.icon ?? <span className="size-1.5 rounded-full bg-ink-muted" />}</span>
        <span className="min-w-0 flex-1 text-[14px]">
          <span className={cn("font-medium", node.tone === "muted" ? "text-ink-muted" : node.tone === "good" ? "text-good" : node.tone === "bad" ? "text-bad" : "text-ink")}>{node.title}</span>
          {node.detail ? <span className="text-ink-muted"> · {node.detail}</span> : null}
        </span>
        {node.meta ? <span className="shrink-0 font-mono text-[13px] text-ink-muted tabular">{node.meta}</span> : null}
      </div>
      {node.children?.length ? (
        <ul className="relative">
          {node.children.map((c, i) => (
            <TreeItem key={c.id} node={c} last={i === node.children!.length - 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
