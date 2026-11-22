"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock3, Fuel, HeartPulse, MessageSquare, Megaphone, Sunrise } from "lucide-react";
import { announcements, conversations, getChild, NOW, shifts } from "@rhk/fixtures";
import { Avatar, AvatarStack } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { Card, CardHeader } from "@rhk/ui/components/card";
import { SegmentBar } from "@rhk/ui/components/charts";
import { cn } from "@rhk/ui/lib/cn";
import { me, route, stopName, useMockTime, useRun, van } from "./run-store";

const am = shifts.find((s) => s.driverId === me.id && s.date === NOW.short && s.slot === "am")!;
const week = shifts.filter((s) => s.driverId === me.id);
const hours = week.reduce((n, s) => n + s.hours, 0);
const thread = conversations.find((c) => c.with.id === me.id)!;
const lastFromOffice = [...thread.messages].reverse().find((m) => m.from === "office")!;

export function TodayView() {
  const run = useRun();
  const time = useMockTime();
  const onBoard = run.onBoard.map((id) => getChild(id));
  const medical = onBoard.filter((c) => c.medical);

  return (
    <>
      <div className="pb-6 pt-4 lg:pt-6">
        <p className="mb-2 flex items-center gap-2 text-[13px] text-ink-muted">
          <span className="tabular">{NOW.dayLabel}</span>
          <span className="text-line-strong">/</span>
          <span className="tabular">{time}</span>
        </p>
        <h1 className="font-display text-[30px] font-medium leading-[1.08] tracking-[-0.04em] sm:text-[34px]">
          <span className="text-ink">Good afternoon, {me.name.split(" ")[0]}.</span>{" "}
          <span className="text-ink-muted">{headline(run.phase)}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <RunHero className="lg:col-span-7" />

        <div className="flex flex-col gap-4 lg:col-span-5">
          <Card>
            <CardHeader
              title="On board now"
              subtitle={onBoard.length ? `${van.name} · ${van.capacity} seats` : "Nobody on the van"}
              actions={<span className="font-display text-[28px] font-medium leading-none tracking-[-0.04em] tabular">{onBoard.length}</span>}
            />
            {onBoard.length ? (
              <div className="mt-4 flex items-center gap-3">
                <AvatarStack people={onBoard.map((c) => ({ seed: c.id, name: c.first }))} size={32} max={5} />
                <p className="text-[13.5px] text-ink-soft">{onBoard.map((c) => c.first).join(", ")}</p>
              </div>
            ) : null}
            {medical.length ? (
              <ul className="mt-4 flex flex-col gap-2">
                {medical.map((c) => (
                  <li key={c.id} className="flex items-start gap-2.5 rounded-xl bg-coral-soft px-3 py-2.5 text-[13.5px] text-ink">
                    <HeartPulse className="mt-0.5 size-4 shrink-0 text-bad" />
                    <span>
                      <span className="font-medium">{c.first}</span> · {c.medical}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>

          <Card flush>
            <div className="px-5 pb-2 pt-5">
              <CardHeader title="Today's runs" subtitle="Clock in and out for each run" />
            </div>
            <ul>
              <RunRow
                icon={<Sunrise className="size-4" />}
                title="Morning · Route 2"
                sub={`${am.in} – ${am.out} · ${am.miles} mi`}
                right={<span className="font-mono text-[13px] tabular">{am.hours.toFixed(1)} h</span>}
                done
              />
              <RunRow
                icon={<Clock3 className="size-4" />}
                title="Afternoon · Route 2"
                sub={run.clockIn ? `Clocked in ${run.clockIn}${run.clockOut ? ` – ${run.clockOut}` : ""}` : "Pre-trip opens 2:00 PM"}
                right={
                  run.phase === "closed" ? (
                    <Badge tone="good">Done</Badge>
                  ) : run.phase === "pre" ? (
                    <Badge>Not started</Badge>
                  ) : (
                    <Badge tone="info" dot>
                      On the clock
                    </Badge>
                  )
                }
                done={run.phase === "closed"}
              />
            </ul>
          </Card>
        </div>

        <Card className="lg:col-span-7">
          <CardHeader title="From the office" icon={<MessageSquare className="size-4" />} actions={<Link href="/messages" className="text-[13px] font-medium text-ink-muted hover:text-ink">Open</Link>} />
          <Link href="/messages" className="mt-4 flex items-start gap-3 rounded-xl p-1 transition-colors hover:bg-raised/60">
            <Avatar seed="st-clara" name={lastFromOffice.author} size={34} />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[14px] font-medium">{lastFromOffice.author}</span>
                <span className="text-[12.5px] text-ink-muted">{lastFromOffice.at.replace("Today, ", "")}</span>
              </span>
              <span className="mt-0.5 block text-[14px] text-ink-soft">{lastFromOffice.body}</span>
            </span>
          </Link>
          <div className="mt-4 flex items-start gap-3 border-t border-line pt-4">
            <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-raised">
              <Megaphone className="size-4 text-ink-muted" />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-medium">{announcements[1].title}</span>
              <span className="mt-0.5 block text-[13.5px] text-ink-muted">{announcements[1].body}</span>
            </span>
          </div>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader title="This week" subtitle={NOW.week} actions={<Link href="/hours" className="text-[13px] font-medium text-ink-muted hover:text-ink">Hours</Link>} />
          <dl className="mt-5 grid grid-cols-3 gap-3">
            <div>
              <dt className="text-[12.5px] text-ink-muted">Hours</dt>
              <dd className="mt-1 font-display text-[26px] font-medium leading-none tracking-[-0.04em] tabular">{hours.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="text-[12.5px] text-ink-muted">On time</dt>
              <dd className="mt-1 font-display text-[26px] font-medium leading-none tracking-[-0.04em] tabular">{Math.round(me.onTimeRate * 100)}%</dd>
            </div>
            <div>
              <dt className="text-[12.5px] text-ink-muted">Runs</dt>
              <dd className="mt-1 font-display text-[26px] font-medium leading-none tracking-[-0.04em] tabular">{week.length}</dd>
            </div>
          </dl>
          <Link href="/schedule" className="mt-5 flex items-center gap-3 rounded-xl border border-line px-3.5 py-3 transition-colors hover:bg-raised/60">
            <CalendarDays className="size-4 text-ink-muted" />
            <span className="flex-1 text-[13.5px]">
              Next: <span className="font-medium">Monday, Nov 23 · 6:40 AM</span>
            </span>
            <ArrowRight className="size-4 text-ink-muted" />
          </Link>
        </Card>
      </div>
    </>
  );
}

const headline = (p: string) =>
  ({ pre: "Pre-trip opens at 2:00 PM.", live: "Route 2 is on the road.", closing: "Last stop done. Close the route.", closed: "You're done for today." })[p];

function RunRow({ icon, title, sub, right, done }: { icon: React.ReactNode; title: string; sub: string; right: React.ReactNode; done?: boolean }) {
  return (
    <li className="flex items-center gap-3 border-t border-line px-5 py-3.5">
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", done ? "bg-mint-soft text-good" : "bg-raised text-ink-muted")}>
        {done ? <Check className="size-4 stroke-[2.5]" /> : icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium">{title}</span>
        <span className="block truncate text-[12.5px] text-ink-muted">{sub}</span>
      </span>
      {right}
    </li>
  );
}

/** The big yellow card: what to do next on this run. */
function RunHero({ className }: { className?: string }) {
  const run = useRun();
  const stop = run.stop;
  const done = Object.keys(run.stopsDone).length;
  const etaStop = stop ? run.current === 3 && !run.arrivedAt ? "3:30 PM" : stop.time : "";
  const dropping = stop && stop.kind !== "school" ? stop.childIds.filter((id) => run.kids[id]?.state === "on").map((id) => getChild(id).first) : [];

  const cta =
    run.phase === "pre"
      ? { href: "/start", label: "Clock in and start pre-trip" }
      : run.phase === "closing"
        ? { href: "/route/finish", label: "Empty-van check and clock out" }
        : run.phase === "closed"
          ? { href: "/hours", label: "See your hours" }
          : { href: "/route", label: "Continue route" };

  return (
    <section className={cn("relative flex flex-col overflow-hidden rounded-[22px] bg-bus-400 p-5 text-[#1d1a2f] sm:p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#1d1a2f]/[0.08] px-3 py-1 text-[13px] font-medium">
          {run.phase === "live" ? <span className="size-2 animate-pulse rounded-full bg-[#1d1a2f]" /> : null}
          {run.phase === "live" ? "Live" : run.phase === "pre" ? "Next run" : run.phase === "closing" ? "Last stop done" : "Run finished"} · {route.name}
        </span>
        {run.phase === "live" && run.late ? <span className="font-mono text-[12.5px] font-medium">{run.late.minutes} MIN BEHIND</span> : null}
      </div>

      <div className="mt-8 sm:mt-10">
        {run.phase === "live" && stop ? (
          <>
            <p className="text-[14px] font-medium opacity-70">
              Stop {run.current + 1} of {route.stops.length} · {run.arrivedAt ? "you're here" : `ETA ${etaStop}`}
            </p>
            <p className="mt-1 font-display text-[34px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[44px]">{stopName(stop)}</p>
            <p className="mt-2 text-[15px] opacity-75">
              {stop.address}
              {dropping.length ? ` · drop ${dropping.join(" and ")}` : ""}
            </p>
          </>
        ) : run.phase === "pre" ? (
          <>
            <p className="text-[14px] font-medium opacity-70">Starts 2:30 PM at Pine Ridge Elementary</p>
            <p className="mt-1 font-display text-[34px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[44px]">5 riders · 6 stops</p>
            <p className="mt-2 text-[15px] opacity-75">
              {van.name} · {van.plate} · {route.miles} mi
            </p>
          </>
        ) : (
          <>
            <p className="text-[14px] font-medium opacity-70">{run.phase === "closed" ? `Clocked out ${run.clockOut}` : "Walk the van before you clock out"}</p>
            <p className="mt-1 font-display text-[34px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[44px]">
              {run.phase === "closed" ? "All riders home" : "Check every seat"}
            </p>
          </>
        )}
      </div>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between text-[12.5px] font-medium">
          <span>
            {done} of {route.stops.length} stops
          </span>
          <span className="font-mono">{run.onBoard.length} ON BOARD</span>
        </div>
        <SegmentBar className="mt-2" value={done} total={route.stops.length} tone="onBrand" size="sm" label="Stops done" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link
          href={cta.href}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#1d1a2f] px-6 text-[15.5px] font-semibold text-white transition-transform active:scale-[0.98] sm:flex-none"
        >
          {cta.label}
          <ArrowRight className="size-4" />
        </Link>
        {run.phase === "live" ? (
          <span className="inline-flex h-12 items-center gap-2 rounded-full bg-[#1d1a2f]/[0.08] px-4 text-[13.5px] font-medium">
            <Fuel className="size-4" /> {Math.round((run.fuel ?? 0.5) * 100)}%
          </span>
        ) : null}
      </div>
    </section>
  );
}
