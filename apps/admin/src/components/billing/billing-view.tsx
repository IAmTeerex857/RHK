"use client";

import { useState } from "react";
import { AlertCircle, BellRing, CalendarClock, CalendarDays, CreditCard, Gift, Lock, Plus, Receipt, Send, Wallet } from "lucide-react";
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
  type PriceItem,
} from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge, Delta } from "@rhk/ui/components/badge";
import { EmptyState, Stat } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Row } from "@rhk/ui/components/card";
import { Sparkline } from "@rhk/ui/components/charts";
import { SearchField, Select } from "@rhk/ui/components/controls";
import { Dialog, RadioCard, Sheet } from "@rhk/ui/components/dialog";
import { Field } from "@rhk/ui/components/field";
import { Segmented, Tabs } from "@rhk/ui/components/segmented";
import { DataTable, TableToolbar } from "@rhk/ui/components/table";
import { toast } from "@rhk/ui/components/toast";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { invoiceStatus, StatusBadge } from "../status";

export function BillingView() {
  const [tab, setTab] = useState<"bills" | "payments" | "prices">("bills");
  const [billFilter, setBillFilter] = useState<"due" | "overdue" | "all">("due");
  const [record, setRecord] = useState(false);
  const [bill, setBill] = useState<Invoice | null>(null);
  const [method, setMethod] = useState("zelle");
  const [q, setQ] = useState("");
  const [remind, setRemind] = useState(false);
  const [prices, setPrices] = useState<PriceItem[]>(priceList);
  const [priceDraft, setPriceDraft] = useState<Record<string, { weekly: string; monthly: string }>>({});
  const [addPrice, setAddPrice] = useState(false);
  const [np, setNp] = useState({ label: "", service: "both" as PriceItem["service"], weekly: "", monthly: "" });
  const [credit, setCredit] = useState(false);
  const [credits, setCredits] = useState<Record<string, { amount: number; reason: string }[]>>({});
  const [cr, setCr] = useState({ amount: "", reason: "" });
  const [err, setErr] = useState<string | undefined>();
  const [payBill, setPayBill] = useState("inv-2291");
  const [payAmount, setPayAmount] = useState("142.50");
  const [payRef, setPayRef] = useState("");
  const [skip, setSkip] = useState<Record<string, boolean>>({});

  const due = invoices.filter((i) => i.status === "open" || i.status === "partial");
  const overdue = invoices.filter((i) => i.status === "overdue");
  const sum = (l: Invoice[]) => l.reduce((s, i) => s + invoiceDue(i), 0);
  const toRemind = [...overdue, ...due];
  const billCredits = bill ? (credits[bill.id] ?? []) : [];
  const creditTotal = billCredits.reduce((n, c) => n + c.amount, 0);
  const pricesChanged = Object.keys(priceDraft).length > 0;
  const num = (v: string) => Number(v.replace(/[^0-9.]/g, ""));
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
            <Button variant="outline" size="sm" icon={<BellRing className="size-4" />} onClick={() => setRemind(true)}>
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
            <p className="text-[13px] text-ink-muted">They turn on once the business Stripe account is connected. Until then, families pay by Zelle ({OFFICE.zelle}) or Cash App ({OFFICE.cashApp}).</p>
          </div>
        </div>
        <Button variant="outline" size="xs" icon={<Lock />} disabled>
          Connect Stripe
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-start justify-between">
            <Stat icon={<Wallet />} iconTone="green" label="Collected this week" value={money(3415, true)} delta={<Delta value={-12.5} />} note="vs last week" />
            <Sparkline values={revenueByWeek.map((r) => r.value)} width={96} height={40} />
          </div>
        </Card>
        <Card>
          <Stat icon={<CalendarClock />} iconTone="yellow" label="Due today" value={money(sum(due))} note={`${due.length} bills · Fri, Nov 20`} />
        </Card>
        <Card>
          <Stat icon={<AlertCircle />} iconTone="coral" label="Overdue" value={<span className="text-bad">{money(sum(overdue))}</span>} note={`${overdue.length} families · reminders weekly`} />
        </Card>
        <Card>
          <Stat icon={<CalendarDays />} iconTone="blue" label="Next due dates" value="Nov 27" note="Weekly · then Dec 11 for monthly" />
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
            empty={<EmptyState icon={<Receipt />} title={billFilter === "overdue" ? "No overdue bills" : billFilter === "due" ? "Nothing due right now" : "No bills yet"} body={q ? "Try another family name or bill number." : "Bills are made each week and month from the price list."} />}
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
              { key: "owed", header: "Owed", align: "right", sort: (i) => invoiceDue(i), cell: (i) => <span className="font-mono tabular">{invoiceDue(i) ? money(invoiceDue(i)) : <span className="text-ink-muted">Paid</span>}</span> },
              { key: "status", header: "Status", align: "right", cell: (i) => <StatusBadge map={invoiceStatus} value={i.status} /> },
            ]}
          />
        </Card>
      ) : tab === "payments" ? (
        <Card flush>
          <DataTable
            rows={payments}
            empty={<EmptyState icon={<Wallet />} title="No payments yet" body="Zelle and Cash App payments show here once you record them." />}
            rowKey={(p) => p.id}
            columns={[
              { key: "family", header: "Family", cell: (p) => <span className="font-medium">{getFamily(p.familyId).name}</span> },
              { key: "method", header: "Method", cell: (p) => <Badge tone={p.method === "card" ? "info" : "neutral"}>{methodLabel[p.method]}</Badge> },
              { key: "ref", header: "Reference", cell: (p) => <span className="font-mono text-[13px] text-ink-muted">{p.reference}</span>, hideBelow: "md" },
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
              <div className="flex shrink-0 gap-2">
                {pricesChanged ? (
                  <Button
                    variant="ink"
                    size="xs"
                    onClick={() => {
                      setPrices((list) => list.map((p) => (priceDraft[p.id] ? { ...p, weekly: num(priceDraft[p.id].weekly) || p.weekly, monthly: num(priceDraft[p.id].monthly) || p.monthly } : p)));
                      setPriceDraft({});
                      toast("Prices saved", { body: "New bills use them. Existing bills and overrides stay the same." });
                    }}
                  >
                    Save prices
                  </Button>
                ) : null}
                <Button variant="outline" size="xs" icon={<Plus />} onClick={() => setAddPrice(true)}>
                  Add price
                </Button>
              </div>
            </div>
            <DataTable
              rows={prices}
            empty={<EmptyState icon={<Plus />} title="No prices yet" body="Add a price for each kind of service before the first bills go out." />}
              rowKey={(p) => p.id}
              columns={[
                { key: "label", header: "Service", cell: (p) => <span className="font-medium">{p.label}</span> },
                {
                  key: "weekly",
                  header: "Weekly",
                  align: "right",
                  cell: (p) => (
                    <input aria-label={`${p.label} weekly price`} inputMode="decimal" value={priceDraft[p.id]?.weekly ?? p.weekly.toFixed(2)} onChange={(e) => setPriceDraft((d) => ({ ...d, [p.id]: { ...{ weekly: d[p.id]?.weekly ?? p.weekly.toFixed(2), monthly: d[p.id]?.monthly ?? p.monthly.toFixed(2) }, weekly: e.target.value } }))} className="h-9 w-24 rounded-lg border border-line-strong bg-card px-2.5 text-right font-mono text-[14px] tabular outline-none focus:border-ink/40" />
                  ),
                },
                {
                  key: "monthly",
                  header: "Monthly",
                  align: "right",
                  cell: (p) => (
                    <input aria-label={`${p.label} monthly price`} inputMode="decimal" value={priceDraft[p.id]?.monthly ?? p.monthly.toFixed(2)} onChange={(e) => setPriceDraft((d) => ({ ...d, [p.id]: { ...{ weekly: d[p.id]?.weekly ?? p.weekly.toFixed(2), monthly: d[p.id]?.monthly ?? p.monthly.toFixed(2) }, monthly: e.target.value } }))} className="h-9 w-24 rounded-lg border border-line-strong bg-card px-2.5 text-right font-mono text-[14px] tabular outline-none focus:border-ink/40" />
                  ),
                },
                { key: "kids", header: "Children", align: "right", cell: (p) => <span className="font-mono tabular text-ink-muted">{p.children}</span>, hideBelow: "sm" },
              ]}
            />
            <p className="border-t border-line px-5 py-3 text-[13px] text-ink-muted">Changing a price applies to new bills. Existing bills and per-child overrides stay as they are.</p>
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
            <Button
              variant="outline"
              size="sm"
              icon={<Send className="size-4" />}
              disabled={!bill || invoiceDue(bill) - creditTotal <= 0}
              onClick={() => bill && toast("Reminder sent", { body: `${getFamily(bill.familyId).guardians[0].name} · ${bill.number}` })}
            >
              Send reminder
            </Button>
            <Button
              variant="ink"
              size="sm"
              icon={<Receipt className="size-4" />}
              onClick={() => {
                if (bill) {
                  setPayBill(bill.id);
                  setPayAmount(Math.max(0, invoiceDue(bill) - creditTotal).toFixed(2));
                }
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
              <span className="font-mono text-[13px] text-ink-muted capitalize">{bill.cadence} · issued {bill.issued}</span>
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
              {billCredits.map((c, k) => (
                <li key={k} className="flex items-center justify-between gap-4 px-4 py-3 text-[14px]">
                  <span className="min-w-0">
                    {c.reason}
                    <Badge className="ml-2" tone="good">
                      Credit
                    </Badge>
                  </span>
                  <span className="font-mono tabular">−{money(c.amount)}</span>
                </li>
              ))}
              <li className="flex items-center justify-between bg-raised/60 px-4 py-3 text-[14px]">
                <span className="text-ink-muted">Paid</span>
                <span className="font-mono tabular text-ink-muted">−{money(bill.paid)}</span>
              </li>
              <li className="flex items-center justify-between px-4 py-3.5">
                <span className="font-medium">Owed</span>
                <span className="font-mono text-[18px] font-medium tabular">{money(Math.max(0, invoiceDue(bill) - creditTotal))}</span>
              </li>
            </ul>
            <button type="button" onClick={() => setCredit(true)} className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-ink-soft hover:text-ink">
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
        description="Families pay by Zelle or Cash App. Log cash here too if a family ever pays that way."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setRecord(false)}>
              Cancel
            </Button>
            <Button
              variant="ink"
              size="sm"
              onClick={() => {
                if (!(num(payAmount) > 0)) return setErr("Enter the amount received.");
                const inv = invoices.find((i) => i.id === payBill)!;
                setErr(undefined);
                setRecord(false);
                setPayRef("");
                toast(`${money(num(payAmount))} recorded`, { body: `${getFamily(inv.familyId).name} · ${inv.number}. Receipt emailed.` });
              }}
            >
              Record and send receipt
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Select
            label="Bill"
            value={payBill}
            onChange={(e) => {
              setPayBill(e.target.value);
              const inv = invoices.find((i) => i.id === e.target.value);
              if (inv) setPayAmount(invoiceDue(inv).toFixed(2));
            }}
          >
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
              <RadioCard name="m" checked={method === "cash"} onChange={() => setMethod("cash")} title="Cash" description="Only if a family pays this way" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Amount" inputMode="decimal" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} error={err} />
            <Field label="Reference" hint="Zelle confirmation or Cash App ID" value={payRef} onChange={(e) => setPayRef(e.target.value)} />
          </div>
        </div>
      </Dialog>

      <Dialog
        open={remind}
        onClose={() => setRemind(false)}
        icon={<BellRing className="size-5" />}
        title="Send reminders now"
        description="Reminders also go out on their own: Wednesday before the due date, Friday morning, and every Friday while overdue."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setRemind(false)}>
              Cancel
            </Button>
            <Button
              variant="ink"
              size="sm"
              icon={<Send className="size-4" />}
              disabled={toRemind.every((i) => skip[i.id])}
              onClick={() => {
                const n = toRemind.filter((i) => !skip[i.id]).length;
                setRemind(false);
                toast(`${n} reminder${n === 1 ? "" : "s"} sent`, { body: "By email and push." });
              }}
            >
              Send {toRemind.filter((i) => !skip[i.id]).length}
            </Button>
          </>
        }
      >
        <ul className="flex flex-col gap-1">
          {toRemind.map((i) => {
            const f = getFamily(i.familyId);
            return (
              <li key={i.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-raised">
                  <input type="checkbox" checked={!skip[i.id]} onChange={(e) => setSkip((x) => ({ ...x, [i.id]: !e.target.checked }))} className="size-4 accent-[var(--color-ink)]" />
                  <Avatar seed={f.guardians[0].id} name={f.name} size={28} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-medium">{f.name}</span>
                    <span className="block truncate text-[13px] text-ink-muted">
                      {i.number} · due {i.due}
                    </span>
                  </span>
                  <span className="font-mono text-[14px] tabular">{money(invoiceDue(i))}</span>
                  <StatusBadge map={invoiceStatus} value={i.status} />
                </label>
              </li>
            );
          })}
        </ul>
      </Dialog>

      <Dialog
        open={addPrice}
        onClose={() => {
          setAddPrice(false);
          setErr(undefined);
        }}
        icon={<Plus className="size-5" />}
        title="Add a price"
        description="Children get a price from this list. You can still override it per child."
        footer={
          <>
            <Button
              variant="soft"
              size="sm"
              onClick={() => {
                setAddPrice(false);
                setErr(undefined);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="ink"
              size="sm"
              onClick={() => {
                if (!np.label.trim()) return setErr("Name the service.");
                if (!(num(np.weekly) > 0) || !(num(np.monthly) > 0)) return setErr("Enter a weekly and a monthly price.");
                setPrices((l) => [...l, { id: `pl-${Date.now()}`, service: np.service, label: np.label.trim(), weekly: num(np.weekly), monthly: num(np.monthly), active: true, children: 0 }]);
                toast(`${np.label.trim()} added to the price list`);
                setNp({ label: "", service: "both", weekly: "", monthly: "" });
                setErr(undefined);
                setAddPrice(false);
              }}
            >
              Add price
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Service name" className="sm:col-span-2" value={np.label} onChange={(e) => setNp((x) => ({ ...x, label: e.target.value }))} />
          <Select label="Rides" className="sm:col-span-2" value={np.service} onChange={(e) => setNp((x) => ({ ...x, service: e.target.value as PriceItem["service"] }))}>
            <option value="both">Before and after school</option>
            <option value="pm">After school only</option>
            <option value="am">Before school only</option>
          </Select>
          <Field label="Weekly price" inputMode="decimal" value={np.weekly} onChange={(e) => setNp((x) => ({ ...x, weekly: e.target.value }))} />
          <Field label="Monthly price" inputMode="decimal" value={np.monthly} onChange={(e) => setNp((x) => ({ ...x, monthly: e.target.value }))} />
        </div>
        {err ? <p className="mt-3 text-[13px] font-medium text-bad">{err}</p> : null}
      </Dialog>

      <Dialog
        open={credit}
        onClose={() => {
          setCredit(false);
          setErr(undefined);
        }}
        size="sm"
        icon={<Gift className="size-5" />}
        title="Add a credit"
        description={bill ? `Comes off ${getFamily(bill.familyId).name}'s ${bill.number}.` : undefined}
        footer={
          <>
            <Button
              variant="soft"
              size="sm"
              onClick={() => {
                setCredit(false);
                setErr(undefined);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="ink"
              size="sm"
              onClick={() => {
                if (!bill) return;
                const amount = num(cr.amount);
                if (!(amount > 0)) return setErr("Enter an amount.");
                if (!cr.reason.trim()) return setErr("Add a reason. The family sees it on the bill.");
                setCredits((c) => ({ ...c, [bill.id]: [...(c[bill.id] ?? []), { amount, reason: cr.reason.trim() }] }));
                toast(`${money(amount)} credit added`, { body: bill.number });
                setCr({ amount: "", reason: "" });
                setErr(undefined);
                setCredit(false);
              }}
            >
              Add credit
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Field label="Amount" inputMode="decimal" value={cr.amount} onChange={(e) => setCr((x) => ({ ...x, amount: e.target.value }))} />
          <Field label="Reason" hint="Shown to the family on the bill" value={cr.reason} onChange={(e) => setCr((x) => ({ ...x, reason: e.target.value }))} error={err} />
        </div>
      </Dialog>
    </>
  );
}
