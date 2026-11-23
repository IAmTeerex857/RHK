"use client";

import { useState } from "react";
import { Check, GripVertical, HeartPulse, Pencil, Printer } from "lucide-react";
import { audit, getChild, getDriver, getFamily, getRoute, getSchool, getVan, runFor, type Route, type Run } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { RouteMap } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Row } from "@rhk/ui/components/card";
import { SegmentBar } from "@rhk/ui/components/charts";
import { Tree, type TreeNode } from "@rhk/ui/components/flow";
import { routeColor } from "@rhk/ui/lib/route-color";
import { Crumb, PageHeader } from "@rhk/ui/shell/app-shell";
import { cn } from "@rhk/ui/lib/cn";
import { runTone } from "../today/today-view";

export function RouteDetail({ id }: { id: string }) {
  const r = getRoute(id);
  const van = getVan(r.vanId);
  const d = getDriver(r.driverId);
  const run = runFor(r.id);
  const [hover, setHover] = useState<string | null>(null);
  const riders = [...new Set(r.stops.flatMap((s) => s.childIds))];
  const t = run ? runTone(run) : null;

  return (
    <>
      <Crumb>{r.name}</Crumb>
      <PageHeader
        eyebrow={t ? <Badge tone={t.tone} dot>{t.label}</Badge> : <Badge tone="good" dot>Finished today</Badge>}
        title={r.name}
        description={`${van.name} · ${van.plate} · ${d.name} · ${r.start} – ${r.end} · ${r.miles} mi`}
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Printer className="size-4" />}>
              Print roster
            </Button>
            <Button variant="ink" size="sm" icon={<Pencil className="size-4" />}>
              Edit stops
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card flush className="overflow-hidden lg:col-span-7">
          <RouteMap
            className="h-[420px] lg:h-full lg:min-h-[560px]"
            stops={r.stops.map((s) => ({
              id: s.id,
              x: s.x,
              y: s.y,
              label: s.label,
              state: s.kind === "school" ? "school" : hover === s.id ? "next" : run?.stops.find((x) => x.stopId === s.id)?.state === "done" ? "done" : "todo",
            }))}
            van={run && run.status !== "not_started" ? { ...run.van, label: van.name } : undefined}
            color={routeColor(r.id)}
          />
        </Card>
        <Card flush className="lg:col-span-5">
          <div className="p-5 pb-2">
            <CardHeader title="Stops in order" subtitle={`${r.stops.length} stops · ${riders.length} riders`} />
          </div>
          <ol className="px-3 pb-3">
            {r.stops.map((s, i) => {
              const st = run?.stops.find((x) => x.stopId === s.id);
              return (
                <li
                  key={s.id}
                  onPointerEnter={() => setHover(s.id)}
                  onPointerLeave={() => setHover(null)}
                  className={cn("group flex items-start gap-3 rounded-xl px-2 py-3 transition-colors", hover === s.id && "bg-raised")}
                >
                  <GripVertical className="mt-1 size-4 shrink-0 cursor-grab text-ink-muted opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full font-mono text-[12px] font-medium",
                      s.kind === "school" ? "bg-ink text-cream" : st?.state === "done" ? "bg-good text-white" : "bg-raised text-ink",
                    )}
                  >
                    {s.kind === "school" ? "S" : i}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-[14px] font-medium">{s.kind === "home" ? `${s.label} home` : s.label}</p>
                      <span className="shrink-0 font-mono text-[13px] text-ink-muted tabular">{st?.at ?? s.time}</span>
                    </div>
                    <p className="truncate text-[13px] text-ink-muted">
                      {s.address}
                      {s.kind === "satellite" ? " · satellite stop" : ""}
                    </p>
                    {s.childIds.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.childIds.map((c) => {
                          const ch = getChild(c);
                          return (
                            <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card py-0.5 pl-0.5 pr-2.5 text-[13px]">
                              <Avatar seed={c} name={ch.first} size={20} />
                              {ch.first}
                              {ch.medical ? <HeartPulse className="size-3 text-bad" aria-label="Medical note" /> : null}
                            </span>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader title="Van" />
          <div className="mt-2">
            <Row label="Vehicle" value={`${van.name} · ${van.plate}`} />
            <Row label="Capacity" value={`${van.capacity} seats`} />
            <Row label="Mileage" value={`${van.mileage.toLocaleString()} mi`} />
            <Row label="Camera / GPS" value={<span className="text-ink-muted">Not installed yet</span>} />
          </div>
          <div className="mt-4">
            <SegmentBar value={riders.length} total={van.capacity} color={routeColor(r.id)} size="sm" label="Seats used" />
            <p className="mt-2 font-mono text-[12px] text-ink-muted">
              {riders.length} / {van.capacity} seats used
            </p>
          </div>
        </Card>
        <Card className="lg:col-span-4">
          <CardHeader title="Driver" />
          <div className="mt-4 flex items-center gap-3">
            <Avatar seed={d.id} name={d.name} size={44} />
            <div>
              <p className="text-[15px] font-medium">{d.name}</p>
              <p className="text-[13px] text-ink-muted">Since {d.since} · {Math.round(d.onTimeRate * 100)}% on time</p>
            </div>
          </div>
          <div className="mt-3">
            <Row label="Substitute" value="Ray Foster" />
            <Row label="Training" value={`${d.trainingDone} of ${d.trainingTotal} courses`} />
          </div>
        </Card>
        <Card className="lg:col-span-4">
          <CardHeader title="Schools" />
          <ul className="mt-3 flex flex-col gap-3">
            {r.schoolIds.map((sid) => {
              const s = getSchool(sid);
              return (
                <li key={sid} className="rounded-xl bg-raised px-4 py-3">
                  <p className="text-[14px] font-medium">{s.name}</p>
                  <p className="mt-0.5 font-mono text-[12px] text-ink-muted">
                    Bell {s.bellAm} · release {s.bellPm}
                  </p>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card className="lg:col-span-12">
          <CardHeader
            title={run ? "This run, stop by stop" : "Stops and riders"}
            subtitle={run ? "Every check-on and hand-off the driver taps, as it happens" : "Who gets on and off where"}
            actions={
              <span className="flex items-center gap-2 text-[13px] text-ink-muted">
                <span className="size-2 rounded-[3px]" style={{ background: routeColor(r.id) }} aria-hidden />
                {r.name.split(" · ")[0]}
              </span>
            }
          />
          <Tree className="mt-4" nodes={runTree(r, run)} />
        </Card>
      </div>
    </>
  );
}

/** Stops as branches, children as leaves, with what happened to each child. */
function runTree(r: Route, run: Run | undefined): TreeNode[] {
  const color = routeColor(r.id);
  return r.stops.map((s, i) => {
    const st = run?.stops.find((x) => x.stopId === s.id);
    const state = run ? (st?.state ?? "todo") : r.slot === "am" ? "done" : "todo";
    const icon =
      s.kind === "school" ? (
        <span className="grid size-6 place-items-center rounded-md bg-ink font-mono text-[11px] font-medium text-cream">S</span>
      ) : state === "done" ? (
        <span className="grid size-5 place-items-center rounded-full bg-good text-white">
          <Check className="!size-3 stroke-[3]" />
        </span>
      ) : state === "next" ? (
        <span className="grid size-5 place-items-center rounded-full border-2 bg-card" style={{ borderColor: color }}>
          <span className="size-1.5 rounded-full" style={{ background: color }} />
        </span>
      ) : (
        <span className="size-4 rounded-full border border-line-strong bg-card" />
      );
    const kids = s.kind === "school" || s.kind === "home" ? s.childIds : [];
    return {
      id: s.id,
      icon,
      title: s.kind === "home" ? `${s.label} home` : s.label,
      detail: s.kind === "satellite" ? "satellite lot, no riders today" : `${s.address}`,
      meta: st?.at ?? (state === "next" && st?.eta ? `ETA ${st.eta.replace(" PM", "")}` : s.time.replace(/ (AM|PM)/, "")),
      tone: state === "todo" ? "muted" : "default",
      children: kids.map((cid) => {
        const c = getChild(cid);
        const handed = audit.find((a) => a.target === `${c.first} ${c.last}` && a.action === "Dropped off");
        const guardian = getFamily(c.familyId).guardians[0].name;
        const pickup = s.kind === "school" || (r.slot === "am" && i < r.stops.length - 1);
        const detail =
          state === "done"
            ? pickup
              ? `Checked on ${st?.at ?? s.time}`
              : `Handed to ${handed ? handed.detail.replace("Received by ", "") : `${guardian} (parent)`}`
            : state === "next"
              ? pickup
                ? "Waiting at pickup"
                : "On board · drop-off next"
              : pickup
                ? "Expected"
                : "On board";
        return {
          id: `${s.id}-${cid}`,
          icon: <Avatar seed={c.id} name={c.first} size={22} />,
          title: (
            <span className="inline-flex items-center gap-1.5">
              {c.first} {c.last}
              {c.medical ? <HeartPulse className="size-3.5 text-bad" aria-label={c.medical} /> : null}
            </span>
          ),
          detail,
          tone: state === "done" ? "default" : "muted",
        } satisfies TreeNode;
      }),
    } satisfies TreeNode;
  });
}
