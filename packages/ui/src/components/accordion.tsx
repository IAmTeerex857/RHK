"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

export type AccordionItem = { q: string; a: ReactNode };

export function Accordion({
  items,
  className,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  className?: string;
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panel = `${base}-p${i}`;
        const btn = `${base}-b${i}`;
        return (
          <div
            key={item.q}
            className={cn(
              "rounded-2xl border border-line bg-white transition-shadow duration-200",
              isOpen ? "shadow-card" : "shadow-subtle",
            )}
          >
            <h3 className="m-0">
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left font-display text-[16px] font-semibold text-ink md:px-6 md:py-5 md:text-[17px]"
              >
                <span>{item.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? "var(--color-bus-400)" : "var(--color-raised)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  className="grid size-8 shrink-0 place-items-center rounded-full"
                >
                  <Plus className="size-4" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panel}
                  role="region"
                  aria-labelledby={btn}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-[15px] leading-relaxed text-ink-soft md:px-6 md:pb-6">{item.a}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
