import type { ApplicationStatus, ChildStatus, Incident, InvoiceStatus } from "@rhk/fixtures";
import { Badge, type Tone } from "@rhk/ui/components/badge";

export const applicationStatus: Record<ApplicationStatus, { label: string; tone: Tone; step: number }> = {
  submitted: { label: "New", tone: "info", step: 0 },
  route_confirmed: { label: "Fee requested", tone: "warn", step: 2 },
  fee_paid: { label: "Fee paid", tone: "lilac", step: 3 },
  approved: { label: "Approved", tone: "good", step: 4 },
  declined: { label: "Declined", tone: "neutral", step: -1 },
};

export const invoiceStatus: Record<InvoiceStatus, { label: string; tone: Tone }> = {
  open: { label: "Due", tone: "warn" },
  paid: { label: "Paid", tone: "good" },
  overdue: { label: "Overdue", tone: "bad" },
  partial: { label: "Part paid", tone: "info" },
  void: { label: "Void", tone: "neutral" },
};

export const childStatus: Record<ChildStatus, { label: string; tone: Tone }> = {
  applied: { label: "Applied", tone: "info" },
  pending_fee: { label: "Fee pending", tone: "warn" },
  active: { label: "Active", tone: "good" },
  paused: { label: "Paused", tone: "neutral" },
  ended: { label: "Ended", tone: "neutral" },
};

export const incidentStatus: Record<Incident["status"], { label: string; tone: Tone }> = {
  open: { label: "Open", tone: "bad" },
  following_up: { label: "Following up", tone: "warn" },
  closed: { label: "Closed", tone: "neutral" },
};

export function StatusBadge({ map, value }: { map: Record<string, { label: string; tone: Tone }>; value: string }) {
  const s = map[value];
  return (
    <Badge tone={s.tone} dot>
      {s.label}
    </Badge>
  );
}
