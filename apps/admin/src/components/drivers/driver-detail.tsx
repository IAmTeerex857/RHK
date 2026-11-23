"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Clock3, MessageSquare, Phone } from "lucide-react";
import { courses, getDriver, getVan, routesFor, shifts, timeOff } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge, Delta } from "@rhk/ui/components/badge";
import { Stat } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Row } from "@rhk/ui/components/card";
import { BarChart } from "@rhk/ui/components/charts";
import { Crumb, PageHeader } from "@rhk/ui/shell/app-shell";

export function DriverDetail({ id }: { id: string }) {
  const d = getDriver(id);
  const van = d.vanId ? getVan(d.vanId) : null;
  const rts = routesFor(id);
  const mine = shifts.filter((s) => s.driverId === id);
  const weekMiles = mine.reduce((n, s) => n + s.miles, 0);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => ({
    label: day,
    value: mine.filter((s) => s.date.startsWith(day)).reduce((n, s) => n + s.hours, 0),
  }));

  return (
    <>
      <Crumb>{d.name}</Crumb>
      <PageHeader
        eyebrow={
          <span className="flex items-center gap-2">
            <Avatar seed={d.id} name={d.name} size={28} status="online" />
            <Badge tone={d.status === "substitute" ? "lilac" : "good"} dot>
              {d.status === "substitute" ? "Substitute" : "Active"}
            </Badge>
          </span>
        }
        title={d.name}
        description={`${van ? `${van.name} · ${van.plate}` : "No regular van"} · driving with us since ${d.since}`}
        actions={
          <>
            <Button variant="outline" size="sm" href={`tel:${d.phone}`} icon={<Phone className="size-4" />}>
              Call
            </Button>
            <Button variant="ink" size="sm" href="/messages" linkAs={Link} icon={<MessageSquare className="size-4" />}>
              Message
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-3">
          <Stat label="Hours this week" value={d.hoursThisWeek.toFixed(1)} unit="h" size="lg" delta={<Delta value={2.5} suffix="h" />} note="vs last week" />
        </Card>
        <Card className="lg:col-span-3">
          <Stat label="On time" value={Math.round(d.onTimeRate * 100)} unit="%" size="lg" delta={<Delta value={1} suffix=" pt" />} note="vs last term" />
        </Card>
        <Card className="lg:col-span-3">
          <Stat label="Miles this week" value={weekMiles.toFixed(0)} unit="mi" size="lg" note={van ? `${van.name} odometer` : "From check-ins"} />
        </Card>
        <Card className="lg:col-span-3">
          <Stat label="Training" value={`${d.trainingDone}/${d.trainingTotal}`} size="lg" note={d.trainingDone === d.trainingTotal ? "All courses done" : "Courses still open"} />
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader title="Hours by day" subtitle="Both runs, Nov 16 – 20" actions={<span className="font-mono text-[12px] text-ink-muted">Hours</span>} />
          <BarChart className="mt-8" height={180} data={days} format={(v) => `${v.toFixed(2)} h`} />
        </Card>
        <Card className="lg:col-span-5">
          <CardHeader title="Details" />
          <div className="mt-2">
            <Row label="Phone" value={d.phone} />
            <Row label="Email" value={d.email} />
            <Row label="License expires" value={d.licenseExpires} />
            <Row label="Routes" value={rts.map((r) => r.name).join(", ") || "Covers when needed"} />
            <Row label="Time off" value={timeOff.filter((t) => t.driverId === id).map((t) => `${t.from}${t.to !== t.from ? `–${t.to}` : ""}`).join(", ") || "None booked"} />
          </div>
        </Card>
        <Card className="lg:col-span-12">
          <CardHeader title="Training" subtitle="Drafted by us, approved by the owner" />
          <ul className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            {courses.map((c, i) => {
              const done = c.status === "approved" && i < d.trainingDone;
              return (
                <li key={c.id} className="flex items-start gap-3 rounded-xl border border-line px-4 py-3">
                  {done ? <CheckCircle2 className="mt-0.5 size-5 text-good" /> : <Circle className="mt-0.5 size-5 text-ink-muted" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium">{c.title}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-ink-muted">
                      <Clock3 className="size-3.5" /> {c.minutes} min · {c.lessons} lessons {c.required ? "· required" : ""}
                    </p>
                  </div>
                  {c.status === "draft" ? <Badge tone="warn">Draft</Badge> : done ? <Badge tone="good">Done</Badge> : <Badge>Assigned</Badge>}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}
