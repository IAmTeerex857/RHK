"use client";

import { useState } from "react";
import { CalendarOff, CalendarPlus, Megaphone, MapPin, Moon, Sunrise, Sunset } from "lucide-react";
import { announcements, getDriver, getRoute, timeOff as allTimeOff, type TimeOff } from "@rhk/fixtures";
import { Badge } from "@rhk/ui/components/badge";
import { EmptyState, WeekStrip } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader } from "@rhk/ui/components/card";
import { ChoiceChips } from "@rhk/ui/components/controls";
import { Dialog } from "@rhk/ui/components/dialog";
import { Field, TextArea } from "@rhk/ui/components/field";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { me } from "./run-store";

const am = getRoute("r-am-2");
const pm = getRoute("r-pm-2");

type Day = { key: string; dow: string; date: string; label: string; off?: string; note?: string; today?: boolean };
const days: Day[] = [
  { key: "20", dow: "Fri", date: "20", label: "Today, Friday Nov 20", today: true },
  { key: "23", dow: "Mon", date: "23", label: "Monday, Nov 23" },
  { key: "24", dow: "Tue", date: "24", label: "Tuesday, Nov 24" },
  { key: "25", dow: "Wed", date: "25", label: "Wednesday, Nov 25", off: "Thanksgiving break" },
  { key: "26", dow: "Thu", date: "26", label: "Thanksgiving Day", off: "Thanksgiving break" },
  { key: "27", dow: "Fri", date: "27", label: "Friday, Nov 27", off: "Thanksgiving break" },
  { key: "30", dow: "Mon", date: "30", label: "Monday, Nov 30", note: "Rides start again after the break" },
];

export function ScheduleView() {
  const [day, setDay] = useState("23");
  const [ask, setAsk] = useState(false);
  const [mine, setMine] = useState<TimeOff[]>(allTimeOff.filter((t) => t.driverId === me.id));
  const d = days.find((x) => x.key === day)!;

  return (
    <>
      <PageHeader
        title="Schedule"
        description="Your runs are set for the school year. Ask for time off here and the office finds cover."
        actions={
          <Button variant="outline" size="sm" icon={<CalendarPlus className="size-4" />} onClick={() => setAsk(true)}>
            Ask for time off
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <WeekStrip days={days.map((x) => ({ key: x.key, dow: x.dow, date: x.date, dots: x.off ? 0 : 2 }))} value={day} onChange={setDay} />
          <div className="mt-5 border-t border-line pt-5">
            <p className="text-[15px] font-medium">{d.label}</p>
            {d.off ? (
              <EmptyState className="py-8" icon={<Moon />} title="No service" body={`${d.off}. Schools are closed; rides resume Monday, Nov 30.`} />
            ) : (
              <ul className="mt-4 flex flex-col gap-2.5">
                <RunCard icon={<Sunrise className="size-4" />} name="Morning" start={am.start} end={am.end} stops={am.stops.length} miles={am.miles} done={d.today} />
                <RunCard icon={<Sunset className="size-4" />} name="Afternoon" start={pm.start} end={pm.end} stops={pm.stops.length} miles={pm.miles} live={d.today} />
              </ul>
            )}
            {d.note ? <p className="mt-3 text-[14px] text-ink-muted">{d.note}</p> : null}
          </div>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-5">
          <Card>
            <CardHeader title="Time off" subtitle="Ask at least a week ahead" icon={<CalendarOff className="size-4" />} />
            <ul className="mt-4 flex flex-col gap-2">
              {mine.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium">
                      {t.from}
                      {t.to !== t.from ? ` – ${t.to}` : ""}
                    </p>
                    <p className="truncate text-[13px] text-ink-muted">
                      {t.reason}
                      {t.coverId ? ` · ${getDriver(t.coverId).name.split(" ")[0]} covers` : ""}
                    </p>
                  </div>
                  <Badge tone={t.status === "approved" ? "good" : t.status === "pending" ? "warn" : "bad"} dot>
                    {t.status === "approved" ? "Approved" : t.status === "pending" ? "Waiting" : "Declined"}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Coming up" icon={<Megaphone className="size-4" />} />
            <div className="mt-3 flex flex-col">
              {[announcements[1], announcements[0]].map((a) => (
                <div key={a.id} className="border-b border-line py-3 last:border-0">
                  <p className="text-[14px] font-medium">{a.title}</p>
                  <p className="mt-0.5 text-[14px] text-ink-muted">{a.body}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <TimeOffDialog
        open={ask}
        onClose={() => setAsk(false)}
        onSend={(t) => {
          setMine((m) => [t, ...m]);
          setAsk(false);
        }}
      />
    </>
  );
}

function RunCard({ icon, name, start, end, stops, miles, done, live }: { icon: React.ReactNode; name: string; start: string; end: string; stops: number; miles: number; done?: boolean; live?: boolean }) {
  return (
    <li className="flex items-center gap-3.5 rounded-2xl border border-line p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-raised">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium">
          {name} · Route 2
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-[13px] text-ink-muted">
          <MapPin className="size-3.5 shrink-0" /> {stops} stops · {miles} mi
        </p>
      </div>
      <div className="text-right">
        <p className="font-mono text-[14px] tabular">{start}</p>
        <p className="font-mono text-[12px] text-ink-muted tabular">{end}</p>
      </div>
      {done ? <Badge tone="good">Done</Badge> : live ? <Badge tone="info" dot>Live</Badge> : null}
    </li>
  );
}

function TimeOffDialog({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend: (t: TimeOff) => void }) {
  const [from, setFrom] = useState("2026-12-04");
  const [to, setTo] = useState("2026-12-04");
  const [runs, setRuns] = useState<"both" | "am" | "pm">("both");
  const [reason, setReason] = useState("");
  const label = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      icon={<CalendarPlus className="size-5" />}
      title="Ask for time off"
      description="The office approves it and books a cover driver. You'll get a message either way."
      footer={
        <>
          <Button variant="soft" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="ink"
            size="sm"
            disabled={!from || !to || reason.trim().length < 3}
            onClick={() =>
              onSend({
                id: `to-new-${Date.now()}`,
                driverId: me.id,
                from: label(from),
                to: label(to),
                reason: `${reason.trim()}${runs === "both" ? "" : runs === "am" ? " · morning only" : " · afternoon only"}`,
                status: "pending",
              })
            }
          >
            Send request
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Field label="To" type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} />
      </div>
      <p className="mb-2.5 mt-5 text-[13px] font-medium text-ink-soft">Which runs?</p>
      <ChoiceChips
        aria-label="Runs"
        value={runs}
        onChange={setRuns}
        options={[
          { value: "both", label: "Both runs" },
          { value: "am", label: "Morning only" },
          { value: "pm", label: "Afternoon only" },
        ]}
      />
      <TextArea className="mt-5" label="Reason" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
    </Dialog>
  );
}
