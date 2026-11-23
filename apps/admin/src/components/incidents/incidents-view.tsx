"use client";

import { useState } from "react";
import { Camera, CheckCircle2, HeartPulse, ImageIcon, MapPin, ShieldAlert, Truck, UserX, X } from "lucide-react";
import { getChild, getDriver, getRoute, incidents, type Incident } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { EmptyState, Steps } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Row } from "@rhk/ui/components/card";
import { TextArea } from "@rhk/ui/components/field";
import { Segmented } from "@rhk/ui/components/segmented";
import { toast } from "@rhk/ui/components/toast";
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
  const [notes, setNotes] = useState<Record<string, { text: string; photos: number }[]>>({});
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
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
          {!list.length ? (
            <Card>
              <EmptyState icon={<CheckCircle2 />} title="No open incidents" body="When a driver reports something, it shows up here straight away." />
            </Card>
          ) : null}
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
                  <span className="mt-1 block truncate text-[13px] text-ink-muted">
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
              <h2 className="mt-1 font-display text-[24px] font-medium tracking-[-0.03em]">{inc.title}</h2>
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
          <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">{inc.summary}</p>
          <div className="mt-5 grid grid-cols-1 gap-x-8 md:grid-cols-2">
            <div>
              <Row label="When" value={inc.at} />
              <Row label="Route" value={inc.routeId ? getRoute(inc.routeId).name : "Not on a route"} />
              <Row label="Driver" value={inc.driverId ? getDriver(inc.driverId).name : "Not a driver report"} />
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
                ...(notes[inc.id] ?? []).map((n) => ({ title: n.text, detail: `Clara${n.photos ? ` · ${n.photos} photo${n.photos === 1 ? "" : "s"}` : ""}`, meta: "Just now", state: "done" as const })),
                ...(status === "closed" ? [{ title: "Closed", detail: "Clara", meta: "Now", state: "done" as const }] : []),
              ]}
            />
          </div>
          {status !== "closed" ? (
            <div className="mt-6">
              <TextArea label="Add a follow-up note" value={note} onChange={(e) => setNote(e.target.value)} />
              {photos.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {photos.map((p, i) => (
                    <li key={p.url} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={p.name} className="size-16 rounded-xl border border-line object-cover" />
                      <button
                        type="button"
                        aria-label={`Remove ${p.name}`}
                        onClick={() => setPhotos((l) => l.filter((_, k) => k !== i))}
                        className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink text-cream"
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-3 flex justify-between">
                <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-ink transition-colors hover:bg-raised [&_svg]:size-4">
                  <Camera />
                  Attach photo
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      setPhotos((l) => [...l, ...files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))]);
                      e.target.value = "";
                    }}
                  />
                </label>
                <Button
                  variant="outline"
                  size="xs"
                  disabled={!note.trim()}
                  onClick={() => {
                    setNotes((n) => ({ ...n, [inc.id]: [...(n[inc.id] ?? []), { text: note.trim(), photos: photos.length }] }));
                    setNote("");
                    setPhotos([]);
                    toast("Note added", { body: "Saved to the incident and the change history." });
                  }}
                >
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
