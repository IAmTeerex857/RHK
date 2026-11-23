"use client";

/*
 * Small confirmations after an action ("Reminder sent to the Davis family").
 * `toast()` can be called from anywhere; one <Toaster /> renders them (the AppShell has it).
 */

import { AnimatePresence, motion } from "motion/react";
import { Check, Info, TriangleAlert } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "../lib/cn";

type Tone = "good" | "info" | "bad";
type Item = { id: number; title: string; body?: string; tone: Tone };

let items: Item[] = [];
let seq = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(title: string, opts: { body?: string; tone?: Tone } = {}) {
  const id = ++seq;
  items = [...items, { id, title, body: opts.body, tone: opts.tone ?? "good" }].slice(-3);
  emit();
  setTimeout(() => {
    items = items.filter((t) => t.id !== id);
    emit();
  }, 3800);
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const empty: Item[] = [];

export function Toaster() {
  const list = useSyncExternalStore(
    subscribe,
    () => items,
    () => empty,
  );
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-28 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end lg:bottom-6"
    >
      <AnimatePresence initial={false}>
        {list.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex w-full max-w-[380px] items-start gap-3 rounded-2xl border border-line bg-card px-4 py-3 shadow-float"
            role="status"
          >
            <span
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full [&_svg]:size-3",
                t.tone === "good" ? "bg-mint-soft text-good" : t.tone === "bad" ? "bg-coral-soft text-bad" : "bg-sky-soft text-data-500",
              )}
            >
              {t.tone === "good" ? <Check className="stroke-[2.5]" /> : t.tone === "bad" ? <TriangleAlert /> : <Info />}
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-medium text-ink">{t.title}</span>
              {t.body ? <span className="mt-0.5 block text-[13px] text-ink-muted">{t.body}</span> : null}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
