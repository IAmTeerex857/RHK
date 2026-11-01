"use client";

import { motion } from "motion/react";
import { Check, Send, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@rhk/ui/lib/cn";
import { safety } from "@/content/site";
import { RoadPoint } from "../route/road-point";
import { RideTracker } from "./ride-tracker";
import { SectionHeading } from "./section-heading";

/*
 * Safety as a staggered pair: two columns of tall and short tiles, the right column dropped half
 * a step. The live ride tracker leads; around it, one component per promise (the check-on pair,
 * the office's van board, the message-everyone button) and one big statement on ink.
 */

const [checked, emptyVan, office, ready] = safety;

function Tile({ children, className, i }: { children: ReactNode; className?: string; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: i * 0.08, type: "spring", stiffness: 180, damping: 22 }}
      className={cn("overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-card", className)}
    >
      {children}
    </motion.div>
  );
}

function Copy({ title, body, dark }: { title: string; body: string; dark?: boolean }) {
  return (
    <>
      <h3 className="font-display text-[20px] font-semibold tracking-[-0.02em]">{title}</h3>
      <p className={cn("mt-1.5 text-[15px] leading-relaxed", dark ? "text-cream/70" : "text-ink-soft")}>{body}</p>
    </>
  );
}

function CheckPair() {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {[
        ["Checked on", "7:13"],
        ["Checked off", "7:41"],
      ].map(([label, time]) => (
        <span key={label} className="inline-flex items-center gap-2 rounded-xl border border-line bg-raised py-2 pl-2 pr-3.5 text-[14px] font-medium">
          <span className="grid size-6 place-items-center rounded-full bg-mint text-ink">
            <Check className="size-3.5" strokeWidth={2.75} />
          </span>
          {label}
          <span className="tabular-nums text-ink-muted">{time}</span>
        </span>
      ))}
    </div>
  );
}

function VanBoard() {
  const vans = ["On time", "On time", "Boarding", "On time"];
  return (
    <ul className="mb-6 divide-y divide-line rounded-xl border border-line">
      {vans.map((status, i) => (
        <li key={i} className="flex items-center gap-3 px-3.5 py-2.5 text-[14px]">
          <span className={cn("size-2.5 rounded-full", status === "On time" ? "bg-mint" : "bg-bus-400")} />
          <span className="font-medium">Van {i + 1}</span>
          <span className="ml-auto text-ink-muted">{status}</span>
        </li>
      ))}
    </ul>
  );
}

function SendToAll() {
  return (
    <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-line bg-raised p-2 pl-4">
      <span className="text-[14px] text-ink-soft">Route 2 · every family</span>
      <span className="inline-flex items-center gap-2 rounded-lg bg-ink px-3.5 py-2 text-[14px] font-medium text-cream">
        <Send className="size-4" />
        Send
      </span>
    </div>
  );
}

export function Safety() {
  return (
    <section id="safety" className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Safety first"
          title="Checked on. Checked off. Never left behind"
          body="Every tap the driver makes sends you an alert and updates our office. Here's what a morning looks like."
        />

        <div className="relative mt-12 grid items-start gap-4 lg:grid-cols-[1.1fr_1fr] lg:gap-5">
          {/* road stays off the left edge beside the heading, then runs under the tiles */}
          <RoadPoint className="absolute" style={{ left: "-30%", top: "20%" }} />
          <RoadPoint className="absolute hidden lg:block" style={{ left: "52%", top: "40%" }} />

          <div className="flex flex-col gap-4 lg:gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            >
              <RideTracker className="relative" />
            </motion.div>
            <Tile i={3}>
              <SendToAll />
              <Copy title={ready.title} body={ready.body} />
            </Tile>
          </div>

          <div className="flex flex-col gap-4 lg:mt-14 lg:gap-5">
            <Tile i={1}>
              <CheckPair />
              <Copy title={checked.title} body={checked.body} />
            </Tile>
            <Tile i={2} className="border-ink bg-ink text-cream lg:py-10">
              <ShieldCheck className="size-8 text-bus-300" />
              <p className="mt-5 font-display text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[36px]">
                {emptyVan.title}
              </p>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-cream/70">{emptyVan.body}</p>
            </Tile>
            <Tile i={4}>
              <VanBoard />
              <Copy title={office.title} body={office.body} />
            </Tile>
          </div>
        </div>
      </div>
      <RoadPoint className="absolute hidden lg:block" style={{ left: "92%", bottom: "-20px" }} />
      <RoadPoint className="absolute lg:hidden" style={{ left: "90%", bottom: "-24px" }} />
    </section>
  );
}
