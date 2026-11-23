"use client";

import { useState } from "react";
import { Check, Download, Plus, X } from "lucide-react";
import { drivers, getDriver, getVan, shifts, timeOff, type TimeOff } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { EmptyState } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader } from "@rhk/ui/components/card";
import { SegmentBar } from "@rhk/ui/components/charts";
import { Select } from "@rhk/ui/components/controls";
import { Dialog } from "@rhk/ui/components/dialog";
import { Field } from "@rhk/ui/components/field";
import { Tabs } from "@rhk/ui/components/segmented";
import { DataTable } from "@rhk/ui/components/table";
import { PageHeader } from "@rhk/ui/shell/app-shell";

/** Builds the payroll CSV (one row per run) and downloads it. */
function exportHours() {
  const rows = [["Driver", "Date", "Run", "Clock in", "Clock out", "Hours", "Miles"]];
  for (const s of shifts) {
    rows.push([getDriver(s.driverId).name, s.date, s.slot === "am" ? "Morning" : "Afternoon", s.in, s.out ?? "", s.hours.toFixed(2), s.miles.toFixed(1)]);
  }
  const csv = rows.map((r) => r.map((c) => `"${c.replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "rhk-driver-hours-nov-16-20.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function TimeOffRow({ t }: { t: TimeOff }) {
  const [state, setState] = useState(t.status);
  const d = getDriver(t.driverId);
  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4 last:border-0">
      <Avatar seed={d.id} name={d.name} size={34} />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium">
          {d.name} <span className="font-normal text-ink-muted">· {t.from === t.to ? t.from : `${t.from} – ${t.to}`}</span>
        </p>
        <p className="text-[13px] text-ink-muted">
          {t.reason}
          {t.coverId ? ` · covered by ${getDriver(t.coverId).name}` : ""}
        </p>
      </div>
      {state === "pending" ? (
        <div className="flex gap-2">
          <Button variant="soft" size="xs" icon={<X />} onClick={() => setState("declined")}>
            Decline
          </Button>
          <Button variant="ink" size="xs" icon={<Check />} onClick={() => setState("approved")}>
            Approve, Ray covers
          </Button>
        </div>
      ) : (
        <Badge tone={state === "approved" ? "good" : "neutral"} dot>
          {state === "approved" ? "Approved" : "Declined"}
        </Badge>
      )}
    </li>
  );
}

export function DriversView() {
  const [tab, setTab] = useState<"team" | "timeoff" | "hours">("team");
  const [invite, setInvite] = useState(false);
  const totalHours = drivers.reduce((s, d) => s + d.hoursThisWeek, 0);

  return (
    <>
      <PageHeader
        title="Drivers"
        description={`${drivers.length} drivers · ${totalHours.toFixed(1)} hours this week · drivers clock in and out for each run.`}
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Download className="size-4" />} onClick={exportHours}>
              Export hours (CSV)
            </Button>
            <Button variant="ink" size="sm" icon={<Plus className="size-4" />} onClick={() => setInvite(true)}>
              Add driver
            </Button>
          </>
        }
      />
      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        options={[
          { value: "team", label: "Team", count: drivers.length },
          { value: "timeoff", label: "Time off", count: timeOff.filter((t) => t.status === "pending").length },
          { value: "hours", label: "Hours this week" },
        ]}
      />
      {tab === "team" ? (
        <Card flush>
          <DataTable
            rows={drivers}
            empty={<EmptyState title="No drivers yet" body="Invite a driver and they get an email to set a password." />}
            rowKey={(d) => d.id}
            href={(d) => `/drivers/${d.id}`}
            columns={[
              {
                key: "name",
                header: "Driver",
                sort: (d) => d.name,
                cell: (d) => (
                  <span className="flex items-center gap-3">
                    <Avatar seed={d.id} name={d.name} size={32} status={d.id === "d-ray" ? "off" : "online"} />
                    <span>
                      <span className="block font-medium">{d.name}</span>
                      <span className="block text-[13px] text-ink-muted">{d.phone}</span>
                    </span>
                  </span>
                ),
              },
              { key: "van", header: "Van", cell: (d) => (d.vanId ? getVan(d.vanId).name : <Badge tone="lilac">Substitute</Badge>), hideBelow: "sm" },
              { key: "hours", header: "Hours", align: "right", sort: (d) => d.hoursThisWeek, cell: (d) => <span className="font-mono tabular">{d.hoursThisWeek.toFixed(1)}</span>, hideBelow: "md" },
              {
                key: "ontime",
                header: "On time",
                align: "right",
                sort: (d) => d.onTimeRate,
                cell: (d) => <span className={`font-mono tabular ${d.onTimeRate < 0.95 ? "text-bad" : ""}`}>{Math.round(d.onTimeRate * 100)}%</span>,
                hideBelow: "md",
              },
              {
                key: "training",
                header: "Training",
                cell: (d) => (
                  <span className="flex items-center gap-2.5">
                    <SegmentBar className="w-20" size="sm" value={d.trainingDone} total={d.trainingTotal} tone={d.trainingDone === d.trainingTotal ? "good" : "warn"} label="Courses done" />
                    <span className="font-mono text-[13px] text-ink-muted tabular">
                      {d.trainingDone}/{d.trainingTotal}
                    </span>
                  </span>
                ),
                hideBelow: "lg",
              },
              {
                key: "license",
                header: "License",
                align: "right",
                cell: (d) => (d.licenseExpires.includes("2026") ? <Badge tone="warn">Renew by {d.licenseExpires}</Badge> : <span className="text-ink-muted">{d.licenseExpires}</span>),
                hideBelow: "xl",
              },
            ]}
          />
        </Card>
      ) : tab === "timeoff" ? (
        <Card flush>
          <ul>
            {timeOff.map((t) => (
              <TimeOffRow key={t.id} t={t} />
            ))}
          </ul>
        </Card>
      ) : (
        <Card flush>
          <div className="flex items-center justify-between p-5">
            <CardHeader title="Marcus Bell" subtitle="Nov 16 – 20 · per run" />
            <Button variant="outline" size="xs" icon={<Download />} onClick={exportHours}>
              CSV
            </Button>
          </div>
          <DataTable
            dense
            rows={shifts}
            empty={<EmptyState title="No shifts in this period" body="Shifts appear when drivers clock in and out of each run." />}
            rowKey={(s) => s.id}
            columns={[
              { key: "date", header: "Day", cell: (s) => s.date },
              { key: "run", header: "Run", cell: (s) => (s.slot === "am" ? "Morning" : "Afternoon") },
              { key: "in", header: "In", cell: (s) => <span className="font-mono tabular">{s.in}</span> },
              { key: "out", header: "Out", cell: (s) => (s.out ? <span className="font-mono tabular">{s.out}</span> : <Badge tone="info" dot>On the clock</Badge>) },
              { key: "miles", header: "Miles", align: "right", cell: (s) => <span className="font-mono tabular">{s.miles.toFixed(1)}</span>, hideBelow: "sm" },
              { key: "hours", header: "Hours", align: "right", cell: (s) => <span className="font-mono tabular">{s.hours.toFixed(2)}</span> },
            ]}
          />
        </Card>
      )}

      <Dialog
        open={invite}
        onClose={() => setInvite(false)}
        icon={<Plus className="size-5" />}
        title="Add a driver"
        description="They'll get an email to set a password and install the driver app."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setInvite(false)}>
              Cancel
            </Button>
            <Button variant="ink" size="sm" onClick={() => setInvite(false)}>
              Send invite
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Field label="Full name" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Email" type="email" />
            <Field label="Phone" type="tel" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select label="Van" defaultValue="">
              <option value="">Substitute (no van)</option>
              <option value="v1">Van 1</option>
              <option value="v2">Van 2</option>
              <option value="v3">Van 3</option>
              <option value="v4">Van 4</option>
            </Select>
            <Field label="License expires" type="month" />
          </div>
          <p className="rounded-xl bg-raised px-4 py-3 text-[13px] text-ink-soft">All required courses are assigned automatically. They can&apos;t start a route until the check-on course is done.</p>
        </div>
      </Dialog>
    </>
  );
}
