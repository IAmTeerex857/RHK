"use client";

import { useState } from "react";
import { CalendarX2, Info, Moon, Repeat } from "lucide-react";
import { FEES, money } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { EmptyState, WeekStrip } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader } from "@rhk/ui/components/card";
import { ChoiceChips } from "@rhk/ui/components/controls";
import { Dialog } from "@rhk/ui/components/dialog";
import { Field, TextArea } from "@rhk/ui/components/field";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { cn } from "@rhk/ui/lib/cn";
import { amHome, homeStop, kids } from "./family";

type Slot = "am" | "pm" | "both";
type DayKey = string;
type Day = { key: DayKey; dow: string; date: string; label: string; notice: number; off?: string; past?: boolean; today?: boolean };

/** Notice is counted in days from today (Fri Nov 20). */
const days: Day[] = [
  { key: "nov-18", dow: "Wed", date: "18", label: "Wednesday, Nov 18", notice: -2, past: true },
  { key: "nov-19", dow: "Thu", date: "19", label: "Thursday, Nov 19", notice: -1, past: true },
  { key: "nov-20", dow: "Fri", date: "20", label: "Today", notice: 0, today: true },
  { key: "nov-23", dow: "Mon", date: "23", label: "Monday, Nov 23", notice: 3 },
  { key: "nov-24", dow: "Tue", date: "24", label: "Tuesday, Nov 24", notice: 4 },
  { key: "nov-25", dow: "Wed", date: "25", label: "Wednesday, Nov 25", notice: 5, off: "Thanksgiving break" },
  { key: "nov-30", dow: "Mon", date: "30", label: "Monday, Nov 30", notice: 10 },
];
const future: Day[] = [
  ...days.filter((d) => !d.past && !d.off),
  { key: "dec-1", dow: "Tue", date: "1", label: "Tuesday, Dec 1", notice: 11 },
  { key: "dec-2", dow: "Wed", date: "2", label: "Wednesday, Dec 2", notice: 12 },
];

type Absence = { id: string; kids: string[]; day: DayKey; slot: Slot; fee: number; reason: string };
type Change = { id: string; kid: string; kind: string; detail: string; effective: string; notice: number; fee: boolean };

export function ScheduleView() {
  const [day, setDay] = useState<DayKey>("nov-23");
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);
  const [absOpen, setAbsOpen] = useState(false);
  const [chgOpen, setChgOpen] = useState(false);
  const d = days.find((x) => x.key === day)!;

  const state = (kid: string, slot: "am" | "pm") => {
    if (absences.some((a) => a.day === day && a.kids.includes(kid) && (a.slot === slot || a.slot === "both"))) return "absent";
    if (d.past) return "rode";
    if (d.today) return slot === "am" ? "rode" : "live";
    return "scheduled";
  };

  return (
    <>
      <PageHeader
        title="Schedule"
        description="Rides are set for the school year. Report an absence any time before the van leaves; changes are requests the office approves."
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Repeat className="size-4" />} onClick={() => setChgOpen(true)}>
              Request a change
            </Button>
            <Button variant="ink" size="sm" icon={<CalendarX2 className="size-4" />} onClick={() => setAbsOpen(true)}>
              Report an absence
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <WeekStrip days={days.map((x) => ({ key: x.key, dow: x.dow, date: x.date, dots: x.off ? 0 : 2 }))} value={day} onChange={setDay} />
          <div className="mt-5 border-t border-line pt-5">
            <p className="text-[15px] font-medium">{d.label}</p>
            {d.off ? (
              <EmptyState className="py-8" icon={<Moon />} title="No rides" body={`${d.off}, Nov 25–27. Rides resume Monday, Nov 30. Your weekly bill doesn't change.`} />
            ) : (
              <ul className="mt-4 flex flex-col gap-2.5">
                {kids.map((k) => (
                  <li key={k.id} className="rounded-2xl border border-line p-4">
                    <div className="flex items-center gap-3">
                      <Avatar seed={k.id} name={k.first} size={32} />
                      <p className="flex-1 text-[15px] font-medium">{k.first}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <SlotCell label="Morning" time={`${amHome.time} pickup`} state={state(k.id, "am")} />
                      <SlotCell label="Afternoon" time={`${homeStop.time} home`} state={state(k.id, "pm")} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-5">
          <Card>
            <CardHeader title="How absences work" icon={<Info className="size-4" />} />
            <ul className="mt-3 flex flex-col gap-2.5 text-[14px] text-ink-soft">
              <li>
                <span className="font-medium text-ink">A week or more ahead:</span> free.
              </li>
              <li>
                <span className="font-medium text-ink">Less than a week:</span> a {money(FEES.lateCancel, true)} fee per child, per day, added to your next bill. The office can waive it for illness or emergencies.
              </li>
              <li>
                <span className="font-medium text-ink">Same day:</span> until the van leaves. Mornings at 6:40 AM, afternoons at 2:30 PM.
              </li>
            </ul>
          </Card>

          <Card>
            <CardHeader title="Your requests" subtitle="Absences and changes you've sent" />
            {absences.length || changes.length ? (
              <ul className="mt-4 flex flex-col gap-2">
                {absences.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 rounded-xl border border-line px-3.5 py-3">
                    <CalendarX2 className="mt-0.5 size-4 shrink-0 text-ink-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium">
                        {kidList(a.kids)} · {future.find((f) => f.key === a.day)?.label}
                      </p>
                      <p className="text-[13px] text-ink-muted">
                        {a.slot === "both" ? "Both rides" : a.slot === "am" ? "Morning ride" : "Afternoon ride"}
                        {a.fee ? ` · ${money(a.fee, true)} fee on your next bill` : " · no fee"}
                      </p>
                    </div>
                    <Badge tone="good">Driver told</Badge>
                  </li>
                ))}
                {changes.map((c) => (
                  <li key={c.id} className="flex items-start gap-3 rounded-xl border border-line px-3.5 py-3">
                    <Repeat className="mt-0.5 size-4 shrink-0 text-ink-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium">
                        {kidList([c.kid])} · {c.kind}
                      </p>
                      <p className="text-[13px] text-ink-muted">
                        From {c.effective}
                        {c.fee ? ` · ${money(FEES.lateCancel, true)} fee unless waived` : ""}
                      </p>
                    </div>
                    <Badge tone="warn" dot>
                      Waiting
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[14px] text-ink-muted">Nothing sent yet this term.</p>
            )}
          </Card>
        </div>
      </div>

      <AbsenceDialog
        open={absOpen}
        onClose={() => setAbsOpen(false)}
        onSend={(a) => {
          setAbsences((x) => [a, ...x]);
          if (days.some((x) => x.key === a.day)) setDay(a.day);
          setAbsOpen(false);
        }}
      />
      <ChangeDialog
        open={chgOpen}
        onClose={() => setChgOpen(false)}
        onSend={(c) => {
          setChanges((x) => [c, ...x]);
          setChgOpen(false);
        }}
      />
    </>
  );
}

const kidList = (ids: string[]) => ids.map((id) => kids.find((k) => k.id === id)!.first).join(" and ");

function SlotCell({ label, time, state }: { label: string; time: string; state: "rode" | "live" | "scheduled" | "absent" }) {
  const badge = {
    rode: <Badge tone="good">Rode</Badge>,
    live: (
      <Badge tone="info" dot>
        On the way
      </Badge>
    ),
    scheduled: <Badge>Scheduled</Badge>,
    absent: <Badge tone="warn">Absent</Badge>,
  }[state];
  return (
    <div className={cn("rounded-xl bg-raised/60 px-3 py-2.5", state === "absent" && "opacity-80")}>
      <p className="text-[13px] text-ink-muted">{label}</p>
      <p className={cn("mt-0.5 text-[14px] font-medium", state === "absent" && "line-through decoration-ink-muted")}>{time}</p>
      <div className="mt-2">{badge}</div>
    </div>
  );
}

function AbsenceDialog({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend: (a: Absence) => void }) {
  const [who, setWho] = useState<string[]>([]);
  const [day, setDay] = useState<DayKey>("nov-23");
  const [slot, setSlot] = useState<Slot>("both");
  const [reason, setReason] = useState("");
  const d = future.find((f) => f.key === day)!;
  const late = d.notice < 7;
  const fee = late && !d.today ? FEES.lateCancel * who.length : 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      icon={<CalendarX2 className="size-5" />}
      title="Report an absence"
      description="The driver and the office see it straight away."
      footer={
        <>
          <Button variant="soft" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="ink" size="sm" disabled={!who.length || d.today} onClick={() => onSend({ id: `ab-${Date.now()}`, kids: who, day, slot, fee, reason })}>
            {fee ? `Report absence · ${money(fee, true)}` : "Report absence"}
          </Button>
        </>
      }
    >
      <p className="mb-2.5 text-[13px] font-medium text-ink-soft">Who&apos;s staying home?</p>
      <div className="flex flex-wrap gap-2">
        {kids.map((k) => {
          const on = who.includes(k.id);
          return (
            <button
              key={k.id}
              type="button"
              aria-pressed={on}
              onClick={() => setWho((w) => (on ? w.filter((x) => x !== k.id) : [...w, k.id]))}
              className={cn("flex h-11 items-center gap-2 rounded-full border pl-1.5 pr-4 text-[14px] font-medium transition-colors", on ? "border-ink bg-ink text-cream" : "border-line-strong bg-card hover:bg-raised")}
            >
              <Avatar seed={k.id} name={k.first} size={30} />
              {k.first}
            </button>
          );
        })}
      </div>

      <p className="mb-2.5 mt-6 text-[13px] font-medium text-ink-soft">Which day?</p>
      <div className="scrollbar-none -mx-6 flex gap-2 overflow-x-auto px-6 sm:-mx-7 sm:px-7">
        {future.map((f) => {
          const on = f.key === day;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={on}
              onClick={() => setDay(f.key)}
              className={cn(
                "flex w-[68px] shrink-0 flex-col items-center gap-0.5 rounded-2xl border py-2.5 transition-colors",
                on ? "border-ink bg-ink text-cream" : "border-line bg-card hover:bg-raised",
              )}
            >
              <span className={cn("text-[12px]", on ? "text-cream/70" : "text-ink-muted")}>{f.today ? "Today" : f.dow}</span>
              <span className="font-display text-[18px] font-medium tabular">{f.date}</span>
              <span className={cn("h-1.5 w-1.5 rounded-full", f.notice < 7 ? "bg-warn" : "bg-transparent")} />
            </button>
          );
        })}
      </div>

      <p className="mb-2.5 mt-6 text-[13px] font-medium text-ink-soft">Which rides?</p>
      <ChoiceChips
        aria-label="Rides"
        value={slot}
        onChange={setSlot}
        options={[
          { value: "both", label: "Both" },
          { value: "am", label: "Morning" },
          { value: "pm", label: "Afternoon" },
        ]}
      />

      {d.today ? (
        <Notice tone="bad" title="Today's vans have already left.">
          Morning left at 6:40 AM and the afternoon van at 2:30 PM. If plans changed, message or call the office now.
        </Notice>
      ) : late ? (
        <Notice tone="warn" title={`${money(fee, true)} late-cancellation fee`}>
          {d.label} is {d.notice} days away, less than a week. That&apos;s {money(FEES.lateCancel, true)} for each child, added to your next bill. If it&apos;s illness or an emergency, say so below and the office can waive it.
        </Notice>
      ) : (
        <Notice tone="good" title="No fee">
          {d.label} is more than a week away.
        </Notice>
      )}

      <TextArea className="mt-4" label="Reason (optional)" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
    </Dialog>
  );
}

function Notice({ tone, title, children }: { tone: "good" | "warn" | "bad"; title: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "mt-6 rounded-2xl border p-4 text-[14px]",
        tone === "bad" && "border-[color-mix(in_oklab,var(--color-bad)_30%,transparent)] bg-coral-soft",
        tone === "warn" && "border-[color-mix(in_oklab,var(--color-warn)_35%,transparent)] bg-bus-100",
        tone === "good" && "border-[color-mix(in_oklab,var(--color-good)_30%,transparent)] bg-mint-soft",
      )}
    >
      <p className="text-[14px] font-medium text-ink">{title}</p>
      <p className="mt-0.5 text-ink-soft">{children}</p>
    </div>
  );
}

const kinds = ["Stop a day", "Add a day", "Different drop-off address", "Pause service", "End service"];

function ChangeDialog({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend: (c: Change) => void }) {
  const [kid, setKid] = useState(kids[0].id);
  const [kind, setKind] = useState(kinds[0]);
  const [detail, setDetail] = useState("");
  const [from, setFrom] = useState("2026-12-07");
  const notice = Math.round((new Date(`${from}T12:00:00`).getTime() - new Date("2026-11-20T12:00:00").getTime()) / 86400000);
  const fee = notice < 7;
  const label = new Date(`${from}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      icon={<Repeat className="size-5" />}
      title="Request a schedule change"
      description="The office reviews it and lets you know."
      footer={
        <>
          <Button variant="soft" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="ink" size="sm" disabled={detail.trim().length < 3 || notice < 1} onClick={() => onSend({ id: `cr-${Date.now()}`, kid, kind, detail, effective: label, notice, fee })}>
            Send request
          </Button>
        </>
      }
    >
      <p className="mb-2.5 text-[13px] font-medium text-ink-soft">For</p>
      <ChoiceChips aria-label="Child" value={kid} onChange={setKid} options={kids.map((k) => ({ value: k.id, label: k.first }))} />
      <p className="mb-2.5 mt-6 text-[13px] font-medium text-ink-soft">What&apos;s changing?</p>
      <ChoiceChips aria-label="Change" size="sm" value={kind} onChange={setKind} options={kinds.map((k) => ({ value: k, label: k }))} />
      <TextArea className="mt-5" label="Details" rows={2} value={detail} onChange={(e) => setDetail(e.target.value)} />
      <Field className="mt-3" label="Starting" type="date" min="2026-11-21" value={from} onChange={(e) => setFrom(e.target.value)} />
      {notice >= 1 ? (
        fee ? (
          <Notice tone="warn" title={`${money(FEES.lateCancel, true)} fee may apply`}>
            That&apos;s {notice} days&apos; notice, less than a week. The office adds {money(FEES.lateCancel, true)} to your next bill unless they waive it.
          </Notice>
        ) : (
          <Notice tone="good" title="No fee">
            {notice} days&apos; notice.
          </Notice>
        )
      ) : null}
    </Dialog>
  );
}
