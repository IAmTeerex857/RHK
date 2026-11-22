"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, ArrowRight, BadgeDollarSign, CalendarClock, ChevronRight, Download, FileText, Route as RouteIcon, Truck, Wrench } from "lucide-react";
import {
  NOW,
  absences,
  applications,
  audit,
  changeRequests,
  getChild,
  getDriver,
  getRoute,
  getVan,
  invoiceDue,
  invoices,
  lateHeat,
  onTimeByWeek,
  ridesThisWeek,
  routes,
  runs,
  type Run,
} from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge, Delta, StatusDot } from "@rhk/ui/components/badge";
import { ActionRow, Stat } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, MoreButton } from "@rhk/ui/components/card";
import { BarChart, HatchBar, Heatmap, SegmentBar } from "@rhk/ui/components/charts";
import { FilterPill } from "@rhk/ui/components/controls";
import { Segmented } from "@rhk/ui/components/segmented";
import { PageHeader } from "@rhk/ui/shell/app-shell";

export function runTone(r: Run) {
  if (r.status === "late") return { tone: "bad" as const, label: `${r.lateMinutes} min late` };
  if (r.status === "not_started") return { tone: "neutral" as const, label: "Starts soon" };
  if (r.status === "done") return { tone: "good" as const, label: "Done" };
  return r.lateMinutes > 0 ? { tone: "warn" as const, label: `${r.lateMinutes} min behind` } : { tone: "good" as const, label: "On time" };
}

export function TodayView() {
  const [slot, setSlot] = useState<"am" | "pm">("pm");
  const late = runs.find((r) => r.status === "late");
  const lateRoute = late ? getRoute(late.routeId) : undefined;
  const lateNext = late && lateRoute ? lateRoute.stops.find((s) => s.id === late.stops.find((x) => x.state === "next")?.stopId) : undefined;

  const waitingApps = applications.filter((a) => a.status === "submitted");
  const feePaid = applications.filter((a) => a.status === "fee_paid");
  const pending = changeRequests.filter((c) => c.status === "pending");
  const overdue = invoices.filter((i) => i.status === "overdue");
  const overdueTotal = overdue.reduce((s, i) => s + invoiceDue(i), 0);
  const lateFee = absences.find((a) => a.late && !a.feeWaived);

  const shown = slot === "pm" ? runs : [];
  const amRoutes = routes.filter((r) => r.slot === "am");

  return (
    <>
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-2 text-[13px] text-ink-muted">
            <StatusDot tone="good" pulse>
              {NOW.dayLabel}
            </StatusDot>
            <span className="text-line-strong">/</span>
            <span className="tabular">{NOW.time}</span>
          </span>
        }
        title="Today"
        description="Afternoon runs are on the road. Two things need you before pickup ends."
        actions={
          <>
            <Segmented
              aria-label="Run"
              value={slot}
              onChange={setSlot}
              options={[
                { value: "am", label: "Morning", count: 4 },
                { value: "pm", label: "Afternoon", count: 4 },
              ]}
            />
            <FilterPill icon={<RouteIcon />}>All routes</FilterPill>
            <Button variant="outline" size="sm" icon={<Download className="size-4" />}>
              Export
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* on-time */}
        <Card className="flex flex-col lg:col-span-4">
          <CardHeader title="On-time drop-offs" subtitle={`This week · ${NOW.week}`} actions={<MoreButton />} />
          <Stat className="mt-6" size="xl" value="96.8" unit="%" delta={<Delta value={1.1} suffix=" pts" />} note="vs last week" />
          <p className="mt-5 text-[13.5px] leading-relaxed text-ink-soft">
            1.8 pts above the 95% goal. <span className="text-ink">127 of 131</span> rides arrived inside their window.
          </p>
          <HatchBar className="mt-4" value={0.968} min={0.9} max={1} target={0.95} minLabel="90%" targetLabel="Goal 95%" />
          <dl className="mt-4 divide-y divide-line">
            {[
              { k: "Rides given", v: `${ridesThisWeek.given} / ${ridesThisWeek.scheduled}`, d: <Delta value={4.2} /> },
              { k: "Absences", v: ridesThisWeek.absent, d: <Delta value={-2} suffix="" goodWhen="down" /> },
              { k: "Late drop-offs", v: ridesThisWeek.late, d: <Delta value={-1} suffix="" goodWhen="down" /> },
            ].map((r) => (
              <div key={r.k} className="flex items-center justify-between py-3 text-[14px]">
                <dt className="text-ink-muted">{r.k}</dt>
                <dd className="flex items-center gap-3 font-medium tabular">
                  {r.v}
                  {r.d}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto pt-5">
            <p className="text-[13px] font-medium text-ink-muted">By route</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {[
                { name: "Route 1", v: 0.99 },
                { name: "Route 2", v: 0.98 },
                { name: "Route 3", v: 0.96 },
                { name: "Route 4", v: 0.91 },
              ].map((r) => (
                <li key={r.name} className="grid grid-cols-[64px_1fr_48px] items-center gap-3 text-[13px]">
                  <span className="text-ink-soft">{r.name}</span>
                  <span className="relative h-2 rounded-full bg-raised">
                    <span className={`absolute inset-y-0 left-0 rounded-full ${r.v < 0.95 ? "bg-bad" : "bg-data-500"}`} style={{ width: `${((r.v - 0.85) / 0.15) * 100}%` }} />
                  </span>
                  <span className="text-right font-mono tabular text-ink">{(r.v * 100).toFixed(0)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* runs */}
        <Card className="flex flex-col lg:col-span-5" flush>
          <div className="p-5 pb-3">
            <CardHeader
              title={slot === "pm" ? "Afternoon runs" : "Morning runs"}
              subtitle={slot === "pm" ? `${runs.filter((r) => r.status !== "not_started").length} of 4 on the road · updated ${NOW.time}` : "All 4 finished · 47 children to school"}
              actions={
                <Link href="/live" className="inline-flex items-center gap-1 text-[13.5px] font-medium text-ink-soft hover:text-ink">
                  Live map <ChevronRight className="size-4" />
                </Link>
              }
            />
          </div>
          <ul className="divide-y divide-line border-t border-line">
            {slot === "pm"
              ? shown.map((run) => {
                  const route = getRoute(run.routeId);
                  const driver = getDriver(run.driverId);
                  const van = getVan(route.vanId);
                  const t = runTone(run);
                  const done = run.stops.filter((s) => s.state === "done").length;
                  const next = route.stops.find((s) => s.id === run.stops.find((x) => x.state === "next")?.stopId);
                  const nextEta = run.stops.find((x) => x.state === "next")?.eta;
                  return (
                    <li key={run.id}>
                      <Link href={`/routes/${route.id}`} className="group flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-raised/60">
                        <Avatar seed={driver.id} name={driver.name} size={36} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-[14px] font-medium">
                              {route.name.replace(" · Afternoon", "")} <span className="font-normal text-ink-muted">· {van.name} · {driver.name.split(" ")[0]}</span>
                            </p>
                            <Badge tone={t.tone} dot>
                              {t.label}
                            </Badge>
                          </div>
                          <SegmentBar className="mt-2.5" size="sm" value={done} total={route.stops.length} tone={run.status === "late" ? "bad" : "data"} label={`${done} of ${route.stops.length} stops`} />
                          <p className="mt-2 flex items-center justify-between gap-3 text-[12.5px] text-ink-muted">
                            <span className="min-w-0 truncate">
                              {next ? (
                                <>
                                  Next: <span className="text-ink-soft">{next.label}</span>
                                </>
                              ) : (
                                "Route complete"
                              )}
                            </span>
                            <span className="shrink-0 font-mono tabular">
                              {done}/{route.stops.length} · {run.onBoard} on board{nextEta ? ` · ETA ${nextEta}` : ""}
                            </span>
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })
              : amRoutes.map((route) => {
                  const driver = getDriver(route.driverId);
                  return (
                    <li key={route.id} className="flex items-center gap-3.5 px-5 py-3.5">
                      <Avatar seed={driver.id} name={driver.name} size={36} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-[14px] font-medium">
                            {route.name.replace(" · Morning", "")} <span className="font-normal text-ink-muted">· {driver.name.split(" ")[0]}</span>
                          </p>
                          <Badge tone="good" dot>
                            Done {route.end}
                          </Badge>
                        </div>
                        <SegmentBar className="mt-2.5" size="sm" value={route.stops.length} total={route.stops.length} tone="good" />
                      </div>
                    </li>
                  );
                })}
          </ul>
          <dl className="mt-auto grid grid-cols-4 divide-x divide-line border-t border-line">
            {(slot === "pm"
              ? [
                  { k: "On board", v: runs.reduce((n, r) => n + r.onBoard, 0) },
                  { k: "Dropped off", v: 6 },
                  { k: "Still at school", v: 3 },
                  { k: "Absent", v: 1 },
                ]
              : [
                  { k: "To school", v: 13 },
                  { k: "On time", v: "4/4" },
                  { k: "Absent", v: 1 },
                  { k: "Miles", v: "59.7" },
                ]
            ).map((m) => (
              <div key={m.k} className="px-5 py-4">
                <dt className="text-[12.5px] text-ink-muted">{m.k}</dt>
                <dd className="mt-1 font-mono text-[18px] font-medium tabular">{m.v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* highlight + needs you */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          {late && lateRoute ? (
            <section className="theme-light relative overflow-hidden rounded-2xl bg-bus-400 p-5 text-[#1d1a2f]">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1d1a2f]/10 px-2.5 py-1 text-[12px] font-medium">
                  <AlertTriangle className="size-3.5" /> Running late
                </span>
                <span className="font-mono text-[12px] opacity-60">LIVE</span>
              </div>
              <p className="mt-5 font-display text-[44px] font-medium leading-none tracking-[-0.04em] tabular">
                {late.lateMinutes} min
              </p>
              <p className="mt-1 text-[13px] opacity-70">behind on {lateRoute.name.replace(" · Afternoon", "")}</p>
              <p className="mt-4 text-[15px] font-medium leading-snug">
                {getDriver(late.driverId).name.split(" ")[0]} has one stop left{lateNext ? `: the ${lateNext.label} family` : ""}. They&apos;ve been sent a delay alert.
              </p>
              <Link
                href="/live"
                className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-[13.5px] font-medium text-[#1d1a2f] shadow-subtle transition-transform hover:translate-x-0.5"
              >
                Open live map <ArrowRight className="size-4" />
              </Link>
            </section>
          ) : null}

          <Card className="flex-1">
            <CardHeader title="Needs you" subtitle={`${4 + (lateFee ? 1 : 0)} things today`} />
            <div className="-mx-2 mt-3 flex flex-col">
              <ActionRow LinkAs={Link} href="/applications" icon={<FileText />} tone="info" title={`${waitingApps.length} new applications`} subtitle={`Call to confirm a route · ${feePaid.length} fee paid, ready to approve`} />
              <ActionRow LinkAs={Link} href="/schedules" icon={<CalendarClock />} tone="warn" title={`${pending.length} schedule changes`} subtitle="1 inside a week: $35 fee applies" />
              <ActionRow LinkAs={Link} href="/billing" icon={<BadgeDollarSign />} tone="bad" title={`${overdue.length} bills overdue`} subtitle={`$${overdueTotal.toFixed(2)} across Williams and Thompson`} />
              <ActionRow LinkAs={Link} href="/fleet" icon={<Wrench />} tone="bad" title="Van 3 inspection overdue" subtitle="Last checked Nov 9 · Tony drives it at 3:25" />
              {lateFee ? (
                <ActionRow LinkAs={Link} href="/schedules" icon={<Truck />} title="Review a $35 fee" subtitle={`${getChild(lateFee.childId).first} · cancelled ${lateFee.date} with 4 days' notice`} />
              ) : null}
            </div>
          </Card>
        </div>

        {/* trend */}
        <Card className="lg:col-span-4">
          <CardHeader title="Last 12 weeks" subtitle="On-time rate by week" actions={<span className="font-mono text-[12px] text-ink-muted">%</span>} />
          <BarChart
            className="mt-8"
            height={250}
            data={onTimeByWeek}
            min={88}
            max={100}
            reference={95}
            referenceLabel="Goal 95%"
            format={(v) => `${v.toFixed(1)}%`}
          />
        </Card>

        {/* heatmap */}
        <Card className="lg:col-span-5">
          <CardHeader
            title="When we run late"
            subtitle="Late drop-offs by weekday and time, this term"
            actions={<Badge tone="info">Peak: Fri 3:30</Badge>}
          />
          <Heatmap
            className="mt-6"
            rows={lateHeat.rows}
            cols={lateHeat.cols}
            values={lateHeat.values}
            colEvery={2}
            legend={["Fewer", "More late"]}
            format={(r, c, v) => `${r} ${c} PM · ${Math.round((v ?? 0) * 14)} late`}
          />
          <p className="mt-4 rounded-xl border border-line bg-raised px-3.5 py-2.5 text-[13px] text-ink-soft">
            Friday traffic on GA-5 adds about 6 minutes after 3:15. Starting Route 2 five minutes earlier on Fridays would clear most of it.
          </p>
        </Card>

        {/* absences + activity */}
        <Card className="lg:col-span-3">
          <CardHeader title="Absent today" subtitle={`${absences.filter((a) => a.date === "Nov 20").length} children`} />
          <ul className="mt-3 flex flex-col gap-1">
            {absences
              .filter((a) => a.date === "Nov 20")
              .map((a) => {
                const c = getChild(a.childId);
                return (
                  <li key={a.id} className="flex items-center gap-3 py-1.5">
                    <Avatar seed={c.id} name={c.first} size={30} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium">
                        {c.first} {c.last}
                      </p>
                      <p className="truncate text-[12.5px] text-ink-muted">
                        {a.slot === "am" ? "Morning" : "Afternoon"} · {a.reportedBy === "driver" ? "marked by driver" : "parent told us"}
                      </p>
                    </div>
                  </li>
                );
              })}
          </ul>
          <div className="mt-4 border-t border-line pt-4">
            <p className="text-[13px] font-medium text-ink-muted">Recent activity</p>
            <ul className="mt-2 flex flex-col gap-2.5">
              {audit.slice(0, 4).map((e) => (
                <li key={e.id} className="flex gap-2.5 text-[13px]">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink-muted" />
                  <span className="min-w-0 flex-1 text-ink-soft">
                    <span className="font-medium text-ink">{e.who}</span> {e.action.toLowerCase()} {e.target}
                  </span>
                  <span className="shrink-0 font-mono text-[11.5px] text-ink-muted">{e.at}</span>
                </li>
              ))}
            </ul>
            <Link href="/history" className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-ink-soft hover:text-ink">
              Change history <ChevronRight className="size-4" />
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
