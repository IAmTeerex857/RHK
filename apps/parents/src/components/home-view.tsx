"use client";

import Link from "next/link";
import { ArrowRight, CalendarX2, HeartPulse, MessageSquare, Repeat, Ticket, UserCheck } from "lucide-react";
import { announcements, invoiceDue, money, NOW, programs } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { Steps } from "@rhk/ui/components/blocks";
import { Card, CardHeader } from "@rhk/ui/components/card";
import { cn } from "@rhk/ui/lib/cn";
import { amHome, amSchool, driver, ETA_LABEL, homeStop, kidNames, kids, openBill, parent, school, stopsBefore, useMinutesAway, useNow, van } from "./family";

export function HomeView() {
  const now = useNow();
  const mins = useMinutesAway();
  const trips = programs.filter((p) => p.childIds.some((id) => kids.some((k) => k.id === id)));

  return (
    <>
      <div className="pb-6 pt-4 lg:pt-6">
        <p className="mb-2 text-[13px] text-ink-muted">
          {NOW.dayLabel} <span className="text-line-strong">/</span> <span className="tabular">{now}</span>
        </p>
        <h1 className="font-display text-[30px] font-medium leading-[1.08] tracking-[-0.04em] sm:text-[34px]">
          <span className="text-ink">Hi {parent.name.split(" ")[0]},</span>{" "}
          <span className="text-ink-muted">{mins > 0 ? `${kidNames} are on the way home.` : `${kidNames} are arriving now.`}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* live ride */}
        <section className="relative flex flex-col overflow-hidden rounded-[22px] bg-bus-400 p-5 text-[#1d1a2f] sm:p-6 lg:col-span-7">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1d1a2f]/[0.08] px-3 py-1 text-[13px] font-medium">
              <span className="size-2 animate-pulse rounded-full bg-[#1d1a2f]" /> On the way home
            </span>
            <span className="font-mono text-[12.5px] font-medium">{stopsBefore === 0 ? "YOU'RE NEXT" : `${stopsBefore} STOPS BEFORE YOU`}</span>
          </div>
          <div className="mt-8 sm:mt-10">
            <p className="text-[14px] font-medium opacity-70">Arriving at {homeStop.address}</p>
            <p className="mt-1 font-display text-[44px] font-semibold leading-none tracking-[-0.05em] tabular sm:text-[56px]">{ETA_LABEL}</p>
            <p className="mt-2 text-[15px] opacity-75">{mins > 0 ? `About ${mins} min away` : "Pulling up now"} · be at the door to receive them</p>
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
            <span className="flex w-full min-w-0 items-center gap-3 rounded-full bg-[#1d1a2f]/[0.08] py-1.5 pl-1.5 pr-4 sm:w-auto sm:flex-1">
              <Avatar seed={driver.id} name={driver.name} size={36} />
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[14px] font-semibold">{driver.name}</span>
                <span className="block truncate text-[12.5px] opacity-70">
                  {van.name} · {van.plate}
                </span>
              </span>
            </span>
            <Link href="/live" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1d1a2f] px-6 sm:w-auto text-[15px] font-semibold text-white transition-transform active:scale-[0.98]">
              Watch live <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <div className="flex flex-col gap-4 lg:col-span-5">
          {openBill ? (
            <Link href="/bills" className="group block rounded-2xl border border-line bg-card p-5 transition-colors hover:border-line-strong">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium">This week&apos;s bill</span>
                <Badge tone="warn" dot>
                  Due today
                </Badge>
              </div>
              <p className="mt-3 font-display text-[34px] font-medium leading-none tracking-[-0.04em] tabular">{money(invoiceDue(openBill))}</p>
              <p className="mt-2 flex items-center justify-between text-[13.5px] text-ink-muted">
                {openBill.periodLabel} · Zelle or Cash App
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          ) : null}
          <div className="grid grid-cols-2 gap-2.5">
            <Quick href="/schedule" icon={<CalendarX2 className="size-5" />} label="Report an absence" />
            <Quick href="/schedule" icon={<Repeat className="size-5" />} label="Request a change" />
            <Quick href={`/children/${kids[0].id}`} icon={<UserCheck className="size-5" />} label="Approved adults" />
            <Quick href="/messages" icon={<MessageSquare className="size-5" />} label="Message the office" />
          </div>
        </div>

        {/* today */}
        <Card className="lg:col-span-7">
          <CardHeader title="Today" subtitle={`${kidNames} · ${school.name}`} />
          <Steps
            className="mt-5"
            steps={[
              { title: "Picked up from home", detail: `${amHome.address} · Route 2 morning`, meta: "7:04 AM", state: "done" },
              { title: `Dropped at ${school.short}`, detail: "Checked in by the driver", meta: amSchool.time.replace(" AM", ""), state: "done" },
              { title: `Picked up at ${school.short}`, detail: `${van.name} · ${driver.name.split(" ")[0]}`, meta: "2:42 PM", state: "done" },
              { title: "Home", detail: "Hand-off to you or an approved adult", meta: `ETA ${ETA_LABEL.replace(" PM", "")}`, state: "current" },
            ]}
          />
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-5">
          {kids.map((k) => (
            <Link key={k.id} href={`/children/${k.id}`} className="flex items-center gap-3.5 rounded-2xl border border-line bg-card p-4 transition-colors hover:border-line-strong">
              <Avatar seed={k.id} name={k.first} size={48} />
              <span className="min-w-0 flex-1">
                <span className="block text-[15.5px] font-medium">
                  {k.first} {k.last}
                </span>
                <span className="block text-[13px] text-ink-muted">
                  {k.grade} grade · {k.teacher}
                </span>
                {k.medical ? (
                  <span className="mt-1 flex items-center gap-1.5 text-[12.5px] font-medium text-bad">
                    <HeartPulse className="size-3.5" /> {k.medical.split(" (")[0]}
                  </span>
                ) : null}
              </span>
              <Badge tone="good" dot>
                On board
              </Badge>
            </Link>
          ))}
          <Card>
            <CardHeader title="Coming up" icon={<Ticket className="size-4" />} actions={<Link href="/trips" className="text-[13px] font-medium text-ink-muted hover:text-ink">All</Link>} />
            <ul className="mt-3">
              <Upcoming title={announcements[0].title} sub="Thanksgiving break · rides resume Nov 30" />
              {trips.map((t) => (
                <Upcoming key={t.id} title={t.name} sub={`${t.dates.split(" · ")[0]} · ${kids.filter((k) => t.childIds.includes(k.id)).map((k) => k.first).join(", ")}`} />
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

function Quick({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className={cn("flex min-h-[92px] flex-col justify-between rounded-2xl border border-line bg-card p-4 transition-colors hover:border-line-strong active:scale-[0.99]")}>
      <span className="text-ink-soft">{icon}</span>
      <span className="text-[14px] font-medium leading-tight">{label}</span>
    </Link>
  );
}

function Upcoming({ title, sub }: { title: string; sub: string }) {
  return (
    <li className="border-b border-line py-3 last:border-0 last:pb-0">
      <p className="text-[14px] font-medium">{title}</p>
      <p className="mt-0.5 text-[13px] text-ink-muted">{sub}</p>
    </li>
  );
}
