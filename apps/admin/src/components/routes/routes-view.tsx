"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock3, Gauge, MapPin, Plus, School as SchoolIcon } from "lucide-react";
import { getDriver, getSchool, getVan, routes, satelliteStops, schools } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { Button } from "@rhk/ui/components/button";
import { Card } from "@rhk/ui/components/card";
import { SegmentBar } from "@rhk/ui/components/charts";
import { Switch } from "@rhk/ui/components/controls";
import { Segmented, Tabs } from "@rhk/ui/components/segmented";
import { DataTable } from "@rhk/ui/components/table";
import { PageHeader } from "@rhk/ui/shell/app-shell";

export function RoutesView() {
  const [tab, setTab] = useState<"routes" | "schools" | "stops">("routes");
  const [slot, setSlot] = useState<"am" | "pm">("pm");
  const [active, setActive] = useState<Record<string, boolean>>(Object.fromEntries(satelliteStops.map((s) => [s.id, s.active])));

  return (
    <>
      <PageHeader
        title="Routes"
        description="Each van runs a morning and an afternoon route. Stops, order and riders come from each child's year schedule."
        actions={
          <Button variant="ink" size="sm" icon={<Plus className="size-4" />}>
            {tab === "routes" ? "New route" : tab === "schools" ? "Add school" : "Add satellite stop"}
          </Button>
        }
      />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <Tabs
          value={tab}
          onChange={setTab}
          options={[
            { value: "routes", label: "Routes", count: routes.length },
            { value: "schools", label: "Schools", count: schools.length },
            { value: "stops", label: "Satellite stops", count: satelliteStops.length },
          ]}
        />
        {tab === "routes" ? (
          <Segmented
            size="sm"
            value={slot}
            onChange={setSlot}
            options={[
              { value: "am", label: "Morning" },
              { value: "pm", label: "Afternoon" },
            ]}
          />
        ) : null}
      </div>

      {tab === "routes" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {routes
            .filter((r) => r.slot === slot)
            .map((r) => {
              const van = getVan(r.vanId);
              const d = getDriver(r.driverId);
              const riders = new Set(r.stops.flatMap((s) => s.childIds)).size;
              return (
                <Link key={r.id} href={`/routes/${r.id}`} className="group">
                  <Card className="h-full transition-[border-color,box-shadow] group-hover:border-line-strong group-hover:shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-[18px] font-medium tracking-[-0.02em]">{r.name.split(" · ")[0]}</p>
                        <p className="mt-0.5 text-[13px] text-ink-muted">{r.schoolIds.map((s) => getSchool(s).short).join(", ")}</p>
                      </div>
                      <Badge tone={van.status === "in_service" ? "neutral" : "warn"}>{van.name}</Badge>
                    </div>
                    <div className="mt-5 flex items-center gap-2.5">
                      <Avatar seed={d.id} name={d.name} size={28} />
                      <span className="text-[14px]">{d.name}</span>
                    </div>
                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-[13px] text-ink-muted">
                        <span>Seats</span>
                        <span className="font-mono tabular">
                          {riders}/{van.capacity}
                        </span>
                      </div>
                      <SegmentBar value={riders} total={van.capacity} tone="ink" size="sm" label="Seats used" />
                    </div>
                    <dl className="mt-5 grid grid-cols-[0.7fr_1.4fr_0.8fr] gap-3 border-t border-line pt-4 text-[13px]">
                      <div>
                        <dt className="flex items-center gap-1 text-ink-muted">
                          <MapPin className="size-3.5" /> Stops
                        </dt>
                        <dd className="mt-1 font-mono text-[14px] tabular">{r.stops.length}</dd>
                      </div>
                      <div>
                        <dt className="flex items-center gap-1 text-ink-muted">
                          <Clock3 className="size-3.5" /> Window
                        </dt>
                        <dd className="mt-1 whitespace-nowrap font-mono text-[14px] tabular">{r.start.replace(" PM", "").replace(" AM", "")}–{r.end.replace(" PM", "").replace(" AM", "")}</dd>
                      </div>
                      <div>
                        <dt className="flex items-center gap-1 text-ink-muted">
                          <Gauge className="size-3.5" /> Miles
                        </dt>
                        <dd className="mt-1 font-mono text-[14px] tabular">{r.miles}</dd>
                      </div>
                    </dl>
                  </Card>
                </Link>
              );
            })}
        </div>
      ) : tab === "schools" ? (
        <Card flush>
          <DataTable
            rows={schools}
            rowKey={(s) => s.id}
            columns={[
              {
                key: "name",
                header: "School",
                cell: (s) => (
                  <span className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-raised">
                      <SchoolIcon className="size-4" />
                    </span>
                    <span>
                      <span className="block font-medium">{s.name}</span>
                      <span className="block text-[13px] text-ink-muted">
                        {s.address}, {s.city}
                      </span>
                    </span>
                  </span>
                ),
              },
              { key: "am", header: "Morning bell", cell: (s) => <span className="font-mono tabular">{s.bellAm}</span>, hideBelow: "sm" },
              { key: "pm", header: "Release", cell: (s) => <span className="font-mono tabular">{s.bellPm}</span>, hideBelow: "sm" },
              { key: "routes", header: "Routes", cell: (s) => routes.filter((r) => r.schoolIds.includes(s.id)).map((r) => r.name.split(" · ")[0]).filter((v, i, a) => a.indexOf(v) === i).join(", "), hideBelow: "md" },
              { key: "kids", header: "Children", align: "right", cell: (s) => <span className="font-mono tabular">{s.children}</span> },
            ]}
          />
        </Card>
      ) : (
        <Card flush>
          <DataTable
            rows={satelliteStops}
            rowKey={(s) => s.id}
            columns={[
              {
                key: "name",
                header: "Stop",
                cell: (s) => (
                  <span>
                    <span className="block font-medium">{s.name}</span>
                    <span className="block text-[13px] text-ink-muted">{s.address}</span>
                  </span>
                ),
              },
              { key: "am", header: "Morning", cell: (s) => <span className="font-mono text-[13px] tabular">{s.windowAm}</span>, hideBelow: "md" },
              { key: "pm", header: "Afternoon", cell: (s) => <span className="font-mono text-[13px] tabular">{s.windowPm}</span>, hideBelow: "md" },
              { key: "kids", header: "Children", align: "right", cell: (s) => <span className="font-mono tabular">{s.children}</span>, hideBelow: "sm" },
              {
                key: "on",
                header: "In use",
                align: "right",
                cell: (s) => <Switch checked={active[s.id]} onChange={(v) => setActive((a) => ({ ...a, [s.id]: v }))} />,
              },
            ]}
          />
          <p className="border-t border-line px-5 py-3 text-[13px] text-ink-muted">Turning a stop off asks you to move its children to another stop first. Parents are told by email and push.</p>
        </Card>
      )}
    </>
  );
}
