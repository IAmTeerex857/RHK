"use client";

import { useState } from "react";
import { Check, Copy, Mail, MapPin, Phone, Send, ShieldCheck, UserPlus, X } from "lucide-react";
import { FEES, OFFICE, applications, getDriver, getRoute, getSchool, getVan, routes, serviceLabel, weekdayShort, type ApplicationStatus } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { Steps, type Step } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Panel, PanelCard, Row } from "@rhk/ui/components/card";
import { SegmentBar } from "@rhk/ui/components/charts";
import { Dialog, RadioCard } from "@rhk/ui/components/dialog";
import { TextArea } from "@rhk/ui/components/field";
import { Crumb, PageHeader } from "@rhk/ui/shell/app-shell";
import { applicationStatus, StatusBadge } from "../status";

const seatsUsed: Record<string, number> = { "r-pm-2": 11, "r-pm-1": 12, "r-pm-3": 7, "r-pm-4": 6 };

export function ApplicationDetail({ id }: { id: string }) {
  const app = applications.find((a) => a.id === id)!;
  const [status, setStatus] = useState<ApplicationStatus>(app.status);
  const [routeId, setRouteId] = useState(app.routeSuggestion ?? "r-pm-2");
  const [dialog, setDialog] = useState<null | "route" | "fee" | "paid" | "approve" | "decline">(null);
  const [method, setMethod] = useState("zelle");
  const [reason, setReason] = useState("");
  const [copied, setCopied] = useState(false);
  const [feeSent, setFeeSent] = useState(Boolean(app.feeRequestedOn));

  const route = getRoute(routeId);
  const van = getVan(route.vanId);
  const used = seatsUsed[routeId] ?? 8;
  const s = applicationStatus[status].step;

  const steps: Step[] =
    status === "declined"
      ? [
          { title: "Application received", meta: app.submitted, state: "done" },
          { title: "Declined", detail: app.declineReason ?? reason, state: "alert" },
        ]
      : [
          { title: "Application received", detail: "From the website form, signed by the parent", meta: app.submitted.replace("Today, ", ""), state: "done" },
          { title: "Call and confirm a route", detail: status !== "submitted" ? `${route.name} · ${van.name}` : "Check there's a seat on the route", state: status !== "submitted" ? "done" : "current" },
          { title: `Send the $${FEES.application} fee link`, detail: feeSent ? `Sent ${app.feeRequestedOn ?? "today"} by email` : "Non-refundable once paid", meta: app.feeRequestedOn, state: feeSent ? "done" : status === "route_confirmed" ? "current" : "todo" },
          { title: "Fee paid", detail: s >= 3 ? `Paid ${app.feePaidOn ?? "today"}` : "Card once Stripe is live; Zelle or Cash App until then", meta: app.feePaidOn, state: s >= 3 ? "done" : feeSent ? "current" : "todo" },
          { title: "Approve and create the account", detail: s >= 4 ? "Invite sent to set a password" : "Adds the children to the route", state: s >= 4 ? "done" : s === 3 ? "current" : "todo" },
        ];

  const primary =
    status === "submitted"
      ? { label: "Confirm route", icon: <Check className="size-4" />, open: "route" as const }
      : status === "route_confirmed" && !feeSent
        ? { label: "Send fee link", icon: <Send className="size-4" />, open: "fee" as const }
        : status === "route_confirmed"
          ? { label: "Record fee payment", icon: <Check className="size-4" />, open: "paid" as const }
          : status === "fee_paid"
            ? { label: "Approve family", icon: <UserPlus className="size-4" />, open: "approve" as const }
            : null;

  return (
    <>
      <Crumb>{app.ref}</Crumb>
      <PageHeader
        eyebrow={
          <span className="flex items-center gap-2">
            <span className="font-mono text-[12.5px] text-ink-muted">{app.ref}</span>
            <StatusBadge map={applicationStatus} value={status} />
          </span>
        }
        title={app.parent.name}
        description={`${app.children.length === 1 ? "1 child" : `${app.children.length} children`} · ${serviceLabel[app.service]} · wants to start ${app.startDate}`}
        actions={
          status !== "approved" && status !== "declined" ? (
            <>
              <Button variant="danger" size="sm" icon={<X className="size-4" />} onClick={() => setDialog("decline")}>
                Decline
              </Button>
              {primary ? (
                <Button variant="ink" size="sm" icon={primary.icon} onClick={() => setDialog(primary.open)}>
                  {primary.label}
                </Button>
              ) : null}
            </>
          ) : null
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-8">
          <Card>
            <CardHeader title="Parent" subtitle="Who we'll call and email" />
            <div className="mt-4 flex flex-wrap items-start gap-4 sm:items-center">
              <Avatar seed={app.parent.id} name={app.parent.name} size={48} />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium">{app.parent.name}</p>
                <p className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] text-ink-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="size-3.5" /> {app.parent.phone}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3.5" /> {app.parent.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> {app.address}, {app.city}
                  </span>
                </p>
              </div>
              <Button variant="outline" size="xs" href={`tel:${app.parent.phone}`} icon={<Phone />} className="max-sm:w-full">
                Call
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Children" subtitle="As entered on the form" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {app.children.map((c) => (
                <div key={c.name} className="rounded-xl border border-line p-4">
                  <div className="flex items-center gap-3">
                    <Avatar seed={c.name} name={c.name} size={38} />
                    <div>
                      <p className="text-[14.5px] font-medium">{c.name}</p>
                      <p className="text-[13px] text-ink-muted">
                        Age {c.age} · {c.grade} grade
                      </p>
                    </div>
                  </div>
                  <Row className="mt-2" label="School" value={getSchool(c.schoolId).name} />
                  <Row label="Bell" value={`${getSchool(c.schoolId).bellAm} · ${getSchool(c.schoolId).bellPm}`} />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Service requested" />
            <div className="mt-2 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              <div>
                <Row label="Service" value={serviceLabel[app.service]} />
                <Row label="Start date" value={app.startDate} />
                <Row label="Plan" value="Weekly (decided at approval)" />
              </div>
              <div>
                <Row
                  label="Days"
                  value={
                    <span className="flex justify-end gap-1">
                      {(["mon", "tue", "wed", "thu", "fri"] as const).map((d) => (
                        <span key={d} className={`grid h-6 w-9 place-items-center rounded-md text-[12px] ${app.days.includes(d) ? "bg-ink text-cream" : "bg-raised text-ink-muted"}`}>
                          {weekdayShort[d]}
                        </span>
                      ))}
                    </span>
                  }
                />
                <Row label="Signed" value={<span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4 text-good" /> Typed name + signature</span>} />
                <Row label="Medical notes" value="None given" />
              </div>
            </div>
            {app.notes ? <p className="mt-4 rounded-xl bg-raised px-4 py-3 text-[14px] text-ink-soft">“{app.notes}”</p> : null}
          </Card>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4">
          <Panel
            title="Progress"
            meta={`Step ${Math.max(1, Math.min(5, s + 2))} of 5`}
            footer={status === "approved" ? "Account created" : status === "declined" ? "Closed" : "Waiting on the office"}
            footerAction={
              primary ? (
                <Button variant="ink" size="xs" onClick={() => setDialog(primary.open)}>
                  {primary.label}
                </Button>
              ) : undefined
            }
          >
            <PanelCard>
              <Steps steps={steps} />
            </PanelCard>
          </Panel>

          <Card>
            <CardHeader title="Suggested route" subtitle="Closest school match with seats" />
            <div className="mt-4 flex items-center gap-3">
              <Avatar seed={route.driverId} name={getDriver(route.driverId).name} size={36} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium">{route.name}</p>
                <p className="text-[12.5px] text-ink-muted">
                  {van.name} · {getDriver(route.driverId).name}
                </p>
              </div>
              <Badge tone={van.capacity - used >= app.children.length ? "good" : "bad"}>{van.capacity - used} seats left</Badge>
            </div>
            <SegmentBar className="mt-4" value={used} total={van.capacity} tone="ink" size="sm" label="Seats used" />
            <p className="mt-2 font-mono text-[11.5px] text-ink-muted">
              {used} / {van.capacity} SEATS · {route.start} – {route.end}
            </p>
          </Card>
        </div>
      </div>

      {/* dialogs */}
      <Dialog
        open={dialog === "route"}
        onClose={() => setDialog(null)}
        icon={<Check className="size-5" />}
        title="Confirm a route"
        description={`You've called ${app.parent.name.split(" ")[0]} and there's room. Pick the afternoon route.`}
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="ink"
              size="sm"
              onClick={() => {
                setStatus("route_confirmed");
                setDialog("fee");
              }}
            >
              Confirm route
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-1">
          {routes
            .filter((r) => r.slot === "pm")
            .map((r) => {
              const v = getVan(r.vanId);
              const u = seatsUsed[r.id] ?? 8;
              return (
                <RadioCard
                  key={r.id}
                  name="route"
                  checked={routeId === r.id}
                  onChange={() => setRouteId(r.id)}
                  title={`${r.name} · ${v.name}`}
                  description={`${r.schoolIds.map((x) => getSchool(x).short).join(", ")} · ${v.capacity - u} of ${v.capacity} seats free · ${getDriver(r.driverId).name}`}
                />
              );
            })}
        </div>
      </Dialog>

      <Dialog
        open={dialog === "fee"}
        onClose={() => setDialog(null)}
        icon={<Send className="size-5" />}
        title={`Send the $${FEES.application} fee link`}
        description={`Emailed to ${app.parent.email}. The spot is held once it's paid.`}
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setDialog(null)}>
              Not now
            </Button>
            <Button
              variant="ink"
              size="sm"
              icon={<Send className="size-4" />}
              onClick={() => {
                setFeeSent(true);
                setDialog(null);
              }}
            >
              Send email
            </Button>
          </>
        }
      >
        <div className="rounded-2xl border border-line bg-raised p-5 text-[14px] leading-relaxed text-ink-soft">
          <p className="font-medium text-ink">Your route is confirmed 🎉</p>
          <p className="mt-2">
            Hi {app.parent.name.split(" ")[0]}, there&apos;s a seat for {app.children.map((c) => c.name.split(" ")[0]).join(" and ")} on {route.name}. To hold it, pay the ${FEES.application} application fee per child. It&apos;s non-refundable once paid.
          </p>
          <p className="mt-3">
            Pay by Zelle to <span className="font-medium text-ink">{OFFICE.zelle}</span> or Cash App <span className="font-medium text-ink">{OFFICE.cashApp}</span> with the reference <span className="font-mono text-ink">{app.ref}</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(`https://app.rushhourkidstransportation.com/pay/${app.ref}`);
            setCopied(true);
          }}
          className="mt-3 inline-flex items-center gap-2 text-[13px] text-ink-muted hover:text-ink"
        >
          {copied ? <Check className="size-4 text-good" /> : <Copy className="size-4" />} {copied ? "Link copied" : "Copy payment link"}
        </button>
      </Dialog>

      <Dialog
        open={dialog === "paid"}
        onClose={() => setDialog(null)}
        icon={<Check className="size-5" />}
        title="Record the fee payment"
        description={`$${FEES.application * app.children.length}.00 · ${app.ref}`}
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="ink"
              size="sm"
              onClick={() => {
                setStatus("fee_paid");
                setDialog(null);
              }}
            >
              Record payment
            </Button>
          </>
        }
      >
        {[
          ["zelle", "Zelle", "Check the Zelle app for the reference"],
          ["cash_app", "Cash App", OFFICE.cashApp],
          ["cash", "Cash", "Paid at the office"],
        ].map(([v, t, d]) => (
          <RadioCard key={v} name="method" checked={method === v} onChange={() => setMethod(v)} title={t} description={d} />
        ))}
      </Dialog>

      <Dialog
        open={dialog === "approve"}
        onClose={() => setDialog(null)}
        icon={<UserPlus className="size-5" />}
        title={`Approve the ${app.parent.name.split(" ").slice(-1)[0]} family`}
        description="This creates their account and adds the children to the route."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="ink"
              size="sm"
              onClick={() => {
                setStatus("approved");
                setDialog(null);
              }}
            >
              Approve and send invite
            </Button>
          </>
        }
      >
        <ul className="flex flex-col gap-3 text-[14px]">
          {[
            `Account for ${app.parent.email}, with an email to set a password`,
            `${app.children.map((c) => c.name.split(" ")[0]).join(" and ")} added to ${route.name} from ${app.startDate}`,
            "First weekly bill created for the week they start",
            "Parent setup asks for photos, approved adults and home-screen install",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint-soft text-good">
                <Check className="size-3 stroke-[3]" />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </Dialog>

      <Dialog
        open={dialog === "decline"}
        onClose={() => setDialog(null)}
        icon={<X className="size-5" />}
        title="Decline application"
        description="The parent gets this reason by email. Be kind and specific."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={reason.trim().length < 10}
              onClick={() => {
                setStatus("declined");
                setDialog(null);
              }}
            >
              Decline and email
            </Button>
          </>
        }
      >
        <TextArea label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} hint="e.g. Our routes are full for Pine Ridge. We've added you to the waitlist." />
      </Dialog>
    </>
  );
}
