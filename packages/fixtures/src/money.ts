import type { Invoice, Payment, PriceItem } from "./types";

export const priceList: PriceItem[] = [
  { id: "pl-both", service: "both", label: "Before and after school", weekly: 95, monthly: 360, active: true, children: 10 },
  { id: "pl-pm", service: "pm", label: "After school only", weekly: 60, monthly: 225, active: true, children: 4 },
  { id: "pl-am", service: "am", label: "Before school only", weekly: 50, monthly: 190, active: true, children: 1 },
];

export const FEES = { application: 25, lateCancel: 35 };

export const invoices: Invoice[] = [
  {
    id: "inv-2291",
    number: "RHK-2291",
    familyId: "f-johnson",
    period: "2026-W48",
    periodLabel: "Week of Nov 23",
    cadence: "weekly",
    issued: "Nov 16",
    due: "Fri, Nov 20",
    status: "open",
    paid: 0,
    lines: [
      { label: "Maya · Before and after school", childId: "c-maya", amount: 95, kind: "service" },
      { label: "Eli · Before and after school (sibling, half off)", childId: "c-eli", amount: 47.5, kind: "service" },
    ],
  },
  {
    id: "inv-2264",
    number: "RHK-2264",
    familyId: "f-johnson",
    period: "2026-W47",
    periodLabel: "Week of Nov 16",
    cadence: "weekly",
    issued: "Nov 9",
    due: "Fri, Nov 13",
    status: "paid",
    paid: 142.5,
    lines: [
      { label: "Maya · Before and after school", childId: "c-maya", amount: 95, kind: "service" },
      { label: "Eli · Before and after school (sibling, half off)", childId: "c-eli", amount: 47.5, kind: "service" },
    ],
  },
  {
    id: "inv-2237",
    number: "RHK-2237",
    familyId: "f-johnson",
    period: "2026-W46",
    periodLabel: "Week of Nov 9",
    cadence: "weekly",
    issued: "Nov 2",
    due: "Fri, Nov 6",
    status: "paid",
    paid: 177.5,
    lines: [
      { label: "Maya · Before and after school", childId: "c-maya", amount: 95, kind: "service" },
      { label: "Eli · Before and after school (sibling, half off)", childId: "c-eli", amount: 47.5, kind: "service" },
      { label: "Late cancellation · Eli, Nov 4", childId: "c-eli", amount: 35, kind: "fee" },
    ],
  },
  {
    id: "inv-2210",
    number: "RHK-2210",
    familyId: "f-johnson",
    period: "2026-W45",
    periodLabel: "Week of Nov 2",
    cadence: "weekly",
    issued: "Oct 26",
    due: "Fri, Oct 30",
    status: "paid",
    paid: 142.5,
    lines: [
      { label: "Maya · Before and after school", childId: "c-maya", amount: 95, kind: "service" },
      { label: "Eli · Before and after school (sibling, half off)", childId: "c-eli", amount: 47.5, kind: "service" },
    ],
  },
  { id: "inv-2290", number: "RHK-2290", familyId: "f-williams", period: "2026-W48", periodLabel: "Week of Nov 23", cadence: "weekly", issued: "Nov 16", due: "Fri, Nov 20", status: "open", paid: 0, lines: [{ label: "Jaden · Before and after school", childId: "c-jaden", amount: 95, kind: "service" }] },
  { id: "inv-2263", number: "RHK-2263", familyId: "f-williams", period: "2026-W47", periodLabel: "Week of Nov 16", cadence: "weekly", issued: "Nov 9", due: "Fri, Nov 13", status: "overdue", paid: 0, lines: [{ label: "Jaden · Before and after school", childId: "c-jaden", amount: 95, kind: "service" }] },
  { id: "inv-2289", number: "RHK-2289", familyId: "f-martinez", period: "2026-W48", periodLabel: "Week of Nov 23", cadence: "weekly", issued: "Nov 16", due: "Fri, Nov 20", status: "paid", paid: 90, lines: [{ label: "Leo · After school only", childId: "c-leo", amount: 60, kind: "service" }, { label: "Ava · After school only (sibling, half off)", childId: "c-ava", amount: 30, kind: "service" }] },
  { id: "inv-2288", number: "RHK-2288", familyId: "f-brooks", period: "2026-W48", periodLabel: "Week of Nov 23", cadence: "weekly", issued: "Nov 16", due: "Fri, Nov 20", status: "open", paid: 0, lines: [{ label: "Amari · After school only", childId: "c-amari", amount: 60, kind: "service" }] },
  { id: "inv-2287", number: "RHK-2287", familyId: "f-davis", period: "2026-W48", periodLabel: "Week of Nov 23", cadence: "weekly", issued: "Nov 16", due: "Fri, Nov 20", status: "paid", paid: 95, lines: [{ label: "Nia · Before and after school", childId: "c-nia", amount: 95, kind: "service" }] },
  { id: "inv-2286", number: "RHK-2286", familyId: "f-carter", period: "2026-W48", periodLabel: "Week of Nov 23", cadence: "weekly", issued: "Nov 16", due: "Fri, Nov 20", status: "paid", paid: 95, lines: [{ label: "Mila · Before and after school", childId: "c-mila", amount: 95, kind: "service" }] },
  { id: "inv-2285", number: "RHK-2285", familyId: "f-reed", period: "2026-W48", periodLabel: "Week of Nov 23", cadence: "weekly", issued: "Nov 16", due: "Fri, Nov 20", status: "partial", paid: 95, lines: [{ label: "Owen · Before and after school", childId: "c-owen", amount: 95, kind: "service" }, { label: "Sam · Before school only", childId: "c-sam", amount: 50, kind: "service" }] },
  { id: "inv-2240", number: "RHK-2240", familyId: "f-okafor", period: "2026-11", periodLabel: "November", cadence: "monthly", issued: "Nov 1", due: "Fri, Nov 13", status: "paid", paid: 360, lines: [{ label: "Zara · Before and after school", childId: "c-zara", amount: 360, kind: "service" }] },
  { id: "inv-2241", number: "RHK-2241", familyId: "f-patel", period: "2026-11", periodLabel: "November", cadence: "monthly", issued: "Nov 1", due: "Fri, Nov 13", status: "paid", paid: 540, lines: [{ label: "Arjun · Before and after school", childId: "c-arjun", amount: 360, kind: "service" }, { label: "Meera · Before and after school (sibling, half off)", childId: "c-meera", amount: 180, kind: "service" }] },
  { id: "inv-2242", number: "RHK-2242", familyId: "f-nguyen", period: "2026-11", periodLabel: "November", cadence: "monthly", issued: "Nov 1", due: "Fri, Nov 13", status: "paid", paid: 360, lines: [{ label: "Kai · Before and after school", childId: "c-kai", amount: 360, kind: "service" }] },
  { id: "inv-2243", number: "RHK-2243", familyId: "f-thompson", period: "2026-11", periodLabel: "November", cadence: "monthly", issued: "Nov 1", due: "Fri, Nov 13", status: "overdue", paid: 135, lines: [{ label: "Isaiah · Before and after school", childId: "c-isaiah", amount: 360, kind: "service" }] },
];

export const payments: Payment[] = [
  { id: "pay-1", invoiceId: "inv-2289", familyId: "f-martinez", method: "cash_app", amount: 90, at: "Today, 9:12 AM", reference: "$SofiaM · #8F21", recordedBy: "Jordan Lee" },
  { id: "pay-2", invoiceId: "inv-2287", familyId: "f-davis", method: "zelle", amount: 95, at: "Today, 8:40 AM", reference: "Zelle 4471", recordedBy: "Clara" },
  { id: "pay-3", invoiceId: "inv-2286", familyId: "f-carter", method: "cash_app", amount: 95, at: "Yesterday, 7:58 PM", reference: "Cash App 7781", recordedBy: "Jordan Lee" },
  { id: "pay-4", invoiceId: "inv-2285", familyId: "f-reed", method: "zelle", amount: 95, at: "Yesterday, 4:02 PM", reference: "Zelle 4502", recordedBy: "Clara" },
  { id: "pay-5", invoiceId: "inv-2264", familyId: "f-johnson", method: "zelle", amount: 142.5, at: "Nov 13, 6:15 PM", reference: "Zelle 3390", recordedBy: "Clara" },
  { id: "pay-6", invoiceId: "inv-2243", familyId: "f-thompson", method: "cash_app", amount: 135, at: "Nov 12, 12:30 PM", reference: "$MoniqueT · #22A0", recordedBy: "Jordan Lee" },
  { id: "pay-7", invoiceId: "inv-2241", familyId: "f-patel", method: "zelle", amount: 540, at: "Nov 6, 9:00 AM", reference: "Zelle 2954", recordedBy: "Jordan Lee" },
  { id: "pay-8", invoiceId: "inv-2237", familyId: "f-johnson", method: "zelle", amount: 177.5, at: "Nov 6, 5:41 PM", reference: "Zelle 3121", recordedBy: "Clara" },
];

export const invoiceTotal = (i: Invoice) => i.lines.reduce((s, l) => s + l.amount, 0);
export const invoiceDue = (i: Invoice) => Math.max(0, invoiceTotal(i) - i.paid);

export const methodLabel: Record<Payment["method"], string> = { card: "Card", zelle: "Zelle", cash_app: "Cash App", cash: "Cash" };
