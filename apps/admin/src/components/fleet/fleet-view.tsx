"use client";

import { useState } from "react";
import { Camera, Fuel, Gauge, Plus, Wrench } from "lucide-react";
import { drivers, vans, type Van } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { EmptyState } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Panel, PanelCard } from "@rhk/ui/components/card";
import { Ring } from "@rhk/ui/components/charts";
import { Select } from "@rhk/ui/components/controls";
import { Dialog } from "@rhk/ui/components/dialog";
import { Field, TextArea } from "@rhk/ui/components/field";
import { DataTable } from "@rhk/ui/components/table";
import { toast } from "@rhk/ui/components/toast";
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

const serviceKinds = ["Inspection", "Oil change", "Tires", "Brakes", "Repair", "Other"];

export function FleetView() {
  const [fleet, setFleet] = useState<Van[]>(vans);
  const [entries, setEntries] = useState(log);
  const [dialog, setDialog] = useState<null | "service" | "van">(null);
  const [svc, setSvc] = useState({ van: vans[0].id, kind: "Inspection", odometer: "", detail: "" });
  const [nv, setNv] = useState({ name: `Van ${vans.length + 1}`, plate: "", seats: "14", odometer: "" });
  const [err, setErr] = useState<string | undefined>();
  const close = () => {
    setDialog(null);
    setErr(undefined);
  };

  const saveService = () => {
    const van = fleet.find((v) => v.id === svc.van)!;
    const odo = Number(svc.odometer.replace(/\D/g, ""));
    if (!odo) return setErr("Enter the odometer reading.");
    if (odo < van.mileage) return setErr(`${van.name} already shows ${van.mileage.toLocaleString()} mi.`);
    setEntries((e) => [{ id: `l${Date.now()}`, date: "Just now", van: van.name, who: "Office", kind: svc.kind, detail: svc.detail || "Logged by the office", odometer: odo }, ...e]);
    setFleet((f) => f.map((v) => (v.id === van.id ? { ...v, mileage: odo, ...(svc.kind === "Inspection" ? { status: "in_service" as const, lastInspection: "today" } : {}) } : v)));
    toast(`${svc.kind} logged for ${van.name}`);
    setSvc((x) => ({ ...x, odometer: "", detail: "" }));
    close();
  };

  const saveVan = () => {
    if (!nv.name.trim() || !nv.plate.trim()) return setErr("A name and a plate are needed.");
    const seats = Number(nv.seats);
    if (!seats || seats < 1) return setErr("Enter the number of seats for children.");
    setFleet((f) => [
      ...f,
      { id: `v${Date.now()}`, name: nv.name.trim(), plate: nv.plate.trim().toUpperCase(), capacity: seats, mileage: Number(nv.odometer.replace(/\D/g, "")) || 0, status: "in_service", nextService: "Not set", fuelLevel: 1, lastInspection: "not yet" },
    ]);
    toast(`${nv.name.trim()} added`, { body: "Assign a driver and a route from Drivers and Routes." });
    setNv({ name: `Van ${fleet.length + 2}`, plate: "", seats: "14", odometer: "" });
    close();
  };

  return (
    <>
      <PageHeader
        title="Fleet"
        description="Daily checks, fuel and mileage come from the driver app. Cameras and van GPS arrive once the Samsara or Motive quote is chosen."
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Wrench className="size-4" />} onClick={() => setDialog("service")}>
              Log service
            </Button>
            <Button variant="ink" size="sm" icon={<Plus className="size-4" />} onClick={() => setDialog("van")}>
              Add van
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {fleet.map((v) => {
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
          rows={entries}
            empty={<EmptyState icon={<Wrench />} title="No checks or service yet" body="Pre-trip checks and fuel come from the driver app. Log shop visits here." />}
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

      <Dialog
        open={dialog === "service"}
        onClose={close}
        icon={<Wrench className="size-5" />}
        title="Log service"
        description="Shop visits, inspections and repairs. Daily checks and fuel come from the driver app."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={close}>
              Cancel
            </Button>
            <Button variant="ink" size="sm" onClick={saveService}>
              Save
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select label="Van" value={svc.van} onChange={(e) => setSvc((x) => ({ ...x, van: e.target.value }))}>
              {fleet.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} · {v.plate}
                </option>
              ))}
            </Select>
            <Select label="Type" value={svc.kind} onChange={(e) => setSvc((x) => ({ ...x, kind: e.target.value }))}>
              {serviceKinds.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </Select>
          </div>
          <Field label="Odometer (mi)" inputMode="numeric" value={svc.odometer} onChange={(e) => setSvc((x) => ({ ...x, odometer: e.target.value }))} error={err} />
          <TextArea label="What was done" value={svc.detail} onChange={(e) => setSvc((x) => ({ ...x, detail: e.target.value }))} />
        </div>
      </Dialog>

      <Dialog
        open={dialog === "van"}
        onClose={close}
        icon={<Plus className="size-5" />}
        title="Add a van"
        description="It shows up on routes, the live map and the driver app once a driver is assigned."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={close}>
              Cancel
            </Button>
            <Button variant="ink" size="sm" onClick={saveVan}>
              Add van
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Name" value={nv.name} onChange={(e) => setNv((x) => ({ ...x, name: e.target.value }))} />
          <Field label="Plate" value={nv.plate} onChange={(e) => setNv((x) => ({ ...x, plate: e.target.value }))} />
          <Field label="Seats for children" inputMode="numeric" value={nv.seats} onChange={(e) => setNv((x) => ({ ...x, seats: e.target.value }))} />
          <Field label="Odometer (mi)" inputMode="numeric" value={nv.odometer} onChange={(e) => setNv((x) => ({ ...x, odometer: e.target.value }))} />
        </div>
        {err ? <p className="mt-3 text-[13px] font-medium text-bad">{err}</p> : null}
      </Dialog>
    </>
  );
}
