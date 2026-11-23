"use client";

import { Camera, Fuel, Gauge, Plus, Wrench } from "lucide-react";
import { drivers, vans } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Panel, PanelCard } from "@rhk/ui/components/card";
import { Ring } from "@rhk/ui/components/charts";
import { DataTable } from "@rhk/ui/components/table";
import { PageHeader } from "@rhk/ui/shell/app-shell";

const vanStatus = {
  in_service: { label: "In service", tone: "good" as const },
  inspection_due: { label: "Inspection overdue", tone: "bad" as const },
  maintenance: { label: "In the shop", tone: "warn" as const },
};

const log = [
  { id: "l1", date: "Today, 6:24 AM", van: "Van 2", who: "Marcus Bell", kind: "Pre-trip check", detail: "All 14 items OK", odometer: 39858 },
  { id: "l2", date: "Today, 6:20 AM", van: "Van 4", who: "Keisha Grant", kind: "Fuel", detail: "12.4 gal · $38.70 · Kroger, Hwy 78", odometer: 22301 },
  { id: "l3", date: "Today, 6:18 AM", van: "Van 1", who: "Denise Howard", kind: "Pre-trip check", detail: "Rear seatbelt row 3 sticky, reported", odometer: 48177 },
  { id: "l4", date: "Yesterday", van: "Van 3", who: "Tony Alvarez", kind: "Pre-trip check", detail: "Skipped: inspection overdue reminder", odometer: 61470 },
  { id: "l5", date: "Nov 18", van: "Van 4", who: "Shop", kind: "Inspection", detail: "Passed · brakes 70%", odometer: 22102 },
];

export function FleetView() {
  return (
    <>
      <PageHeader
        title="Fleet"
        description="Daily checks, fuel and mileage come from the driver app. Cameras and van GPS arrive once the Samsara or Motive quote is chosen."
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Wrench className="size-4" />}>
              Log service
            </Button>
            <Button variant="ink" size="sm" icon={<Plus className="size-4" />}>
              Add van
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {vans.map((v) => {
          const d = drivers.find((x) => x.vanId === v.id);
          const s = vanStatus[v.status];
          return (
            <Panel
              key={v.id}
              title={v.name}
              meta={v.plate}
              actions={
                <Badge tone={s.tone} dot>
                  {s.label}
                </Badge>
              }
              footer={`${v.capacity} seats · ${v.mileage.toLocaleString()} mi`}
            >
              <PanelCard className="flex items-center gap-4">
                <Ring value={v.fuelLevel} size={64} stroke={6} tone={v.fuelLevel < 0.4 ? "warn" : "good"}>
                  <span className="font-mono text-[13px] font-medium tabular">{Math.round(v.fuelLevel * 100)}%</span>
                </Ring>
                <div className="min-w-0 text-[13px]">
                  <p className="flex items-center gap-1.5 text-ink-muted">
                    <Fuel className="size-3.5" /> Fuel at last check
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-ink-muted">
                    <Gauge className="size-3.5" /> Next service <span className={v.status === "inspection_due" ? "font-medium text-bad" : "text-ink"}>{v.nextService}</span>
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-ink-muted">
                    <Camera className="size-3.5" /> Camera <span className="text-ink">not installed</span>
                  </p>
                </div>
              </PanelCard>
              <PanelCard className="flex items-center gap-3 py-3.5">
                {d ? (
                  <>
                    <Avatar seed={d.id} name={d.name} size={28} />
                    <span className="flex-1 truncate text-[14px]">{d.name}</span>
                    <span className="font-mono text-[12px] text-ink-muted">Checked {v.lastInspection}</span>
                  </>
                ) : (
                  <span className="text-[13px] text-ink-muted">No driver assigned</span>
                )}
              </PanelCard>
            </Panel>
          );
        })}
      </div>

      <Card flush className="mt-4">
        <div className="p-5 pb-3">
          <CardHeader title="Checks, fuel and service" subtitle="From the driver app and the shop" />
        </div>
        <DataTable
          rows={log}
          rowKey={(l) => l.id}
          columns={[
            { key: "date", header: "When", cell: (l) => <span className="text-ink-soft">{l.date}</span> },
            { key: "van", header: "Van", cell: (l) => <span className="font-medium">{l.van}</span> },
            { key: "kind", header: "Type", cell: (l) => <Badge tone={l.kind === "Fuel" ? "info" : l.kind === "Inspection" ? "lilac" : "neutral"}>{l.kind}</Badge>, hideBelow: "sm" },
            { key: "detail", header: "Detail", cell: (l) => <span className={l.detail.includes("reported") || l.detail.includes("Skipped") ? "text-bad" : "text-ink-soft"}>{l.detail}</span>, hideBelow: "md" },
            { key: "who", header: "By", cell: (l) => <span className="text-ink-muted">{l.who}</span>, hideBelow: "lg" },
            { key: "odo", header: "Odometer", align: "right", cell: (l) => <span className="font-mono tabular">{l.odometer.toLocaleString()}</span>, hideBelow: "lg" },
          ]}
        />
      </Card>
    </>
  );
}
