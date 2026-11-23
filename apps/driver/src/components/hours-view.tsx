"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, Bus, IdCard, LogOut, Phone } from "lucide-react";
import { NOW, OFFICE, shifts } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { Stat } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Row } from "@rhk/ui/components/card";
import { BarChart } from "@rhk/ui/components/charts";
import { Switch } from "@rhk/ui/components/controls";
import { DataTable } from "@rhk/ui/components/table";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { me, useRun, van } from "./run-store";

const toMinutes = (t: string) => {
  const [hm, ap] = t.split(" ");
  const [h, m] = hm.split(":").map(Number);
  return ((h % 12) + (ap === "PM" ? 12 : 0)) * 60 + m;
};

export function HoursView() {
  const run = useRun();
  const [notes, setNotes] = useState({ office: true, changes: true, training: true });

  /* Today's afternoon row follows the live run: on the clock until the driver clocks out. */
  const rows = shifts
    .filter((s) => s.driverId === me.id)
    .map((s) => {
      if (s.date !== NOW.short || s.slot !== "pm") return s;
      if (!run.clockIn) return { ...s, in: "—", out: undefined, hours: 0, miles: 0 };
      if (run.clockOut) return { ...s, in: run.clockIn, out: run.clockOut, hours: (toMinutes(run.clockOut) - toMinutes(run.clockIn)) / 60, miles: run.odoEnd && run.odoStart ? run.odoEnd - run.odoStart : s.miles };
      return { ...s, in: run.clockIn };
    })
    .reverse();

  const total = rows.reduce((n, s) => n + s.hours, 0);
  const miles = rows.reduce((n, s) => n + s.miles, 0);
  const byDay = ["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => ({
    label: d,
    value: Number(rows.filter((s) => s.date.startsWith(d)).reduce((n, s) => n + s.hours, 0).toFixed(2)),
  }));

  return (
    <>
      <PageHeader title="Hours" description="Clocked per run, morning and afternoon. The office sends them to payroll every Friday evening." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <Stat label="This week" value={total.toFixed(1)} unit="h" note={NOW.week} />
        </Card>
        <Card>
          <Stat label="Runs" value={rows.filter((r) => r.hours > 0).length} note="of 10 scheduled" />
        </Card>
        <Card>
          <Stat label="Miles" value={miles.toFixed(0)} unit="mi" note={van.name} />
        </Card>
        <Card>
          <Stat label="On time" value={Math.round(me.onTimeRate * 100)} unit="%" note="this term" />
        </Card>

        <Card className="col-span-2 lg:col-span-4">
          <CardHeader title="Hours by day" subtitle="Both runs added together · today is still open" actions={<span className="mono-label text-ink-muted">Hours</span>} />
          <BarChart className="mt-8" height={170} data={byDay} format={(v) => `${v.toFixed(1)}h`} />
        </Card>

        <Card flush className="col-span-2 lg:col-span-4">
          <div className="p-5 pb-3">
            <CardHeader title="Clock records" subtitle="Tell the office if a time looks wrong. They fix it and it shows in the change history." />
          </div>
          <DataTable
            dense
            rows={rows}
            rowKey={(s) => s.id}
            columns={[
              { key: "date", header: "Day", cell: (s) => <span className="whitespace-nowrap">{s.date.replace(", ", " · ")}</span> },
              { key: "slot", header: "Run", cell: (s) => (s.slot === "am" ? "Morning" : "Afternoon") },
              { key: "in", header: "In", cell: (s) => <span className="font-mono text-[13px] tabular">{s.in}</span>, hideBelow: "sm" },
              {
                key: "out",
                header: "Out",
                cell: (s) =>
                  s.out ? (
                    <span className="font-mono text-[13px] tabular">{s.out}</span>
                  ) : s.in === "—" ? (
                    <span className="text-ink-muted">—</span>
                  ) : (
                    <Badge tone="info" dot>
                      On the clock
                    </Badge>
                  ),
                hideBelow: "sm",
              },
              { key: "miles", header: "Miles", align: "right", cell: (s) => <span className="font-mono text-[13px] tabular">{s.miles ? s.miles.toFixed(1) : "—"}</span>, hideBelow: "md" },
              { key: "hours", header: "Hours", align: "right", cell: (s) => <span className="font-mono text-[13px] font-medium tabular">{s.out ? s.hours.toFixed(2) : "—"}</span> },
            ]}
          />
        </Card>

        <Card className="col-span-2">
          <div className="flex items-center gap-3.5">
            <Avatar seed={me.id} name={me.name} size={52} status="online" />
            <div className="min-w-0">
              <p className="text-[16px] font-medium">{me.name}</p>
              <p className="truncate text-[14px] text-ink-muted">{me.email}</p>
            </div>
          </div>
          <div className="mt-4">
            <Row label={<span className="inline-flex items-center gap-2"><Bus className="size-4" /> Van</span>} value={`${van.name} · ${van.plate}`} />
            <Row label={<span className="inline-flex items-center gap-2"><IdCard className="size-4" /> License expires</span>} value={me.licenseExpires} />
            <Row label={<span className="inline-flex items-center gap-2"><BadgeCheck className="size-4" /> Training</span>} value={`${me.trainingDone} of ${me.trainingTotal} done`} />
            <Row label={<span className="inline-flex items-center gap-2"><Phone className="size-4" /> Office</span>} value={<a href={`tel:${OFFICE.phone}`} className="hover:underline">{OFFICE.phone}</a>} />
          </div>
          <Button variant="outline" size="sm" className="mt-4" href="/sign-in" linkAs={Link} icon={<LogOut className="size-4" />}>
            Sign out
          </Button>
        </Card>

        <Card className="col-span-2">
          <CardHeader title="Notifications" subtitle="Route changes and emergencies always come through." />
          <div className="mt-5 flex flex-col gap-5">
            <Switch checked disabled onChange={() => {}} label="Route changes and absences" description="Always on" />
            <Switch checked={notes.office} onChange={(v) => setNotes((n) => ({ ...n, office: v }))} label="Messages from the office" />
            <Switch checked={notes.changes} onChange={(v) => setNotes((n) => ({ ...n, changes: v }))} label="Time off and schedule updates" />
            <Switch checked={notes.training} onChange={(v) => setNotes((n) => ({ ...n, training: v }))} label="New training" />
          </div>
        </Card>
      </div>
    </>
  );
}
