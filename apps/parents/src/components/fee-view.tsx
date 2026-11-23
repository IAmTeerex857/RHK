"use client";

/*
 * The $25 application fee page. Public: the family has no account yet. The office sends the link
 * once a route has room (docs/PLAN.md §1). Zelle and Cash App only for now.
 */

import { useState } from "react";
import { CalendarDays, Check, Clock3, MapPin, School, Send, TimerOff } from "lucide-react";
import { FEES, OFFICE, applications, getRoute, getSchool, money, serviceLabel, weekdayShort } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { Button } from "@rhk/ui/components/button";
import { Card } from "@rhk/ui/components/card";
import { OFFICE_PHONE } from "@rhk/ui/lib/apps";
import { AuthFrame } from "@rhk/ui/shell/auth";
import { PayRow } from "./bills-view";

const help = (
  <>
    Questions? Call the office at{" "}
    <a href={OFFICE_PHONE.href} className="font-medium text-ink-soft underline-offset-4 hover:underline">
      {OFFICE_PHONE.label}
    </a>
    .
  </>
);

export function FeeView({ reference }: { reference: string }) {
  const app = applications.find((a) => a.ref === reference);
  const [sent, setSent] = useState(false);

  if (!app || !app.feeRequestedOn || app.status === "declined") {
    return (
      <AuthFrame app="Parents" width={460} footer={help}>
        <span className="mb-5 grid size-12 place-items-center rounded-2xl border border-line bg-card shadow-subtle">
          <TimerOff className="size-5" />
        </span>
        <h1 className="font-display text-[28px] font-medium tracking-[-0.035em]">This payment link isn&apos;t active</h1>
        <p className="mt-2 text-[15px] text-ink-muted">It may be old, or the office hasn&apos;t confirmed a route yet. Call the office and they&apos;ll sort it out.</p>
        <Button href={OFFICE_PHONE.href} variant="ink" className="mt-8 w-full">
          Call {OFFICE_PHONE.label}
        </Button>
      </AuthFrame>
    );
  }

  const first = app.parent.name.split(" ")[0];
  const kids = app.children.map((c) => c.name.split(" ")[0]);
  const total = FEES.application * app.children.length;
  const routeName = app.routeSuggestion ? getRoute(app.routeSuggestion).name.split(" · ")[0] : "Your route";
  const paid = app.status === "fee_paid" || app.status === "approved";
  const waiting = !paid && sent;

  return (
    <AuthFrame app="Parents" width={520} footer={help}>
      <p className="font-mono text-[13px] text-ink-muted">Application {app.ref}</p>
      <h1 className="mt-1 font-display text-[30px] font-medium leading-[1.1] tracking-[-0.04em]">
        {app.status === "approved" ? `You're all set, ${first}` : paid ? `Payment received, ${first}` : `There's a seat for ${kids.join(" and ")}`}
      </h1>
      <p className="mt-2 text-[15px] text-ink-muted">
        {app.status === "approved"
          ? "Your application is approved. Check your email for the link to set your password for the parent app."
          : paid
            ? "The office has your fee. They'll approve the application and email you a link to set up your account."
            : `The office confirmed a route. Pay the $${FEES.application} application fee for each child to hold the seat${app.children.length > 1 ? "s" : ""}.`}
      </p>

      <Card className="mt-6">
        <ul className="flex flex-col gap-3">
          {app.children.map((c) => (
            <li key={c.name} className="flex items-center gap-3">
              <Avatar seed={c.name} name={c.name} size={36} />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium">{c.name}</span>
                <span className="block truncate text-[13px] text-ink-muted">
                  {c.grade} grade · {getSchool(c.schoolId).name}
                </span>
              </span>
              <span className="font-mono text-[14px] tabular">{money(FEES.application)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 grid grid-cols-1 gap-2.5 border-t border-line pt-4 text-[14px] sm:grid-cols-2">
          <Meta icon={<MapPin />} label="Route" value={routeName} />
          <Meta icon={<Clock3 />} label="Service" value={serviceLabel[app.service]} />
          <Meta icon={<CalendarDays />} label="Days" value={app.days.map((d) => weekdayShort[d]).join(", ")} />
          <Meta icon={<School />} label="Starts" value={app.startDate} />
        </dl>
        <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
          <span className="text-[14px] text-ink-muted">{paid ? "Paid" : "Total"}</span>
          <span className="font-display text-[28px] font-medium tracking-[-0.04em] tabular">{money(total)}</span>
        </div>
        {paid ? (
          <p className="mt-3 flex items-center gap-2 text-[14px] text-good">
            <Check className="size-4 stroke-[2.5]" /> Received {app.feePaidOn}
          </p>
        ) : (
          <p className="mt-2 text-[13px] text-ink-muted">Non-refundable once paid.</p>
        )}
      </Card>

      {!paid ? (
        <Card className="mt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[15px] font-medium">How to pay</p>
              <p className="mt-0.5 text-[14px] text-ink-muted">
                Put <span className="font-mono text-ink">{app.ref}</span> in the memo so the office can match it.
              </p>
            </div>
            {waiting ? (
              <Badge tone="info" dot>
                Office confirming
              </Badge>
            ) : null}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <PayRow icon={<span className="font-display text-[15px] font-medium">Z</span>} title="Zelle" value={OFFICE.zelle} />
            <PayRow icon={<span className="font-display text-[15px] font-medium">$</span>} title="Cash App" value={OFFICE.cashApp} />
          </div>
          {waiting ? (
            <p className="mt-4 rounded-xl bg-raised p-3 text-[13px] text-ink-soft">
              Thanks. Once the office sees your {money(total)}, they approve the application and email you a link to set your password for the parent app.
            </p>
          ) : (
            <Button variant="ink" className="mt-4 w-full" icon={<Send className="size-4" />} onClick={() => setSent(true)}>
              I&apos;ve sent {money(total)}
            </Button>
          )}
        </Card>
      ) : app.status === "approved" ? (
        <Button href="/sign-in" variant="ink" className="mt-4 w-full" arrow>
          Go to sign in
        </Button>
      ) : null}
    </AuthFrame>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-ink-muted [&_svg]:size-4">{icon}</span>
      <dt className="text-ink-muted">{label}</dt>
      <dd className="ml-auto font-medium sm:ml-0">{value}</dd>
    </div>
  );
}
