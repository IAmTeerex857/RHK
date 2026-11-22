"use client";

import { useState } from "react";
import { BellRing, CreditCard, Gift, Lock, Plus, Receipt, Send } from "lucide-react";
import {
  FEES,
  OFFICE,
  getFamily,
  invoiceDue,
  invoiceTotal,
  invoices,
  methodLabel,
  money,
  payments,
  priceList,
  revenueByWeek,
  type Invoice,
} from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge, Delta } from "@rhk/ui/components/badge";
import { Stat } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Row } from "@rhk/ui/components/card";
import { Sparkline } from "@rhk/ui/components/charts";
import { SearchField, Select } from "@rhk/ui/components/controls";
import { Dialog, RadioCard, Sheet } from "@rhk/ui/components/dialog";
import { Field } from "@rhk/ui/components/field";
import { Segmented, Tabs } from "@rhk/ui/components/segmented";
import { DataTable, TableToolbar } from "@rhk/ui/components/table";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { invoiceStatus, StatusBadge } from "../status";

export function BillingView() {
  const [tab, setTab] = useState<"bills" | "payments" | "prices">("bills");
  const [billFilter, setBillFilter] = useState<"due" | "overdue" | "all">("due");
  const [record, setRecord] = useState(false);
  const [bill, setBill] = useState<Invoice | null>(null);
  const [method, setMethod] = useState("zelle");
  const [q, setQ] = useState("");

  const due = invoices.filter((i) => i.status === "open" || i.status === "partial");
  const overdue = invoices.filter((i) => i.status === "overdue");
  const sum = (l: Invoice[]) => l.reduce((s, i) => s + invoiceDue(i), 0);
  const rows = invoices
    .filter((i) => (billFilter === "due" ? i.status === "open" || i.status === "partial" : billFilter === "overdue" ? i.status === "overdue" : true))
    .filter((i) => !q || `${getFamily(i.familyId).name} ${i.number}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader
        title="Billing"
        description="One bill per family, paid in advance. Weekly bills are due Friday for the next week; monthly bills by the second Friday."
        actions={
          <>
            <Button variant="outline" size="sm" icon={<BellRing className="size-4" />}>
              Send reminders
            </Button>
            <Button variant="ink" size="sm" icon={<Receipt className="size-4" />} onClick={() => setRecord(true)}>
              Record payment
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-line bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-raised">
            <CreditCard className="size-[18px]" />
          </span>
          <div>
            <p className="text-[14px] font-medium">Card payments and auto-pay are off</p>
            <p className="text-[13px] text-ink-muted">They turn on once the business Stripe account is connected. Until then, families pay by Zelle ({OFFICE.zelle}), Cash App ({OFFICE.cashApp}) or cash.</p>
          </div>
        </div>
        <Button variant="outline" size="xs" icon={<Lock />} disabled>
          Connect Stripe
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-start justify-between">
            <Stat label="Collected this week" value={money(3415, true)} delta={<Delta value={-12.5} />} note="vs last week" />
            <Sparkline values={revenueByWeek.map((r) => r.value)} width={96} height={40} />
          </div>
        </Card>
        <Card>
          <Stat label="Due today" value={money(sum(due))} note={`${due.length} bills · Fri, Nov 20`} />
        </Card>
        <Card>
          <Stat label="Overdue" value={<span className="text-bad">{money(sum(overdue))}</span>} note={`${overdue.length} families · reminders weekly`} />
        </Card>
        <Card>
          <Stat label="Next due dates" value="Nov 27" note="Weekly · then Dec 11 for monthly" />
        </Card>
      </div>

      <Tabs
        className="mb-4 mt-6"
        value={tab}
        onChange={setTab}
        options={[
          { value: "bills", label: "Bills", count: invoices.length },
          { value: "payments", label: "Payments", count: payments.length },
          { value: "prices", label: "Price list" },
        ]}
      />

      {tab === "bills" ? (
        <Card flush>
          <TableToolbar
            left={
              <Segmented
                value={billFilter}
                onChange={setBillFilter}
                options={[
                  { value: "due", label: "Due", count: due.length },
                  { value: "overdue", label: "Overdue", count: overdue.length },
                  { value: "all", label: "All", count: invoices.length },
                ]}
              />
            }
            right={<SearchField size="sm" placeholder="Search family or bill" value={q} onChange={setQ} className="w-full sm:w-64" />}
          />
          <DataTable
            rows={rows}
            rowKey={(i) => i.id}
            onRowClick={setBill}
            columns={[
              {
                key: "family",
                header: "Family",
                sort: (i) => getFamily(i.familyId).name,
                cell: (i) => {
                  const f = getFamily(i.familyId);
                  return (
                    <span className="flex items-center gap-3">
                      <Avatar seed={f.guardians[0].id} name={f.name} size={30} />
                      <span>
                        <span className="block font-medium">{f.name}</span>
                        <span className="block font-mono text-[12px] text-ink-muted">{i.number}</span>
                      </span>
                    </span>
                  );
                },
              },
              { key: "period", header: "Period", cell: (i) => <span className="text-ink-soft">{i.periodLabel}</span>, hideBelow: "sm" },
              { key: "due", header: "Due", sort: (i) => i.due, cell: (i) => <span className="text-ink-soft">{i.due}</span>, hideBelow: "md" },
              { key: "total", header: "Total", align: "right", sort: (i) => invoiceTotal(i), cell: (i) => <span className="font-mono tabular">{money(invoiceTotal(i))}</span>, hideBelow: "lg" },
              { key: "owed", header: "Owed", align: "right", sort: (i) => invoiceDue(i), cell: (i) => <span className="font-mono tabular">{invoiceDue(i) ? money(invoiceDue(i)) : "—"}</span> },
              { key: "status", header: "Status", align: "right", cell: (i) => <StatusBadge map={invoiceStatus} value={i.status} /> },
            ]}
          />
        </Card>
      ) : tab === "payments" ? (
        <Card flush>
          <DataTable
            rows={payments}
            rowKey={(p) => p.id}
            columns={[
              { key: "family", header: "Family", cell: (p) => <span className="font-medium">{getFamily(p.familyId).name}</span> },
              { key: "method", header: "Method", cell: (p) => <Badge tone={p.method === "card" ? "info" : "neutral"}>{methodLabel[p.method]}</Badge> },
              { key: "ref", header: "Reference", cell: (p) => <span className="font-mono text-[12.5px] text-ink-muted">{p.reference}</span>, hideBelow: "md" },
              { key: "by", header: "Recorded by", cell: (p) => <span className="text-ink-soft">{p.recordedBy}</span>, hideBelow: "lg" },
              { key: "at", header: "When", cell: (p) => <span className="text-ink-muted">{p.at}</span>, hideBelow: "sm" },
              { key: "amount", header: "Amount", align: "right", cell: (p) => <span className="font-mono tabular">{money(p.amount)}</span> },
            ]}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Card flush className="lg:col-span-8">
            <div className="flex items-center justify-between p-5">
              <CardHeader title="Service prices" subtitle="Each child gets a price from this list. Override per child for siblings and deals." />
              <Button variant="outline" size="xs" icon={<Plus />}>
                Add price
              </Button>
            </div>
            <DataTable
              rows={priceList}
              rowKey={(p) => p.id}
              columns={[
                { key: "label", header: "Service", cell: (p) => <span className="font-medium">{p.label}</span> },
                {
                  key: "weekly",
                  header: "Weekly",
                  align: "right",
                  cell: (p) => (
                    <input aria-label={`${p.label} weekly price`} defaultValue={p.weekly.toFixed(2)} className="h-9 w-24 rounded-lg border border-line-strong bg-card px-2.5 text-right font-mono text-[13.5px] tabular outline-none focus:border-ink/40" />
                  ),
                },
                {
                  key: "monthly",
                  header: "Monthly",
                  align: "right",
                  cell: (p) => (
                    <input aria-label={`${p.label} monthly price`} defaultValue={p.monthly.toFixed(2)} className="h-9 w-24 rounded-lg border border-line-strong bg-card px-2.5 text-right font-mono text-[13.5px] tabular outline-none focus:border-ink/40" />
                  ),
                },
                { key: "kids", header: "Children", align: "right", cell: (p) => <span className="font-mono tabular text-ink-muted">{p.children}</span>, hideBelow: "sm" },
              ]}
            />
            <p className="border-t border-line px-5 py-3 text-[12.5px] text-ink-muted">Changing a price applies to new bills. Existing bills and per-child overrides stay as they are.</p>
          </Card>
          <Card className="lg:col-span-4">
            <CardHeader title="Fees" />
            <div className="mt-2">
              <Row label="Application fee" value={<span className="font-mono">{money(FEES.application)} / child</span>} />
              <Row label="Late cancellation" value={<span className="font-mono">{money(FEES.lateCancel)}</span>} />
            </div>
            <p className="mt-3 text-[13px] text-ink-muted">The application fee is non-refundable once paid. The late-cancellation fee is added to the next bill when a ride is cancelled with less than a week&apos;s notice.</p>
          </Card>
        </div>
      )}

      <Sheet
        open={bill !== null}
        onClose={() => setBill(null)}
        icon={<Receipt className="size-5" />}
        title={bill ? `${getFamily(bill.familyId).name} · ${bill.periodLabel}` : ""}
        description={bill ? `${bill.number} · due ${bill.due}` : ""}
        footer={
          <>
            <Button variant="outline" size="sm" icon={<Send className="size-4" />}>
              Send reminder
            </Button>
            <Button
              variant="ink"
              size="sm"
              icon={<Receipt className="size-4" />}
              onClick={() => {
                setBill(null);
                setRecord(true);
              }}
            >
              Record payment
            </Button>
          </>
        }
      >
        {bill ? (
          <>
            <div className="flex items-center justify-between">
              <StatusBadge map={invoiceStatus} value={bill.status} />
              <span className="font-mono text-[12.5px] text-ink-muted capitalize">{bill.cadence} · issued {bill.issued}</span>
            </div>
            <ul className="mt-5 divide-y divide-line rounded-2xl border border-line">
              {bill.lines.map((l) => (
                <li key={l.label} className="flex items-center justify-between gap-4 px-4 py-3 text-[14px]">
                  <span className="min-w-0">
                    {l.label}
                    {l.kind === "fee" ? <Badge className="ml-2" tone="warn">Fee</Badge> : null}
                  </span>
                  <span className="font-mono tabular">{money(l.amount)}</span>
                </li>
              ))}
              <li className="flex items-center justify-between bg-raised/60 px-4 py-3 text-[14px]">
                <span className="text-ink-muted">Paid</span>
                <span className="font-mono tabular text-ink-muted">−{money(bill.paid)}</span>
              </li>
              <li className="flex items-center justify-between px-4 py-3.5">
                <span className="font-medium">Owed</span>
                <span className="font-mono text-[18px] font-medium tabular">{money(invoiceDue(bill))}</span>
              </li>
            </ul>
            <button type="button" className="mt-4 inline-flex items-center gap-2 text-[13.5px] font-medium text-ink-soft hover:text-ink">
              <Gift className="size-4" /> Add a credit
            </button>
            <div className="mt-6 rounded-2xl bg-raised p-4 text-[13px] text-ink-soft">
              <p className="font-medium text-ink">Reminders</p>
              <p className="mt-1">Sent Wednesday (2 days before) and Friday morning. While overdue, a reminder goes out every Friday. There&apos;s no late fee.</p>
            </div>
          </>
        ) : null}
      </Sheet>

      <Dialog
        open={record}
        onClose={() => setRecord(false)}
        icon={<Receipt className="size-5" />}
        title="Record a payment"
        description="For Zelle, Cash App and cash. Card payments record themselves once Stripe is on."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setRecord(false)}>
              Cancel
            </Button>
            <Button variant="ink" size="sm" onClick={() => setRecord(false)}>
              Record and send receipt
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Select label="Bill" defaultValue="inv-2291">
            {invoices
              .filter((i) => invoiceDue(i) > 0)
              .map((i) => (
                <option key={i.id} value={i.id}>
                  {getFamily(i.familyId).name} · {i.periodLabel} · {money(invoiceDue(i))} owed
                </option>
              ))}
          </Select>
          <div>
            <p className="mb-1.5 text-[13px] font-medium text-ink-soft">Paid by</p>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              <RadioCard name="m" checked={method === "zelle"} onChange={() => setMethod("zelle")} title="Zelle" description="Check the Zelle app" />
              <RadioCard name="m" checked={method === "cash_app"} onChange={() => setMethod("cash_app")} title="Cash App" description={OFFICE.cashApp} />
              <RadioCard name="m" checked={method === "cash"} onChange={() => setMethod("cash")} title="Cash" description="Paid at the office or to a driver" />
              <RadioCard name="m" checked={false} onChange={() => {}} title="Card" description="After Stripe is connected" className="pointer-events-none opacity-50" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Amount" inputMode="decimal" defaultValue="142.50" />
            <Field label="Reference" hint="Zelle confirmation or Cash App ID" />
          </div>
        </div>
      </Dialog>
    </>
  );
}
