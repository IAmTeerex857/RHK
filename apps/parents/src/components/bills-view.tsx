"use client";

import { useState } from "react";
import { Check, Copy, FileText, Printer, Send } from "lucide-react";
import { invoiceDue, invoiceTotal, methodLabel, money, OFFICE, payments, type Invoice } from "@rhk/fixtures";
import { Badge } from "@rhk/ui/components/badge";
import { EmptyState } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader } from "@rhk/ui/components/card";
import { Dialog } from "@rhk/ui/components/dialog";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { cn } from "@rhk/ui/lib/cn";
import { bills, family, openBill, parent } from "./family";

export function BillsView() {
  const [sent, setSent] = useState(false);
  const [receipt, setReceipt] = useState<Invoice | null>(null);
  const past = bills.filter((b) => b !== openBill);

  return (
    <>
      <PageHeader title="Bills" description="One bill a week for the whole family, paid in advance. Due Fridays for the week after." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {openBill ? (
          <Card className="lg:col-span-7">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[13px] text-ink-muted">{openBill.number}</span>
              {sent ? (
                <Badge tone="info" dot>
                  Payment sent · office confirming
                </Badge>
              ) : (
                <Badge tone="warn" dot>
                  Due today
                </Badge>
              )}
            </div>
            <p className="mt-4 text-[14px] text-ink-muted">{openBill.periodLabel}</p>
            <p className="mt-1 font-display text-[48px] font-medium leading-none tracking-[-0.05em] tabular">{money(invoiceDue(openBill))}</p>
            <p className="mt-2 text-[14px] text-ink-muted">Due {openBill.due}</p>
            <ul className="mt-6 border-t border-line">
              {openBill.lines.map((l) => (
                <li key={l.label} className="flex items-baseline justify-between gap-4 border-b border-line py-3 text-[14px] last:border-0">
                  <span className="text-ink-soft">{l.label}</span>
                  <span className="font-mono tabular">{money(l.amount)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] text-ink-muted">School holidays don&apos;t change the price. Thanksgiving week is billed as usual.</p>
          </Card>
        ) : null}

        <Card className="lg:col-span-5">
          <CardHeader title="How to pay" subtitle={openBill ? `Zelle or Cash App. Put ${openBill.number} in the memo so the office can match it.` : "Zelle or Cash App"} />
          <div className="mt-4 flex flex-col gap-2">
            <PayRow icon={<span className="font-display text-[15px] font-medium">Z</span>} title="Zelle" value={OFFICE.zelle} />
            <PayRow icon={<span className="font-display text-[15px] font-medium">$</span>} title="Cash App" value={OFFICE.cashApp} />
          </div>
          {openBill && !sent ? (
            <Button variant="ink" size="md" className="mt-4 w-full" icon={<Send className="size-4" />} onClick={() => setSent(true)}>
              I&apos;ve sent {money(invoiceDue(openBill))}
            </Button>
          ) : openBill ? (
            <p className="mt-4 rounded-xl bg-raised p-3 text-[13px] text-ink-soft">Thanks. The office marks it paid once it arrives, and you&apos;ll get a receipt by email.</p>
          ) : null}
        </Card>

        <Card flush className="lg:col-span-12">
          <div className="p-5 pb-2">
            <CardHeader title="Past bills" subtitle="Receipts for every payment" />
          </div>
          {!past.length ? <EmptyState icon={<FileText />} title="No past bills yet" body="Receipts for paid bills show up here." /> : null}
          <ul>
            {past.map((b) => {
              const pay = payments.find((p) => p.invoiceId === b.id);
              const fee = b.lines.some((l) => l.kind === "fee");
              return (
                <li key={b.id} className="flex items-center gap-3 border-t border-line px-5 py-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint-soft text-good">
                    <Check className="size-4 stroke-[2.5]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium">{b.periodLabel}</span>
                    <span className="block truncate text-[13px] text-ink-muted">
                      {b.number} · {pay ? `${methodLabel[pay.method]} · ${pay.at}` : `Paid · due ${b.due}`}
                      {fee ? " · includes a $35 fee" : ""}
                    </span>
                  </span>
                  <span className="font-mono text-[14px] tabular">{money(invoiceTotal(b))}</span>
                  <button
                    type="button"
                    onClick={() => setReceipt(b)}
                    aria-label={`Receipt for ${b.number}`}
                    className="grid size-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-raised hover:text-ink"
                  >
                    <FileText className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Dialog
        open={Boolean(receipt)}
        onClose={() => setReceipt(null)}
        size="sm"
        icon={<FileText className="size-5" />}
        title={receipt ? `Receipt · ${receipt.number}` : ""}
        footer={
          <Button variant="outline" size="sm" icon={<Printer className="size-4" />} onClick={() => window.print()}>
            Print or save PDF
          </Button>
        }
      >
        {receipt ? (
          <div className="text-[14px]">
            <p className="font-medium">{OFFICE.name}</p>
            <p className="text-ink-muted">{OFFICE.address}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-raised p-3 text-[13px]">
              <div>
                <p className="text-ink-muted">Billed to</p>
                <p className="font-medium">{parent.name}</p>
                <p className="text-ink-muted">
                  {family.address}, {family.city}
                </p>
              </div>
              <div>
                <p className="text-ink-muted">Period</p>
                <p className="font-medium">{receipt.periodLabel}</p>
                <p className="text-ink-muted">Paid by {payments.find((p) => p.invoiceId === receipt.id)?.at.split(",")[0] ?? receipt.due}</p>
              </div>
            </div>
            <ul className="mt-4">
              {receipt.lines.map((l) => (
                <li key={l.label} className="flex justify-between gap-4 border-b border-line py-2.5 text-[14px]">
                  <span className="text-ink-soft">{l.label}</span>
                  <span className="font-mono tabular">{money(l.amount)}</span>
                </li>
              ))}
              <li className="flex justify-between pt-3 font-medium">
                <span>Paid</span>
                <span className="font-mono tabular">{money(invoiceTotal(receipt))}</span>
              </li>
            </ul>
          </div>
        ) : null}
      </Dialog>
    </>
  );
}

export function PayRow({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="grid grid-cols-[40px_1fr_auto] items-center gap-x-3 rounded-2xl border border-line p-3">
      <span className="grid size-10 place-items-center rounded-xl bg-raised">{icon}</span>
      <span className="text-[15px] font-medium">{title}</span>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(value).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors", copied ? "text-good" : "text-ink-muted hover:bg-raised hover:text-ink")}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <span className="col-span-3 mt-2.5 rounded-xl bg-raised px-3 py-2 text-[14px] text-ink [overflow-wrap:anywhere]">
        {value.includes("@") ? (
          <>
            {value.slice(0, value.indexOf("@") + 1)}
            <wbr />
            {value.slice(value.indexOf("@") + 1)}
          </>
        ) : (
          value
        )}
      </span>
    </div>
  );
}
