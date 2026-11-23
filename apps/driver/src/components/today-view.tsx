"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock3, Fuel, HeartPulse, MessageSquare, Megaphone, Sunrise } from "lucide-react";
import { announcements, conversations, getChild, NOW, shifts } from "@rhk/fixtures";
import { Avatar, AvatarStack } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { Card, CardHeader } from "@rhk/ui/components/card";
import { SegmentBar } from "@rhk/ui/components/charts";
import { cn } from "@rhk/ui/lib/cn";
import { routeColor } from "@rhk/ui/lib/route-color";
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
        <h1 className="font-display text-[28px] font-medium leading-[1.08] tracking-[-0.04em] sm:text-[32px]">
          <span className="text-ink">Good afternoon, {me.name.split(" ")[0]}.</span>{" "}
          <span className="text-ink-muted">{headline(run.phase)}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <RunHero className="lg:col-span-7" />
        <ComingUp className="lg:col-span-5" />

        <Card className="lg:col-span-4">
          <CardHeader
            title="On board now"
            subtitle={`${van.name} · ${van.capacity} seats`}
            actions={<span className="font-display text-[28px] font-medium leading-none tracking-[-0.04em] tabular">{onBoard.length}</span>}
          />
          {onBoard.length ? (
            <div className="mt-4 flex items-center gap-3">
              <AvatarStack people={onBoard.map((c) => ({ seed: c.id, name: c.first }))} size={30} max={5} />
              <p className="min-w-0 truncate text-[14px] text-ink-soft">{onBoard.map((c) => c.first).join(", ")}</p>
            </div>
          ) : (
            <p className="mt-4 text-[14px] text-ink-muted">Nobody on the van</p>
          )}
          {medical.length ? (
            <ul className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
              {medical.map((c) => (
                <li key={c.id} className="flex items-start gap-2.5 text-[14px]">
                  <HeartPulse className="mt-0.5 size-4 shrink-0 text-bad" />
                  <span className="text-ink-soft">
                    <span className="font-medium text-ink">{c.first}</span> · {c.medical}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>

        <Card flush className="lg:col-span-4">
          <div className="px-5 pb-2 pt-5">
            <CardHeader title="Today's runs" subtitle={`${route.name.split(" · ")[0]} · clock in for each run`} />
          </div>
          <ul>
            <RunRow
              icon={<Sunrise className="size-4" />}
              title="Morning"
              sub={`${am.in} – ${am.out} · ${am.miles} mi`}
              right={<span className="font-mono text-[13px] text-ink-muted tabular">{am.hours.toFixed(1)} h</span>}
              done
            />
            <RunRow
              icon={<Clock3 className="size-4" />}
              title="Afternoon"
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

        <Card className="lg:col-span-4">
          <CardHeader title="This week" subtitle={NOW.week} actions={<Link href="/hours" className="text-[13px] font-medium text-ink-muted hover:text-ink">Hours</Link>} />
          <dl className="mt-5 grid grid-cols-3 gap-3">
            <WeekStat label="Hours" value={hours.toFixed(1)} />
            <WeekStat label="On time" value={`${Math.round(me.onTimeRate * 100)}%`} />
            <WeekStat label="Runs" value={String(week.length)} />
          </dl>
          <Link href="/schedule" className="mt-5 flex items-center gap-3 rounded-xl border border-line px-3.5 py-3 transition-colors hover:bg-raised/60">
            <CalendarDays className="size-4 shrink-0 text-ink-muted" />
            <span className="min-w-0 flex-1 truncate text-[14px]">
              Next: <span className="font-medium">Mon, Nov 23 · 6:40 AM</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-ink-muted" />
          </Link>
        </Card>

        <Card className="lg:col-span-12">
          <CardHeader title="From the office" icon={<MessageSquare className="size-4" />} actions={<Link href="/messages" className="text-[13px] font-medium text-ink-muted hover:text-ink">Open</Link>} />
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            <Link href="/messages" className="-m-1 flex items-start gap-3 rounded-xl p-1 transition-colors hover:bg-raised/60">
              <Avatar seed="st-clara" name={lastFromOffice.author} size={34} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px] font-medium">{lastFromOffice.author}</span>
                  <span className="font-mono text-[12px] text-ink-muted tabular">{lastFromOffice.at.replace("Today, ", "")}</span>
                </span>
                <span className="mt-0.5 block text-[14px] text-ink-soft">{lastFromOffice.body}</span>
              </span>
            </Link>
            <div className="flex items-start gap-3 border-t border-line pt-4 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-raised">
                <Megaphone className="size-4 text-ink-muted" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-medium">{announcements[1].title}</span>
                <span className="mt-0.5 block text-[14px] text-ink-muted">{announcements[1].body}</span>
              </span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function WeekStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[13px] text-ink-muted">{label}</dt>
      <dd className="mt-1 font-display text-[28px] font-medium leading-none tracking-[-0.04em] tabular">{value}</dd>
    </div>
  );
}

/** Every stop on this run as a timeline in the route colour: done, here now, still to come. */
function ComingUp({ className }: { className?: string }) {
  const run = useRun();
  const color = routeColor(route.id);
  const live = run.phase === "live" || run.phase === "closing";
  return (
    <Card flush className={cn("flex flex-col", className)}>
      <div className="px-5 pb-1 pt-5">
        <CardHeader
          title={live ? "Stops on this run" : "This afternoon's stops"}
          subtitle={`${route.name} · ${route.stops.length} stops · ${route.miles} mi`}
          actions={<Link href="/route" className="text-[13px] font-medium text-ink-muted hover:text-ink">Map</Link>}
        />
      </div>
      <ol className="flex flex-1 flex-col justify-between px-5 pb-4 pt-3">
        {route.stops.map((stop, i) => {
          const doneAt = run.stopsDone[stop.id];
          const state = doneAt ? "done" : live && i === run.current ? "now" : "todo";
          const last = i === route.stops.length - 1;
          const kids = stop.childIds.map((id) => getChild(id).first);
          const what =
            stop.kind === "school" ? `Pick up ${kids.length}` : stop.kind === "satellite" ? "End of run" : `Drop ${kids.join(" and ")}`;
          const when = doneAt ? doneAt : state === "now" ? (run.current === 3 && !run.arrivedAt ? "3:30 PM" : stop.time) : stop.time;
          return (
            <li key={stop.id} className="relative flex gap-3 pb-1">
              {!last ? (
                <span
                  aria-hidden
                  className="absolute left-[9px] top-6 -bottom-1 w-0.5 rounded-full"
                  style={{ background: doneAt ? color : "var(--color-line-strong)" }}
                />
              ) : null}
              <span className="relative mt-1.5 grid size-5 shrink-0 place-items-center">
                {state === "done" ? (
                  <span className="grid size-5 place-items-center rounded-full text-white" style={{ background: color }}>
                    <Check className="size-3 stroke-[3]" />
                  </span>
                ) : state === "now" ? (
                  <>
                    <span className="absolute inset-0 animate-ping rounded-full opacity-40" style={{ background: color }} />
                    <span className="relative size-5 rounded-full border-[5px] bg-card" style={{ borderColor: color }} />
                  </>
                ) : (
                  <span className="size-3.5 rounded-full border-2 border-line-strong bg-card" />
                )}
              </span>
              <div
                className={cn(
                  "flex min-w-0 flex-1 items-start justify-between gap-3 rounded-xl px-2.5 py-1.5",
                  state === "now" && "bg-raised",
                )}
              >
                <span className="min-w-0">
                  <span className={cn("block truncate text-[14px] font-medium", state === "done" ? "text-ink-muted" : "text-ink")}>{stopName(stop)}</span>
                  <span className="block truncate text-[13px] text-ink-muted">{what}</span>
                </span>
                <span className="shrink-0 pt-px text-right">
                  <span className={cn("block font-mono text-[13px] tabular", state === "done" ? "text-ink-muted" : "text-ink")}>{when}</span>
                  <span className="block text-[12px] text-ink-muted">{state === "done" ? "Done" : state === "now" ? (run.arrivedAt ? "Here now" : "Next") : "Planned"}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
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
        <span className="block truncate text-[13px] text-ink-muted">{sub}</span>
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
  const dropping = stop && stop.kind !== "school" ? stop.childIds.filter((id) => run.kids[id]?.state === "on").map((id) => getChild(id)) : [];

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
        {run.phase === "live" && run.late ? <span className="font-mono text-[13px] font-medium">{run.late.minutes} min behind</span> : null}
      </div>

      <div className="mt-6 sm:mt-8">
        {run.phase === "live" && stop ? (
          <>
            <p className="text-[14px] font-medium opacity-70">
              Stop {run.current + 1} of {route.stops.length} · {run.arrivedAt ? "you're here" : `ETA ${etaStop}`}
            </p>
            <p className="mt-1 font-display text-[32px] font-medium leading-[1.02] tracking-[-0.045em] sm:text-[40px]">{stopName(stop)}</p>
            <p className="mt-2 text-[15px] opacity-75">{stop.address}</p>
            {dropping.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {dropping.map((c) => (
                  <span key={c.id} className="inline-flex h-10 items-center gap-2 rounded-full bg-white/55 pl-1 pr-3.5 text-[14px] font-medium">
                    <Avatar seed={c.id} name={c.first} size={32} />
                    {c.first}
                    {c.medical ? <HeartPulse className="size-4 text-[#b4231a]" aria-label={c.medical} /> : null}
                  </span>
                ))}
                <span className="inline-flex h-10 items-center px-1 text-[13px] font-medium opacity-70">
                  Hand to an approved adult
                </span>
              </div>
            ) : null}
          </>
        ) : run.phase === "pre" ? (
          <>
            <p className="text-[14px] font-medium opacity-70">Starts 2:30 PM at Pine Ridge Elementary</p>
            <p className="mt-1 font-display text-[32px] font-medium leading-[1.02] tracking-[-0.045em] sm:text-[40px]">5 riders · 6 stops</p>
            <p className="mt-2 text-[15px] opacity-75">
              {van.name} · {van.plate} · {route.miles} mi
            </p>
          </>
        ) : (
          <>
            <p className="text-[14px] font-medium opacity-70">{run.phase === "closed" ? `Clocked out ${run.clockOut}` : "Walk the van before you clock out"}</p>
            <p className="mt-1 font-display text-[32px] font-medium leading-[1.02] tracking-[-0.045em] sm:text-[40px]">
              {run.phase === "closed" ? "All riders home" : "Check every seat"}
            </p>
          </>
        )}
      </div>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between text-[13px] font-medium">
          <span>
            {done} of {route.stops.length} stops
          </span>
          <span className="flex items-center gap-3 font-mono">
            <span>{run.onBoard.length} on board</span>
            {run.phase === "live" ? (
              <span className="inline-flex items-center gap-1" title="Fuel">
                <Fuel className="size-3.5" aria-hidden />
                Fuel {Math.round((run.fuel ?? 0.5) * 100)}%
              </span>
            ) : null}
          </span>
        </div>
        <SegmentBar className="mt-2" value={done} total={route.stops.length} tone="onBrand" size="sm" label="Stops done" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link
          href={cta.href}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#1d1a2f] px-6 text-[16px] font-medium text-white transition-transform active:scale-[0.98] sm:flex-none"
        >
          {cta.label}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
