"use client";

import { motion } from "motion/react";
import { Bell, Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@rhk/ui/lib/cn";
import { appFeatures } from "@/content/site";
import { LogoMark } from "../site/logo";

/*
 * The app's features as a bento: live tracking is the 2 × 2 hero (a map crop with the van and
 * its arrival time), alerts and the planner stack beside it, and a strip of three below
 * (absence switch, a paid receipt, a chat with the office). Each picture shows one thing.
 */

const [tracking, alerts, planner, absence, pay, message] = appFeatures;

function Tile({ children, className, i }: { children: ReactNode; className?: string; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: i * 0.08, type: "spring", stiffness: 180, damping: 22 }}
      className={cn("flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card", className)}
    >
      {children}
    </motion.div>
  );
}

function Copy({ title, body, className }: { title: string; body: string; className?: string }) {
  return (
    <div className={cn("p-6", className)}>
      <h2 className="font-display text-[20px] font-semibold tracking-[-0.02em]">{title}</h2>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}

const ROUTE = "M30 250 C 90 240, 120 190, 190 186 S 300 150, 330 96 S 450 60, 560 70";

function TrackingMap() {
  return (
    <div className="relative min-h-[260px] flex-1 overflow-hidden bg-[#dff3e8]">
      <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
        {[
          [20, 20, 140, 90],
          [190, 20, 110, 70],
          [360, 130, 150, 90],
          [40, 150, 110, 70],
          [190, 220, 160, 70],
          [460, 10, 120, 40],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="14" fill="#fff" opacity="0.8" />
        ))}
        <ellipse cx="540" cy="230" rx="60" ry="34" fill="#bfe9d2" />
        <path d="M0 125 H600 M0 210 H600 M175 0 V300 M340 0 V300" stroke="#fff" strokeWidth="16" />
        <path d={ROUTE} fill="none" stroke="#1d1a2f" strokeOpacity="0.2" strokeWidth="8" strokeLinecap="round" />
        <motion.path
          d={ROUTE}
          fill="none"
          stroke="#1d1a2f"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0.25 }}
          whileInView={{ pathLength: 0.55 }}
          viewport={{ once: true }}
          transition={{ duration: 2.4, delay: 0.4, ease: [0.45, 0, 0.25, 1] }}
        />
        <circle cx="30" cy="250" r="12" fill="#9b7bff" stroke="#1d1a2f" strokeWidth="3" />
        <circle cx="560" cy="70" r="16" fill="#3fc48a" stroke="#1d1a2f" strokeWidth="3" />
      </svg>
      <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 shadow-card">
        <span className="size-2.5 rounded-full bg-mint" />
        <span className="text-[14px] font-medium">Arrives 7:42</span>
      </div>
    </div>
  );
}

function AlertRow() {
  return (
    <div className="px-6 pt-6">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-raised p-3">
        <LogoMark className="size-9 shrink-0" />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-tight">Ava boarded safely</p>
          <p className="mt-0.5 text-[13px] leading-tight text-ink-muted">Van 2 · now</p>
        </div>
        <Bell className="ml-auto size-4 shrink-0 text-ink-muted" />
      </div>
    </div>
  );
}

function DayChips() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const on = [true, true, false, true, true];
  return (
    <div className="flex gap-1.5 px-6 pt-6">
      {days.map((d, i) => (
        <span
          key={d}
          className={cn(
            "flex-1 rounded-lg border py-2 text-center text-[13px] font-medium",
            on[i] ? "border-bus-500 bg-bus-400" : "border-line-strong bg-white text-ink-muted",
          )}
        >
          {d}
        </span>
      ))}
    </div>
  );
}

function AbsenceSwitch() {
  return (
    <div className="px-6 pt-6">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-raised px-4 py-3.5">
        <span className="text-[15px] font-medium">Not riding today</span>
        <motion.span
          className="relative h-7 w-12 rounded-full"
          initial={{ backgroundColor: "#d9d7e0" }}
          whileInView={{ backgroundColor: "#3fc48a" }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.25 }}
        >
          <motion.span
            className="absolute top-1 size-5 rounded-full bg-white shadow-subtle"
            initial={{ left: 4 }}
            whileInView={{ left: 24 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, type: "spring", stiffness: 420, damping: 28 }}
          />
        </motion.span>
      </div>
    </div>
  );
}

function Receipt() {
  return (
    <div className="relative mx-6 mt-6 h-[132px]">
      <div className="absolute inset-x-4 top-0 h-[120px] rotate-[-2deg] rounded-xl border border-line bg-white p-4 shadow-card">
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] text-ink-muted">November</span>
          <span className="font-display text-[22px] font-semibold tabular-nums">Paid</span>
        </div>
        <div className="mt-3 h-2 w-3/5 rounded-full bg-raised" />
        <div className="mt-2 h-2 w-2/5 rounded-full bg-raised" />
      </div>
      <span className="absolute right-6 top-[54px] grid size-10 rotate-[-10deg] place-items-center rounded-full border-2 border-ink bg-mint">
        <Check className="size-5" strokeWidth={2.75} />
      </span>
    </div>
  );
}

function Chat() {
  return (
    <div className="flex flex-col gap-2 px-6 pt-6">
      <div className="flex max-w-[85%] flex-col gap-1.5 self-start rounded-2xl rounded-bl-md bg-raised px-3.5 py-3">
        <span className="h-2 w-40 max-w-full rounded-full bg-ink/15" />
        <span className="h-2 w-28 rounded-full bg-ink/15" />
      </div>
      <span className="self-end rounded-2xl rounded-br-md bg-bus-400 px-3.5 py-2 text-[14px] font-medium">Thank you</span>
    </div>
  );
}

export function FeaturesBento() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      <Tile i={0} className="md:col-span-2 lg:row-span-2">
        <TrackingMap />
        <Copy title={tracking.title} body={tracking.body} className="md:max-w-lg" />
      </Tile>
      <Tile i={1}>
        <AlertRow />
        <Copy title={alerts.title} body={alerts.body} />
      </Tile>
      <Tile i={2}>
        <DayChips />
        <Copy title={planner.title} body={planner.body} />
      </Tile>
      <Tile i={3}>
        <AbsenceSwitch />
        <Copy title={absence.title} body={absence.body} />
      </Tile>
      <Tile i={4}>
        <Receipt />
        <Copy title={pay.title} body={pay.body} />
      </Tile>
      <Tile i={5} className="md:col-span-2 lg:col-span-1">
        <Chat />
        <Copy title={message.title} body={message.body} />
      </Tile>
    </div>
  );
}
