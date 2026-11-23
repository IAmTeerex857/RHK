"use client";

import { useState } from "react";
import { Crown, KeyRound, Plus, ShieldCheck, UserCog } from "lucide-react";
import { OFFICE, staff } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Row } from "@rhk/ui/components/card";
import { Switch } from "@rhk/ui/components/controls";
import { Dialog } from "@rhk/ui/components/dialog";
import { Field } from "@rhk/ui/components/field";
import { Tabs } from "@rhk/ui/components/segmented";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { cn } from "@rhk/ui/lib/cn";

const roles = [
  { value: "owner", label: "Owner", icon: Crown, desc: "Everything, including money, prices and staff." },
  { value: "staff", label: "Staff", icon: UserCog, desc: "Families, routes, rides, messages and incidents. No payments or prices." },
] as const;

export function SettingsView() {
  const [tab, setTab] = useState<"team" | "business" | "notifications" | "security">("team");
  const [invite, setInvite] = useState(false);
  const [role, setRole] = useState<"owner" | "staff">("staff");
  const [notes, setNotes] = useState({ late: true, incident: true, apps: true, payments: false, digest: true });

  return (
    <>
      <PageHeader title="Settings" description="Your team, business details, notifications and sign-in." />
      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        options={[
          { value: "team", label: "Team", count: staff.length },
          { value: "business", label: "Business" },
          { value: "notifications", label: "Notifications" },
          { value: "security", label: "Security" },
        ]}
      />
      {tab === "team" ? (
        <Card flush>
          <div className="flex items-center justify-between p-5">
            <CardHeader title="Office team" subtitle="Owners can do everything. Staff can't see money or prices." />
            <Button variant="ink" size="sm" icon={<Plus className="size-4" />} onClick={() => setInvite(true)}>
              Invite
            </Button>
          </div>
          <ul className="border-t border-line">
            {staff.map((s) => (
              <li key={s.id} className="flex items-center gap-3 border-b border-line px-5 py-4 last:border-0">
                <Avatar seed={s.id} name={s.name} size={36} status={s.lastActive === "Now" ? "online" : undefined} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium">{s.name}</p>
                  <p className="truncate text-[13px] text-ink-muted">{s.email}</p>
                </div>
                <span className="hidden text-[13px] text-ink-muted sm:block">Active {s.lastActive.toLowerCase()}</span>
                <Badge tone={s.role === "owner" ? "brand" : "neutral"}>{s.role === "owner" ? "Owner" : "Staff"}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      ) : tab === "business" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="On receipts and bills" />
            <div className="mt-4 flex flex-col gap-3">
              <Field label="Business name" defaultValue={OFFICE.name} />
              <Field label="Address" defaultValue={OFFICE.address} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Office email" defaultValue={OFFICE.email} />
                <Field label="Office phone" defaultValue={OFFICE.phone} />
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title="How families pay" subtitle="Shown on every bill and reminder" />
            <div className="mt-4 flex flex-col gap-3">
              <Field label="Zelle" defaultValue={OFFICE.zelle} />
              <Field label="Cash App" defaultValue={OFFICE.cashApp} />
              <Row label="Card and auto-pay" value={<Badge>Needs Stripe</Badge>} />
            </div>
          </Card>
        </div>
      ) : tab === "notifications" ? (
        <Card className="max-w-2xl">
          <CardHeader title="Tell me when" subtitle="Push to this device and email. Safety alerts can't be turned off." />
          <div className="mt-5 flex flex-col gap-5">
            <Switch checked onChange={() => {}} disabled label="Emergencies and incidents" description="Always on" />
            <Switch checked={notes.late} onChange={(v) => setNotes((n) => ({ ...n, late: v }))} label="A route runs more than 5 minutes late" />
            <Switch checked={notes.apps} onChange={(v) => setNotes((n) => ({ ...n, apps: v }))} label="A new application arrives" />
            <Switch checked={notes.payments} onChange={(v) => setNotes((n) => ({ ...n, payments: v }))} label="A payment comes in" />
            <Switch checked={notes.digest} onChange={(v) => setNotes((n) => ({ ...n, digest: v }))} label="Daily summary at 6 PM" description="Rides, absences, money and anything still open" />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Sign-in" icon={<ShieldCheck className="size-4" />} />
            <div className="mt-3">
              <Row label="Method" value="Password + emailed code, every time" />
              <Row label="Office sessions" value="12 hours" />
              <Row label="Parent and driver sessions" value="30 days" />
              <Row label="Codes expire after" value="10 minutes" />
            </div>
          </Card>
          <Card>
            <CardHeader title="Your password" icon={<KeyRound className="size-4" />} />
            <div className="mt-4 flex flex-col gap-3">
              <Field label="Current password" type="password" />
              <Field label="New password" type="password" />
              <Button variant="ink" size="sm" className="self-start">
                Change password
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Dialog
        open={invite}
        onClose={() => setInvite(false)}
        icon={<Plus className="size-5" />}
        title="Invite to the office"
        description="They'll get an email to set a password."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setInvite(false)}>
              Cancel
            </Button>
            <Button variant="ink" size="sm" onClick={() => setInvite(false)}>
              Send invite
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Email address" type="email" />
          <div>
            <p className="mb-2 text-[13px] font-medium text-ink-soft">Role</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  aria-pressed={role === r.value}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                    role === r.value ? "border-ink bg-card shadow-[0_0_0_1px_var(--color-ink)]" : "border-line bg-raised/50 hover:border-line-strong",
                  )}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-card">
                    <r.icon className="size-4" />
                  </span>
                  <span>
                    <span className="block text-[14px] font-medium">{r.label}</span>
                    <span className="mt-0.5 block text-[13px] text-ink-muted">{r.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
