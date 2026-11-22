"use client";

import { useState } from "react";
import { Camera, CheckCircle2, HeartPulse, ImageIcon, MapPin, ShieldAlert, Truck, UserX } from "lucide-react";
import { getChild, getDriver, getRoute, incidents, type Incident } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { Steps } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Row } from "@rhk/ui/components/card";
import { TextArea } from "@rhk/ui/components/field";
import { Segmented } from "@rhk/ui/components/segmented";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { cn } from "@rhk/ui/lib/cn";
import { incidentStatus, StatusBadge } from "../status";

const kindIcon = { safety: ShieldAlert, vehicle: Truck, behavior: ShieldAlert, medical: HeartPulse, no_adult: UserX, other: ShieldAlert };
const sev = { low: "neutral", medium: "warn", high: "bad" } as const;

export function IncidentsView() {
  const [filter, setFilter] = useState<"open" | "all">("open");
  const list = incidents.filter((i) => (filter === "open" ? i.status !== "closed" : true));
  const [sel, setSel] = useState<string>(list[0]?.id ?? incidents[0].id);
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState("");
  const inc = incidents.find((i) => i.id === sel) as Incident;
  const status = closed[inc.id] ? "closed" : inc.status;

  return (
    <>
      <PageHeader
        title="Incidents"
        description="Drivers report from the van in four taps. Everything here is kept in the change history."
        actions={
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: "open", label: "Open", count: incidents.filter((i) => i.status !== "closed").length },
              { value: "all", label: "All", count: incidents.length },
            ]}
          />
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
        <div className="flex flex-col gap-2">
          {list.map((i) => {
            const Icon = kindIcon[i.kind];
            return (
              <button
                key={i.id}
                type="button"
                onClick={() => setSel(i.id)}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border bg-card p-4 text-left transition-colors",
                  sel === i.id ? "border-ink/25 shadow-[0_0_0_1px_var(--color-ink)]" : "border-line hover:border-line-strong",
                )}
              >
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", i.severity === "low" ? "bg-raised" : "bg-coral-soft text-bad")}>
                  <Icon className="size-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[14px] font-medium">{i.title}</span>
                    <StatusBadge map={incidentStatus} value={closed[i.id] ? "closed" : i.status} />
                  </span>
                  <span className="mt-1 block truncate text-[12.5px] text-ink-muted">
                    {i.at} · {i.driverId ? getDriver(i.driverId).name : "Office"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[12px] text-ink-muted">{inc.id.toUpperCase()}</p>
              <h2 className="mt-1 font-display text-[22px] font-medium tracking-[-0.03em]">{inc.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge map={incidentStatus} value={status} />
                <Badge tone={sev[inc.severity]}>{inc.severity === "low" ? "Low" : inc.severity === "medium" ? "Medium" : "High"} severity</Badge>
              </div>
            </div>
            {status !== "closed" ? (
              <Button variant="ink" size="sm" icon={<CheckCircle2 className="size-4" />} onClick={() => setClosed((c) => ({ ...c, [inc.id]: true }))}>
                Close incident
              </Button>
            ) : null}
          </div>
          <p className="mt-5 text-[14.5px] leading-relaxed text-ink-soft">{inc.summary}</p>
          <div className="mt-5 grid grid-cols-1 gap-x-8 md:grid-cols-2">
            <div>
              <Row label="When" value={inc.at} />
              <Row label="Route" value={inc.routeId ? getRoute(inc.routeId).name : "—"} />
              <Row label="Driver" value={inc.driverId ? getDriver(inc.driverId).name : "—"} />
            </div>
            <div>
              <Row
                label="Children"
                value={
                  inc.childIds.length ? (
                    <span className="flex items-center justify-end gap-2">
                      {inc.childIds.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1.5">
                          <Avatar seed={c} name={getChild(c).first} size={20} /> {getChild(c).first}
                        </span>
                      ))}
                    </span>
                  ) : (
                    "None involved"
                  )
                }
              />
              <Row label="Children safe" value={<span className="inline-flex items-center gap-1.5 text-good"><CheckCircle2 className="size-4" /> Confirmed by driver</span>} />
              <Row label="Location" value={<span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{inc.location}</span>} />
            </div>
          </div>
          {inc.kind === "vehicle" ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[1, 2].map((n) => (
                <div key={n} className="grid aspect-[4/3] place-items-center rounded-xl border border-line bg-raised text-ink-muted">
                  <ImageIcon className="size-5" />
                </div>
              ))}
            </div>
          ) : null}
          <div className="mt-6 border-t border-line pt-5">
            <CardHeader title="Timeline" />
            <Steps
              className="mt-4"
              dense
              steps={[
                ...inc.timeline.map((t) => ({ title: t.text, detail: t.who, meta: t.at, state: "done" as const })),
                ...(status === "closed" ? [{ title: "Closed", detail: "Clara", meta: "Now", state: "done" as const }] : []),
              ]}
            />
          </div>
          {status !== "closed" ? (
            <div className="mt-6">
              <TextArea label="Add a follow-up note" value={note} onChange={(e) => setNote(e.target.value)} />
              <div className="mt-3 flex justify-between">
                <Button variant="ghost" size="xs" icon={<Camera />}>
                  Attach photo
                </Button>
                <Button variant="outline" size="xs" disabled={!note.trim()} onClick={() => setNote("")}>
                  Add note
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </>
  );
}
