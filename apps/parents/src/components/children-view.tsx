"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Camera, HeartPulse, Plus, Trash2, UserPlus } from "lucide-react";
import { getChild, getRoute, getSchool, getVan, money, serviceLabel, weekdayShort, type ApprovedAdult } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Row } from "@rhk/ui/components/card";
import { Dialog } from "@rhk/ui/components/dialog";
import { Field, TextArea } from "@rhk/ui/components/field";
import { Crumb, PageHeader } from "@rhk/ui/shell/app-shell";
import { cn } from "@rhk/ui/lib/cn";
import { family, kids, parent } from "./family";

export function ChildrenView() {
  return (
    <>
      <PageHeader title="Children" description="Profiles, schedules and who may receive each child at home." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {kids.map((k) => (
          <Link key={k.id} href={`/children/${k.id}`} className="group rounded-[22px] border border-line bg-card p-5 transition-colors hover:border-line-strong">
            <div className="flex items-center gap-4">
              <Avatar seed={k.id} name={k.first} size={64} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-[24px] font-medium tracking-[-0.03em]">
                  {k.first} {k.last}
                </p>
                <p className="text-[14px] text-ink-muted">
                  Age {k.age} · {k.grade} grade · {getSchool(k.schoolId).short}
                </p>
              </div>
              <ArrowRight className="size-4 text-ink-muted transition-transform group-hover:translate-x-0.5" />
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 text-[13px]">
              <div>
                <dt className="text-ink-muted">Service</dt>
                <dd className="mt-0.5 font-medium">{k.service === "both" ? "AM + PM" : k.service === "pm" ? "PM only" : "AM only"}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Days</dt>
                <dd className="mt-0.5 font-medium">{k.days.length === 5 ? "Mon–Fri" : k.days.map((d) => weekdayShort[d]).join(", ")}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Approved</dt>
                <dd className="mt-0.5 font-medium">{k.approvedAdults.length} adults</dd>
              </div>
            </dl>
          </Link>
        ))}
      </div>
    </>
  );
}

export function ChildView({ id }: { id: string }) {
  const c = getChild(id);
  const am = c.amRouteId ? getRoute(c.amRouteId) : null;
  const pm = c.pmRouteId ? getRoute(c.pmRouteId) : null;
  const [adults, setAdults] = useState<ApprovedAdult[]>(c.approvedAdults);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<ApprovedAdult | null>(null);
  const [photo, setPhoto] = useState<string | undefined>(c.photo);
  const [note, setNote] = useState(c.notes ?? "");
  const [saved, setSaved] = useState(false);
  const stopTime = (r: typeof am) => r?.stops.find((s) => s.kind === "home" && s.childIds.includes(c.id))?.time;

  return (
    <>
      <Crumb>{`${c.first} ${c.last}`}</Crumb>
      <div className="flex flex-col gap-5 pb-6 pt-4 sm:flex-row sm:items-center lg:pt-6">
        <label className="group relative w-fit cursor-pointer">
          <Avatar seed={c.id} name={c.first} photo={photo} size={88} />
          <span className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border-2 border-canvas bg-ink text-cream transition-transform group-hover:scale-105">
            <Camera className="size-3.5" />
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label={`Change ${c.first}'s photo`}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPhoto(URL.createObjectURL(f));
            }}
          />
        </label>
        <div>
          <h1 className="font-display text-[28px] font-medium leading-[1.08] tracking-[-0.04em] sm:text-[32px]">
            {c.first} {c.last}
          </h1>
          <p className="mt-1.5 text-[15px] text-ink-muted">
            Age {c.age} · {c.grade} grade · {c.teacher} · {getSchool(c.schoolId).name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <Card>
            <CardHeader
              title="Approved adults"
              subtitle="Who may receive the child at home, besides you. Changes apply straight away and the office is told."
              actions={
                <Button variant="ink" size="xs" icon={<UserPlus className="size-4" />} onClick={() => setAdding(true)}>
                  Add
                </Button>
              }
            />
            <ul className="mt-4 flex flex-col gap-2">
              <li className="flex items-center gap-3 rounded-2xl bg-raised/60 p-3">
                <Avatar seed={parent.id} name={parent.name} size={40} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium">{parent.name}</span>
                  <span className="block text-[13px] text-ink-muted">Parent · you</span>
                </span>
                <Badge>Guardian</Badge>
              </li>
              {adults.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-line p-3">
                  <Avatar seed={a.id} name={a.name} size={40} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium">{a.name}</span>
                    <span className="block truncate text-[13px] text-ink-muted">
                      {a.relationship} · {a.phone} · added {a.addedOn}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setRemoving(a)}
                    aria-label={`Remove ${a.name}`}
                    className="grid size-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-raised hover:text-bad"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            {!adults.length ? <p className="mt-3 text-[14px] text-ink-muted">No one else yet. If you can&apos;t be home, add someone so the driver can hand {c.first} over.</p> : null}
          </Card>

          <Card>
            <CardHeader title="Health and notes for the driver" subtitle="Drivers see this on their route. The office can see it too." />
            {c.medical ? (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--color-bad)_30%,transparent)] bg-coral-soft p-4">
                <HeartPulse className="mt-0.5 size-4 shrink-0 text-bad" />
                <div className="text-[14px]">
                  <p className="font-medium">{c.medical}</p>
                  <p className="mt-0.5 text-ink-soft">To change a medical note, message the office so they can brief the driver.</p>
                </div>
              </div>
            ) : null}
            <TextArea
              className="mt-4"
              label="Notes"
              rows={3}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setSaved(false);
              }}
            />
            <div className="mt-3 flex items-center justify-end gap-3">
              {saved ? <span className="text-[13px] text-good">Saved</span> : null}
              <Button variant="outline" size="sm" disabled={note === (c.notes ?? "") || saved} onClick={() => setSaved(true)}>
                Save notes
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5">
          <Card>
            <CardHeader title="Rides" subtitle="Set for the school year" actions={<Link href="/schedule" className="text-[13px] font-medium text-ink-muted hover:text-ink">Request a change</Link>} />
            <div className="mt-3">
              <Row label="Service" value={serviceLabel[c.service]} />
              <Row
                label="Days"
                value={
                  <span className="flex gap-1">
                    {(["mon", "tue", "wed", "thu", "fri"] as const).map((d) => (
                      <span key={d} className={cn("grid h-6 w-9 place-items-center rounded-md text-[12px]", c.days.includes(d) ? "bg-raised font-medium text-ink ring-1 ring-inset ring-line-strong" : "text-ink-muted/50")}>
                        {weekdayShort[d]}
                      </span>
                    ))}
                  </span>
                }
              />
              {am ? <Row label="Morning pickup" value={`${stopTime(am)} · ${getVan(am.vanId).name}`} /> : null}
              {pm ? <Row label="Afternoon drop-off" value={`${stopTime(pm)} · ${getVan(pm.vanId).name}`} /> : null}
              <Row label="Home" value={`${family.address}, ${family.city}`} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Price" />
            <div className="mt-3">
              {c.priceOverride ? (
                <Row
                  label={c.priceOverride.reason}
                  value={
                    <span className="flex items-baseline gap-2">
                      <span className="text-[13px] text-ink-muted line-through">{money(c.price)}</span>
                      <span className="font-medium">{money(c.priceOverride.amount)}</span>
                    </span>
                  }
                />
              ) : (
                <Row label={serviceLabel[c.service]} value={money(c.price)} />
              )}
              <Row label="Billed" value={family.cadence === "weekly" ? "Weekly, due Fridays" : "Monthly, due the second Friday"} />
            </div>
          </Card>
        </div>
      </div>

      <AddAdultDialog
        open={adding}
        name={c.first}
        onClose={() => setAdding(false)}
        onAdd={(a) => {
          setAdults((x) => [...x, a]);
          setAdding(false);
        }}
      />
      <Dialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        size="sm"
        icon={<Trash2 className="size-5" />}
        title={removing ? `Remove ${removing.name}?` : ""}
        description={`The driver won't hand ${c.first} to them from now on. The office is told.`}
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setRemoving(null)}>
              Keep
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setAdults((x) => x.filter((a) => a.id !== removing?.id));
                setRemoving(null);
              }}
            >
              Remove
            </Button>
          </>
        }
      />
    </>
  );
}

function AddAdultDialog({ open, name, onClose, onAdd }: { open: boolean; name: string; onClose: () => void; onAdd: (a: ApprovedAdult) => void }) {
  const [form, setForm] = useState({ name: "", relationship: "", phone: "" });
  const [photo, setPhoto] = useState<string>();
  const ok = form.name.trim().split(" ").length > 1 && form.relationship.trim() && form.phone.replace(/\D/g, "").length >= 10;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      icon={<UserPlus className="size-5" />}
      title="Add an approved adult"
      description={`They can receive ${name} at home. Bring photo ID: the driver may ask.`}
      footer={
        <>
          <Button variant="soft" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="ink"
            size="sm"
            disabled={!ok}
            onClick={() => {
              onAdd({ id: `aa-new-${Date.now()}`, name: form.name.trim(), relationship: form.relationship.trim(), phone: form.phone.trim(), addedOn: "Nov 20" });
              setForm({ name: "", relationship: "", phone: "" });
              setPhoto(undefined);
            }}
          >
            Add {form.name.split(" ")[0] || "them"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-line-strong p-3 transition-colors hover:bg-raised/60">
          <span className="grid size-12 place-items-center overflow-hidden rounded-full bg-raised">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {photo ? <img src={photo} alt="" className="size-full object-cover" /> : <Plus className="size-5 text-ink-muted" />}
          </span>
          <span className="text-[14px]">
            <span className="block font-medium">Add a photo</span>
            <span className="block text-[13px] text-ink-muted">Helps the driver recognize them</span>
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPhoto(URL.createObjectURL(f));
            }}
          />
        </label>
        <Field label="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Relationship" value={form.relationship} onChange={(e) => setForm((f) => ({ ...f, relationship: e.target.value }))} />
          <Field label="Phone" type="tel" inputMode="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        </div>
      </div>
    </Dialog>
  );
}
