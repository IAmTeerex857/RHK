"use client";

import Link from "next/link";
import { useState } from "react";
import { Crosshair, Layers, MessageSquare, Minus, Phone, Plus, Users } from "lucide-react";
import { NOW, getChild, getDriver, getRoute, getVan, runs } from "@rhk/fixtures";
import { Avatar, AvatarStack } from "@rhk/ui/components/avatar";
import { Badge, StatusDot } from "@rhk/ui/components/badge";
import { RouteMap, Steps } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card } from "@rhk/ui/components/card";
import { IconButton } from "@rhk/ui/components/controls";
import { Segmented } from "@rhk/ui/components/segmented";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { cn } from "@rhk/ui/lib/cn";
import { runTone } from "../today/today-view";

const vanTone = { running: "data", late: "bad", not_started: "warn", done: "good" } as const;

export function LiveView() {
  const [sel, setSel] = useState("run-pm-2");
  const [filter, setFilter] = useState<"all" | "late">("all");
  const run = runs.find((r) => r.id === sel)!;
  const route = getRoute(run.routeId);
  const driver = getDriver(run.driverId);
  const van = getVan(route.vanId);
  const list = filter === "late" ? runs.filter((r) => r.lateMinutes > 0) : runs;

  return (
    <>
      <PageHeader
        title="Live map"
        description={`${runs.filter((r) => r.status !== "not_started").length} vans on the road · positions refresh every 10 seconds · ${NOW.time}`}
        actions={
          <Segmented
            aria-label="Filter"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All vans", count: runs.length },
              { value: "late", label: "Behind", count: runs.filter((r) => r.lateMinutes > 0).length },
            ]}
          />
        }
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[340px_1fr]">
        <div className="order-2 flex flex-col gap-2 xl:order-1">
          {list.map((r) => {
            const rt = getRoute(r.routeId);
            const d = getDriver(r.driverId);
            const t = runTone(r);
            const on = r.id === sel;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSel(r.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-colors",
                  on ? "border-ink/20 bg-card shadow-[0_0_0_1px_var(--color-ink)]" : "border-line bg-card hover:border-line-strong",
                )}
              >
                <div className="flex items-center gap-3">
                  <Avatar seed={d.id} name={d.name} size={34} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{rt.name}</p>
                    <p className="truncate text-[13px] text-ink-muted">
                      {getVan(rt.vanId).name} · {d.name}
                    </p>
                  </div>
                  <Badge tone={t.tone} dot>
                    {t.label}
                  </Badge>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-raised">
                  <div className={cn("h-full rounded-full", r.status === "late" ? "bg-bad" : "bg-data-500")} style={{ width: `${Math.max(4, r.progress * 100)}%` }} />
                </div>
                <p className="mt-2 flex justify-between font-mono text-[12px] text-ink-muted tabular">
                  <span>{Math.round(r.progress * 100)}% done</span>
                  <span>{r.onBoard} on board</span>
                </p>
              </button>
            );
          })}
        </div>

        <Card flush className="order-1 overflow-hidden xl:order-2">
          <div className="relative pt-[300px] sm:h-[56vh] sm:min-h-[360px] sm:pt-0 xl:h-[calc(100dvh-220px)]">
            <RouteMap
              className="absolute inset-x-0 top-0 h-[300px] sm:inset-0 sm:h-auto"
              stops={route.stops.map((s) => ({
                id: s.id,
                x: s.x,
                y: s.y,
                label: s.label,
                state: s.kind === "school" ? "school" : run.stops.find((x) => x.stopId === s.id)?.state === "done" ? "done" : run.stops.find((x) => x.stopId === s.id)?.state === "next" ? "next" : "todo",
              }))}
              vans={runs
                .filter((r) => r.id !== sel)
                .map((r) => ({ id: r.id, x: r.van.x, y: r.van.y, label: getVan(getRoute(r.routeId).vanId).name, tone: vanTone[r.status] }))}
              van={{ ...run.van, label: van.name }}
            />
            <div className="absolute right-3 top-3 flex flex-col gap-1.5">
              <IconButton label="Zoom in" size="sm">
                <Plus className="size-4" />
              </IconButton>
              <IconButton label="Zoom out" size="sm">
                <Minus className="size-4" />
              </IconButton>
              <IconButton label="Centre on van" size="sm">
                <Crosshair className="size-4" />
              </IconButton>
              <IconButton label="Map layers" size="sm">
                <Layers className="size-4" />
              </IconButton>
            </div>
            <div className="relative border-t border-line sm:absolute sm:bottom-3 sm:left-3 sm:w-[380px] sm:border-0">
              <div className="bg-card p-4 sm:rounded-2xl sm:border sm:border-line sm:bg-card/95 sm:shadow-float sm:backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Avatar seed={driver.id} name={driver.name} size={40} status="online" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium">{driver.name}</p>
                    <p className="text-[13px] text-ink-muted">
                      {van.name} · {van.plate} · started {run.startedAt ?? "—"}
                    </p>
                  </div>
                  <IconButton label={`Call ${driver.name}`} size="sm">
                    <Phone className="size-4" />
                  </IconButton>
                  <IconButton label={`Message ${driver.name}`} size="sm" variant="ink">
                    <MessageSquare className="size-4" />
                  </IconButton>
                </div>
                <div className="mt-4 max-h-[200px] overflow-y-auto pr-1">
                  <Steps
                    dense
                    steps={route.stops.map((s) => {
                      const st = run.stops.find((x) => x.stopId === s.id)!;
                      return {
                        title: s.kind === "school" ? s.label : `${s.label} family`,
                        detail: s.childIds.length ? s.childIds.map((c) => getChild(c).first).join(", ") : s.address,
                        meta: st.at ?? (st.eta ? `ETA ${st.eta}` : s.time),
                        state: st.state === "next" ? "current" : st.state === "done" ? "done" : st.state === "skipped" ? "skipped" : "todo",
                      };
                    })}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <span className="flex items-center gap-2 text-[13px] text-ink-muted">
                    <Users className="size-4" /> On board
                    <AvatarStack size={22} people={route.stops[0].childIds.slice(0, run.onBoard).map((id) => ({ seed: id, name: getChild(id).first }))} />
                  </span>
                  <Button variant="ghost" size="xs" href={`/routes/${route.id}`} linkAs={Link}>
                    Route details
                  </Button>
                </div>
              </div>
            </div>
            <div className="absolute left-3 top-3 hidden items-center gap-3 rounded-full border border-line bg-card/95 px-3.5 py-2 text-[12px] shadow-subtle backdrop-blur sm:flex">
              <StatusDot tone="info">Moving</StatusDot>
              <StatusDot tone="bad">Behind</StatusDot>
              <StatusDot tone="warn">Waiting at school</StatusDot>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
