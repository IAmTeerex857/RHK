"use client";

import { useState } from "react";
import { Bus, CalendarDays, Clock3, Download, ShieldAlert, Wallet } from "lucide-react";
import { money, onTimeByWeek, revenueByWeek, vans } from "@rhk/fixtures";
import { Delta } from "@rhk/ui/components/badge";
import { Stat } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader } from "@rhk/ui/components/card";
import { BarChart, ShareBar } from "@rhk/ui/components/charts";
import { downloadCsv } from "@rhk/ui/lib/download";
import { toast } from "@rhk/ui/components/toast";
import { Segmented } from "@rhk/ui/components/segmented";
import { PageHeader } from "@rhk/ui/shell/app-shell";

const miles = [
  { van: "Van 1", v: 1204 },
  { van: "Van 2", v: 1129 },
  { van: "Van 3", v: 842 },
  { van: "Van 4", v: 760 },
];

export function ReportsView() {
  const [range, setRange] = useState<"term" | "month">("term");
  const total = revenueByWeek.reduce((s, r) => s + r.value, 0);
  return (
    <>
      <PageHeader
        title="Reports"
        description="Attendance, money, mileage, incidents and training. Every report exports to CSV."
        actions={
          <>
            <Segmented
              value={range}
              onChange={setRange}
              options={[
                { value: "month", label: "This month" },
                { value: "term", label: "This term" },
              ]}
            />
            <span className="inline-flex h-10 items-center gap-2 px-1 font-mono text-[13px] text-ink-muted tabular">
              <CalendarDays className="size-4" />
              {range === "term" ? "Aug 31 – Nov 20" : "Nov 1 – Nov 20"}
            </span>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="size-4" />}
              onClick={() => {
                downloadCsv(`rush-hour-kids-report-${range === "term" ? "term" : "month"}.csv`, [
                  ["Week of", "On time (%)", "Revenue collected ($)"],
                  ...onTimeByWeek.map((w, i) => [w.label, w.value, revenueByWeek[i]?.value ?? ""]),
                  [],
                  ["Van", "Miles"],
                  ...miles.map((m) => [m.van, m.v]),
                ]);
                toast("Report downloaded", { body: "Weekly on-time rate, revenue and miles" });
              }}
            >
              Export
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Card>
          <Stat icon={<Wallet />} iconTone="green" label="Revenue collected" value={money(total, true)} delta={<Delta value={8.4} />} note="vs last term" />
        </Card>
        <Card>
          <Stat icon={<Bus />} iconTone="yellow" label="Rides given" value="1,612" delta={<Delta value={11.2} />} note="vs last term" />
        </Card>
        <Card>
          <Stat icon={<Clock3 />} iconTone="blue" label="On-time rate" value="94.6" unit="%" delta={<Delta value={2.3} suffix=" pts" />} note="vs last term · goal 95%" />
        </Card>
        <Card>
          <Stat icon={<ShieldAlert />} iconTone="coral" label="Incidents" value="7" delta={<Delta value={-3} suffix="" goodWhen="down" />} note="vs last term · 2 open" />
        </Card>

        <Card className="col-span-2">
          <CardHeader title="Revenue by week" subtitle="Monthly bills land in the first week of each month" actions={<span className="font-mono text-[12px] text-ink-muted">USD</span>} />
          <BarChart className="mt-8" height={220} data={revenueByWeek} format={(v) => money(v, true)} />
        </Card>
        <Card className="col-span-2">
          <CardHeader title="On-time rate by week" subtitle="All routes, drop-offs inside their window" actions={<span className="font-mono text-[12px] text-ink-muted">%</span>} />
          <BarChart className="mt-8" height={220} data={onTimeByWeek} min={88} max={100} reference={95} referenceLabel="Goal 95%" format={(v) => `${v.toFixed(1)}%`} />
        </Card>

        <Card className="col-span-2">
          <CardHeader title="Miles by van" subtitle="From driver check-ins at each run" />
          <ShareBar
            className="mt-6"
            parts={miles.map((m, i) => ({
              label: `${m.van} · ${vans[i].plate}`,
              value: m.v,
              note: `${m.v.toLocaleString()} mi`,
              className: ["bg-data-700", "bg-data-500", "bg-data-300", "bg-data-200"][i],
            }))}
          />
        </Card>
        <Card className="col-span-2">
          <CardHeader title="How families pay" subtitle="Share of money collected this term" />
          <ShareBar
            className="mt-6"
            parts={[
              { label: "Zelle", value: 63, note: money(total * 0.63, true), className: "bg-data-700" },
              { label: "Cash App", value: 37, note: money(total * 0.37, true), className: "bg-data-400" },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
