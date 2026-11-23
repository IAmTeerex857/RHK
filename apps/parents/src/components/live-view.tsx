"use client";

import Link from "next/link";
import { BellRing, HeartPulse, MessageSquare, ShieldCheck } from "lucide-react";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { RouteMap, Steps } from "@rhk/ui/components/blocks";
import { Card, CardHeader } from "@rhk/ui/components/card";
import { Ring } from "@rhk/ui/components/charts";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { driver, ETA_LABEL, homeStop, kids, run, school, schoolStop, stopsBefore, useMinutesAway, van } from "./family";

export function LiveView() {
  const mins = useMinutesAway();
  const total = 46; // minutes from leaving school to our door
  return (
    <>
      <PageHeader
        eyebrow={
          <Badge tone="info" dot>
            Live · updates every 10 seconds
          </Badge>
        }
        title={mins > 0 ? `Arriving ${ETA_LABEL}` : "Pulling up now"}
        description={`${kids.map((k) => k.first).join(" and ")} left ${school.name} at 2:44 PM.`}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card flush className="relative overflow-hidden lg:col-span-7">
          {/* Only the school, the van and our own stop. Other families' homes are never shown. */}
          <RouteMap
            className="h-[380px] lg:h-full lg:min-h-[520px]"
            stops={[
              { id: schoolStop.id, x: schoolStop.x, y: schoolStop.y, label: "S", state: "school" },
              { id: homeStop.id, x: homeStop.x, y: homeStop.y, label: "You", state: "next" },
            ]}
            path={[{ x: schoolStop.x, y: schoolStop.y }, run.van, { x: homeStop.x, y: homeStop.y }]}
            van={{ ...run.van, label: van.name }}
          />
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl border border-line bg-card/95 p-3 shadow-float backdrop-blur-md sm:inset-x-auto sm:left-3 sm:w-[360px]">
            <Ring value={1 - mins / total} size={52} stroke={5} tone="brand">
              <span className="font-mono text-[13px] font-medium tabular">{mins}m</span>
            </Ring>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium">{stopsBefore === 0 ? "You're the next stop" : `${stopsBefore} stops before yours`}</p>
              <p className="text-[13px] text-ink-muted">{homeStop.address} · ETA {ETA_LABEL}</p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-5">
          <Card>
            <CardHeader title="Your driver" subtitle="Message the office if you need to reach them" />
            <div className="mt-4 flex items-center gap-3.5">
              <Avatar seed={driver.id} name={driver.name} size={56} status="online" />
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-medium">{driver.name}</p>
                <p className="text-[14px] text-ink-muted">
                  {van.name} · {van.plate} · driving since {driver.since}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/messages" className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line-strong bg-card text-[14px] font-medium transition-colors hover:bg-raised">
                <MessageSquare className="size-4" /> Message the office
              </Link>
            </div>
          </Card>

          <Card>
            <CardHeader title="On board" subtitle="Checked on by the driver at school" />
            <ul className="mt-4 flex flex-col gap-3">
              {kids.map((k) => (
                <li key={k.id} className="flex items-center gap-3">
                  <Avatar seed={k.id} name={k.first} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium">{k.first}</p>
                    {k.medical ? (
                      <p className="flex items-center gap-1.5 text-[13px] text-ink-muted">
                        <HeartPulse className="size-3.5 text-bad" /> Driver has the medical note
                      </p>
                    ) : (
                      <p className="text-[13px] text-ink-muted">Since 2:42 PM</p>
                    )}
                  </div>
                  <Badge tone="good" dot>
                    On board
                  </Badge>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2.5 rounded-xl bg-raised p-3 text-[13px] text-ink-soft">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" />
              The driver hands them only to you or an approved adult, and waits up to five minutes. If no one&apos;s home, the office calls you.
            </p>
          </Card>

          <Card>
            <CardHeader title="Alerts" icon={<BellRing className="size-4" />} />
            <Steps
              className="mt-4"
              dense
              steps={[
                { title: "About 5 minutes away", meta: "3:25 PM", state: "current" },
                { title: "About 10 minutes away", meta: "3:20 PM", state: "done" },
                { title: `Picked up at ${school.short}`, detail: "Maya and Eli checked on", meta: "2:44 PM", state: "done" },
              ]}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
