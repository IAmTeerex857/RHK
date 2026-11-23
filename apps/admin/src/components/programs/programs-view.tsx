"use client";

import { useState } from "react";
import { CalendarDays, MapPin, Plus, Sun, Ticket, Tent } from "lucide-react";
import { getChild, getVan, programs, type Program } from "@rhk/fixtures";
import { AvatarStack } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { Button } from "@rhk/ui/components/button";
import { Card } from "@rhk/ui/components/card";
import { Sheet } from "@rhk/ui/components/dialog";
import { Field, TextArea } from "@rhk/ui/components/field";
import { Select } from "@rhk/ui/components/controls";
import { PageHeader } from "@rhk/ui/shell/app-shell";

const kind = {
  field_trip: { label: "Field trip", icon: Ticket, tone: "info" as const },
  camp: { label: "Camp shuttle", icon: Tent, tone: "lilac" as const },
  summer: { label: "Summer program", icon: Sun, tone: "warn" as const },
};
const status = { planned: { label: "Planned", tone: "neutral" as const }, confirmed: { label: "Confirmed", tone: "good" as const }, done: { label: "Done", tone: "neutral" as const } };

function ProgramCard({ p }: { p: Program }) {
  const k = kind[p.kind];
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-raised">
          <k.icon className="size-[18px]" />
        </span>
        <Badge tone={status[p.status].tone} dot>
          {status[p.status].label}
        </Badge>
      </div>
      <p className="mt-4 text-[13px] font-medium text-ink-muted">{k.label}</p>
      <h3 className="mt-0.5 font-display text-[18px] font-medium tracking-[-0.02em]">{p.name}</h3>
      <div className="mt-3 flex flex-col gap-1.5 text-[14px] text-ink-soft">
        <span className="flex items-center gap-2">
          <CalendarDays className="size-4 text-ink-muted" /> {p.dates}
        </span>
        <span className="flex items-center gap-2">
          <MapPin className="size-4 text-ink-muted" /> {p.place}
        </span>
      </div>
      <p className="mt-3 text-[14px] text-ink-muted">{p.notes}</p>
      <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
        {p.childIds.length ? (
          <span className="flex items-center gap-2 text-[13px] text-ink-muted">
            <AvatarStack size={26} people={p.childIds.map((c) => ({ seed: c, name: getChild(c).first }))} />
            {p.childIds.length} children
          </span>
        ) : (
          <span className="text-[13px] text-ink-muted">No children added yet</span>
        )}
        <span className="font-mono text-[12px] text-ink-muted">{p.vanIds.length ? p.vanIds.map((v) => getVan(v).name).join(" + ") : "No vans yet"}</span>
      </div>
    </Card>
  );
}

export function ProgramsView() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader
        title="Trips & programs"
        description="Field trips, camp shuttles and summer programs are set up by the office. Parents see them in their app; they don't book them."
        actions={
          <Button variant="ink" size="sm" icon={<Plus className="size-4" />} onClick={() => setOpen(true)}>
            New trip or program
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((p) => (
          <ProgramCard key={p.id} p={p} />
        ))}
      </div>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        icon={<Ticket className="size-5" />}
        title="New trip or program"
        description="Parents of the children you add will see it in their app."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="ink" size="sm" onClick={() => setOpen(false)}>
              Create and notify parents
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Select label="Type" defaultValue="field_trip">
            <option value="field_trip">Field trip</option>
            <option value="camp">Camp shuttle</option>
            <option value="summer">Summer program</option>
          </Select>
          <Field label="Name" />
          <Field label="Place and address" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="First day" type="date" />
            <Field label="Last day" type="date" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Leave at" type="time" />
            <Field label="Back by" type="time" />
          </div>
          <TextArea label="Notes for parents" hint="e.g. Pack lunch. Permission slips due Dec 3." />
        </div>
      </Sheet>
    </>
  );
}
