"use client";

import { useState } from "react";
import { CalendarMinus, CalendarPlus, Check, Clock3, MapPin, PauseCircle, X } from "lucide-react";
import { FEES, absences, changeRequests, children, getChild, getSchool, type ChangeRequest } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { EmptyState } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader } from "@rhk/ui/components/card";
import { Switch } from "@rhk/ui/components/controls";
import { Tabs } from "@rhk/ui/components/segmented";
import { DataTable } from "@rhk/ui/components/table";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { cn } from "@rhk/ui/lib/cn";

const kindIcon = { drop_day: CalendarMinus, add_day: CalendarPlus, address: MapPin, pause: PauseCircle, end: X };
const days = ["mon", "tue", "wed", "thu", "fri"] as const;

function RequestCard({ r }: { r: ChangeRequest }) {
  const [state, setState] = useState(r.status);
  const [waive, setWaive] = useState(false);
  const c = getChild(r.childId);
  const Icon = kindIcon[r.kind];
  return (
    <Card className={cn("transition-opacity", state !== "pending" && "opacity-70")}>
      <div className="flex items-start gap-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-raised">
          <Icon className="size-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[15px] font-medium">
              {c.first} {c.last}
            </p>
            {state === "approved" ? <Badge tone="good" dot>Approved</Badge> : state === "declined" ? <Badge dot>Declined</Badge> : null}
          </div>
          <p className="mt-1 text-[14px] text-ink-soft">{r.summary}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] text-ink-muted">
            <span>FROM {r.effective.toUpperCase()}</span>
            <span>·</span>
            <span>ASKED {r.requested.toUpperCase()}</span>
            <span>·</span>
            <span className={r.noticeDays < 7 ? "text-bad" : undefined}>{r.noticeDays} DAYS NOTICE</span>
          </p>
        </div>
      </div>
      {r.feeApplies && state === "pending" ? (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-[color-mix(in_oklab,var(--color-warn)_35%,transparent)] bg-bus-50 px-4 py-3">
          <p className="text-[14px]">
            <span className="font-medium">${FEES.lateCancel} fee applies.</span> <span className="text-ink-soft">Less than a week&apos;s notice. Added to the next bill.</span>
          </p>
          <Switch checked={waive} onChange={setWaive} label={<span className="text-[13px]">Waive</span>} className="shrink-0 gap-2" />
        </div>
      ) : null}
      {state === "pending" ? (
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="soft" size="xs" icon={<X />} onClick={() => setState("declined")}>
            Decline
          </Button>
          <Button variant="ink" size="xs" icon={<Check />} onClick={() => setState("approved")}>
            Approve{r.feeApplies && !waive ? ` + $${FEES.lateCancel}` : ""}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

export function SchedulesView() {
  const [tab, setTab] = useState<"requests" | "absences" | "year">("requests");
  const [waived, setWaived] = useState<Record<string, boolean>>(Object.fromEntries(absences.map((a) => [a.id, Boolean(a.feeWaived)])));
  const pending = changeRequests.filter((c) => c.status === "pending");
  const active = children.filter((c) => c.status === "active");

  return (
    <>
      <PageHeader
        title="Schedules"
        description="Schedules are set for the school year. Parents request changes and the office approves them. Under a week's notice adds the $35 fee unless you waive it."
      />
      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        options={[
          { value: "requests", label: "Change requests", count: pending.length },
          { value: "absences", label: "Absences", count: absences.length },
          { value: "year", label: "Year schedule" },
        ]}
      />

      {tab === "requests" ? (
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          {changeRequests.map((r) => (
            <RequestCard key={r.id} r={r} />
          ))}
        </div>
      ) : tab === "absences" ? (
        <Card flush>
          <DataTable
            rows={absences}
            empty={<EmptyState title="No absences" body="Absences reported by parents or marked by drivers show up here." />}
            rowKey={(a) => a.id}
            columns={[
              {
                key: "child",
                header: "Child",
                cell: (a) => {
                  const c = getChild(a.childId);
                  return (
                    <span className="flex items-center gap-3">
                      <Avatar seed={c.id} name={c.first} size={30} />
                      <span>
                        <span className="block font-medium">
                          {c.first} {c.last}
                        </span>
                        <span className="block text-[13px] text-ink-muted">{getSchool(c.schoolId).short}</span>
                      </span>
                    </span>
                  );
                },
              },
              { key: "date", header: "Day", cell: (a) => <span className="tabular">{a.date}</span> },
              { key: "slot", header: "Ride", cell: (a) => <span className="text-ink-soft">{a.slot === "both" ? "Both" : a.slot === "am" ? "Morning" : "Afternoon"}</span>, hideBelow: "sm" },
              {
                key: "by",
                header: "Reported",
                cell: (a) => (
                  <span className="text-ink-soft">
                    {a.reportedBy === "driver" ? "Driver (no-show)" : a.reportedBy === "parent" ? "Parent" : "Office"} <span className="text-ink-muted">· {a.reportedAt}</span>
                  </span>
                ),
                hideBelow: "md",
              },
              { key: "reason", header: "Reason", cell: (a) => <span className="text-ink-muted">{a.reason}</span>, hideBelow: "xl" },
              {
                key: "fee",
                header: "$35 fee",
                align: "right",
                cell: (a) =>
                  a.late ? (
                    <span className="inline-flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                      <span className={cn("font-mono text-[13px] tabular", waived[a.id] ? "text-ink-muted line-through" : "text-ink")}>$35.00</span>
                      <Switch checked={!waived[a.id]} onChange={(v) => setWaived((w) => ({ ...w, [a.id]: !v }))} />
                    </span>
                  ) : (
                    <span className="text-[13px] text-ink-muted">No fee</span>
                  ),
              },
            ]}
          />
          <p className="flex items-center gap-2 border-t border-line px-5 py-3 text-[13px] text-ink-muted">
            <Clock3 className="size-4" /> Parents can report a same-day absence until the van leaves for that run. After that they call the office.
          </p>
        </Card>
      ) : (
        <Card flush>
          <div className="p-5">
            <CardHeader title="2026–27 school year" subtitle={`${active.length} children · each square is a ride (morning / afternoon)`} />
          </div>
          <div className="overflow-x-auto px-5 pb-5">
            <table className="w-full min-w-[640px] border-separate border-spacing-y-1.5 text-[14px]">
              <thead>
                <tr className="text-[13px] text-ink-muted">
                  <th className="text-left font-medium">Child</th>
                  {days.map((d) => (
                    <th key={d} className="font-medium capitalize">
                      {d}
                    </th>
                  ))}
                  <th className="text-right font-medium">Rides / week</th>
                </tr>
              </thead>
              <tbody>
                {active.map((c) => {
                  const perDay = (c.service === "both" ? 2 : 1) as number;
                  const total = c.days.length * perDay;
                  return (
                    <tr key={c.id}>
                      <td className="pr-4">
                        <span className="flex items-center gap-2.5">
                          <Avatar seed={c.id} name={c.first} size={26} />
                          <span className="whitespace-nowrap font-medium">
                            {c.first} {c.last}
                          </span>
                        </span>
                      </td>
                      {days.map((d) => {
                        const on = c.days.includes(d);
                        return (
                          <td key={d} className="px-1">
                            <span className="flex gap-1">
                              <span title="Morning" className={cn("h-7 flex-1 rounded-[7px]", on && c.service !== "pm" ? "bg-data-300" : "bg-raised")} />
                              <span title="Afternoon" className={cn("h-7 flex-1 rounded-[7px]", on && c.service !== "am" ? "bg-data-500" : "bg-raised")} />
                            </span>
                          </td>
                        );
                      })}
                      <td className="text-right font-mono tabular">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-3 flex items-center gap-4 text-[12px] text-ink-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-[4px] bg-data-300" /> Morning
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-[4px] bg-data-500" /> Afternoon
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-[4px] bg-raised" /> No ride
              </span>
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
