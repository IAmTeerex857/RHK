"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, HeartPulse, Mail, MessageSquare, Pause, Pencil, Phone, ShieldCheck, Upload, UserCheck } from "lucide-react";
import {
  audit,
  childrenOf,
  getFamily,
  getRoute,
  getSchool,
  getVan,
  invoiceDue,
  invoiceTotal,
  invoicesOf,
  money,
  payments,
  methodLabel,
  serviceLabel,
  weekdayShort,
  type Child,
} from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { EmptyState } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, MoreButton, Row } from "@rhk/ui/components/card";
import { Menu } from "@rhk/ui/components/controls";
import { Tabs } from "@rhk/ui/components/segmented";
import { DataTable } from "@rhk/ui/components/table";
import { Crumb, PageHeader } from "@rhk/ui/shell/app-shell";
import { childStatus, invoiceStatus, StatusBadge } from "../status";

function ChildCard({ c }: { c: Child }) {
  const school = getSchool(c.schoolId);
  const am = c.amRouteId ? getRoute(c.amRouteId) : null;
  const pm = c.pmRouteId ? getRoute(c.pmRouteId) : null;
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar seed={c.id} name={c.first} size={64} />
          <button type="button" aria-label={`Replace ${c.first}'s photo`} className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border border-line bg-card text-ink-muted shadow-subtle hover:text-ink">
            <Upload className="size-3.5" />
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-[18px] font-medium tracking-[-0.02em]">
              {c.first} {c.last}
            </p>
            <StatusBadge map={childStatus} value={c.status} />
          </div>
          <p className="mt-0.5 text-[13.5px] text-ink-muted">
            Age {c.age} · {c.grade} grade · {school.short} · {c.teacher}
          </p>
        </div>
      </div>

      {c.medical ? (
        <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-[color-mix(in_oklab,var(--color-bad)_25%,transparent)] bg-coral-soft px-3.5 py-2.5 text-[13.5px] text-ink">
          <HeartPulse className="mt-0.5 size-4 shrink-0 text-bad" /> {c.medical}
        </p>
      ) : null}

      <div className="mt-3">
        <Row label="Service" value={serviceLabel[c.service]} />
        <Row
          label="Days"
          value={
            <span className="flex justify-end gap-1">
              {(["mon", "tue", "wed", "thu", "fri"] as const).map((d) => (
                <span key={d} className={`grid h-6 w-9 place-items-center rounded-md text-[12px] ${c.days.includes(d) ? "bg-raised font-medium text-ink ring-1 ring-inset ring-line-strong" : "text-ink-muted/50"}`}>
                  {weekdayShort[d]}
                </span>
              ))}
            </span>
          }
        />
        <Row label="Morning" value={am ? <Link className="hover:underline" href={`/routes/${am.id}`}>{am.name.split(" · ")[0]} · {getVan(am.vanId).name} · {am.stops.find((s) => s.childIds.includes(c.id))?.time}</Link> : <span className="text-ink-muted">No morning ride</span>} />
        <Row label="Afternoon" value={pm ? <Link className="hover:underline" href={`/routes/${pm.id}`}>{pm.name.split(" · ")[0]} · {getVan(pm.vanId).name} · {pm.stops.filter((s) => s.childIds.includes(c.id)).slice(-1)[0]?.time}</Link> : <span className="text-ink-muted">No afternoon ride</span>} />
        <Row
          label="Price"
          value={
            c.priceOverride ? (
              <span className="flex items-center justify-end gap-2">
                <span className="text-ink-muted line-through">{money(c.price)}</span>
                {money(c.priceOverride.amount)}
                <Badge tone="lilac">{c.priceOverride.reason}</Badge>
              </span>
            ) : (
              `${money(c.price)} · price list`
            )
          }
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-ink-muted">Approved adults for home drop-off</p>
          <span className="text-[12px] text-ink-muted">Added by the parent</span>
        </div>
        {c.approvedAdults.length ? (
          <ul className="mt-2 flex flex-col gap-1.5">
            {c.approvedAdults.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-xl bg-raised px-3 py-2">
                <Avatar seed={a.id} name={a.name} size={28} />
                <span className="min-w-0 flex-1 text-[13.5px]">
                  <span className="font-medium">{a.name}</span> <span className="text-ink-muted">· {a.relationship}</span>
                </span>
                <span className="font-mono text-[12px] text-ink-muted">{a.phone}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 rounded-xl border border-dashed border-line-strong px-3 py-2.5 text-[13px] text-ink-muted">Only the guardians on this account can receive {c.first}.</p>
        )}
      </div>
      {c.notes ? <p className="mt-4 text-[13.5px] text-ink-soft">Driver note: {c.notes}</p> : null}
    </Card>
  );
}

export function FamilyDetail({ id }: { id: string }) {
  const f = getFamily(id);
  const kids = childrenOf(id);
  const bills = invoicesOf(id);
  const [tab, setTab] = useState<"children" | "billing" | "activity">("children");
  const g = f.guardians[0];
  const activity = audit.filter((a) => kids.some((k) => a.target.includes(k.first)) || f.guardians.some((x) => a.who === x.name || a.target === x.name));

  return (
    <>
      <Crumb>{`${f.name} family`}</Crumb>
      <PageHeader
        eyebrow={
          <span className="flex items-center gap-2 text-[13px] text-ink-muted">
            {f.status === "paused" ? <Badge dot>Paused</Badge> : <Badge tone="good" dot>Active</Badge>}
            <span>Since {f.joined}</span>
            <span>·</span>
            <span className="capitalize">{f.cadence} plan</span>
          </span>
        }
        title={`The ${f.name} family`}
        description={`${f.address}, ${f.city} · ${f.area}`}
        actions={
          <>
            <Button variant="outline" size="sm" href="/messages" linkAs={Link} icon={<MessageSquare className="size-4" />}>
              Message
            </Button>
            <Button variant="outline" size="sm" icon={<Pencil className="size-4" />}>
              Edit
            </Button>
            <Menu
              trigger={({ toggle }) => <MoreButton onClick={toggle} />}
              items={[
                { label: "Pause service", icon: <Pause /> },
                { label: "Resend set-password email", icon: <Mail /> },
                "divider",
                { label: "End service", icon: <AlertTriangle />, tone: "danger" },
              ]}
            />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-4">
          <Card>
            <CardHeader title="Guardians" subtitle="Can sign in and receive the children" />
            <ul className="mt-4 flex flex-col gap-4">
              {f.guardians.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <Avatar seed={p.id} name={p.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium">{p.name}</p>
                    <p className="truncate text-[12.5px] text-ink-muted">{p.email}</p>
                  </div>
                  <Button variant="ghost" size="xs" href={`tel:${p.phone}`} icon={<Phone />} aria-label={`Call ${p.name}`}>
                    Call
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Account" />
            <div className="mt-2">
              <Row label="Balance" value={<span className={f.balance > 0 ? "text-bad" : undefined}>{money(f.balance)}</span>} />
              <Row label="Plan" value={<span className="capitalize">{f.cadence} · {f.cadence === "weekly" ? "due Fridays" : "due 2nd Friday"}</span>} />
              <Row label="Usually pays by" value={methodLabel[f.preferredPayment]} />
              <Row label="Phone" value={g.phone} />
              <Row label="Sign-in" value={<span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4 text-good" /> Password + email code</span>} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Emergency contact" icon={<UserCheck className="size-4" />} />
            <p className="mt-3 text-[14px] font-medium">{f.emergency.name}</p>
            <p className="text-[13px] text-ink-muted">
              {f.emergency.relationship} · {f.emergency.phone}
            </p>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Tabs
            className="mb-4"
            value={tab}
            onChange={setTab}
            options={[
              { value: "children", label: "Children", count: kids.length },
              { value: "billing", label: "Bills", count: bills.length },
              { value: "activity", label: "Activity" },
            ]}
          />
          {tab === "children" ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {kids.map((c) => (
                <ChildCard key={c.id} c={c} />
              ))}
            </div>
          ) : tab === "billing" ? (
            <Card flush>
              <DataTable
                rows={bills}
                rowKey={(i) => i.id}
                empty={<EmptyState title="No bills yet" />}
                columns={[
                  { key: "num", header: "Bill", cell: (i) => <span className="font-mono text-[13px]">{i.number}</span> },
                  { key: "period", header: "Period", cell: (i) => i.periodLabel },
                  { key: "due", header: "Due", cell: (i) => <span className="text-ink-soft">{i.due}</span>, hideBelow: "sm" },
                  { key: "total", header: "Total", align: "right", cell: (i) => <span className="font-mono tabular">{money(invoiceTotal(i))}</span> },
                  { key: "owed", header: "Owed", align: "right", cell: (i) => <span className="font-mono tabular text-ink-muted">{invoiceDue(i) ? money(invoiceDue(i)) : "—"}</span>, hideBelow: "md" },
                  { key: "status", header: "Status", align: "right", cell: (i) => <StatusBadge map={invoiceStatus} value={i.status} /> },
                ]}
              />
              <div className="border-t border-line px-5 py-4">
                <p className="text-[13px] font-medium text-ink-muted">Payments</p>
                <ul className="mt-2 divide-y divide-line">
                  {payments
                    .filter((p) => p.familyId === id)
                    .map((p) => (
                      <li key={p.id} className="flex items-center justify-between py-2.5 text-[13.5px]">
                        <span>
                          {methodLabel[p.method]} <span className="text-ink-muted">· {p.reference} · recorded by {p.recordedBy}</span>
                        </span>
                        <span className="flex items-center gap-4">
                          <span className="text-ink-muted">{p.at}</span>
                          <span className="font-mono tabular">{money(p.amount)}</span>
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </Card>
          ) : (
            <Card>
              {activity.length ? (
                <ul className="flex flex-col">
                  {activity.map((e) => (
                    <li key={e.id} className="flex gap-3 border-b border-line py-3 last:border-0">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink-muted" />
                      <div className="min-w-0 flex-1 text-[14px]">
                        <p>
                          <span className="font-medium">{e.who}</span> <span className="text-ink-soft">{e.action.toLowerCase()}</span> {e.target}
                        </p>
                        <p className="text-[12.5px] text-ink-muted">{e.detail}</p>
                      </div>
                      <span className="font-mono text-[12px] text-ink-muted">{e.at}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="Nothing yet today" body="Rides, payments and changes for this family show up here." />
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
