"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  CalendarDays,
  CircleUserRound,
  ChevronRight,
  Clock3,
  GraduationCap,
  House,
  MessageSquare,
  Phone,
  RotateCcw,
  Route as RouteIcon,
  ShieldAlert,
  Siren,
  Timer,
  TriangleAlert,
} from "lucide-react";
import { conversations, driverNotices, OFFICE } from "@rhk/fixtures";
import { Button } from "@rhk/ui/components/button";
import { ChoiceChips } from "@rhk/ui/components/controls";
import { Dialog } from "@rhk/ui/components/dialog";
import { AppShell, type NavGroup, type NavItem } from "@rhk/ui/shell/app-shell";
import { cn } from "@rhk/ui/lib/cn";
import { me, route, RunProvider, useRun, van } from "./run-store";

const unread = conversations.find((c) => c.with.id === me.id)?.unread ?? 0;

const today: NavItem = { href: "/", label: "Today", icon: House, key: "t", exact: true };
const routeTab: NavItem = { href: "/route", label: "Route", icon: RouteIcon, key: "r" };
const schedule: NavItem = { href: "/schedule", label: "Schedule", icon: CalendarDays, key: "s" };
const messages: NavItem = { href: "/messages", label: "Messages", icon: MessageSquare, key: "m", count: unread || undefined };

const nav: NavGroup[] = [
  { items: [today, routeTab, messages] },
  {
    label: "My work",
    items: [
      schedule,
      { href: "/hours", label: "Hours", icon: Clock3, key: "h" },
      { href: "/training", label: "Training", icon: GraduationCap, key: "c" },
      { href: "/report", label: "Report an incident", icon: ShieldAlert, key: "i" },
    ],
  },
  { label: "You", items: [{ href: "/account", label: "Account", icon: CircleUserRound, key: "a" }] },
];

export function DriverFrame({ children }: { children: ReactNode }) {
  return (
    <RunProvider>
      <Shell>{children}</Shell>
    </RunProvider>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const run = useRun();
  const router = useRouter();
  const [sos, setSos] = useState(false);
  const [late, setLate] = useState(false);

  return (
    <>
      <AppShell
        app="Driver"
      accountHref="/account"
        narrow
        nav={nav}
        user={{ name: me.name, role: `Driver · ${van.name}`, seed: me.id, email: me.email }}
        notices={driverNotices}
        tabs={[today, routeTab, schedule, messages]}
        fab={{ onClick: () => setSos(true), label: "Help and emergencies", icon: Siren, tone: "bad" }}
        sidebarFooter={
          <button
            type="button"
            onClick={() => setSos(true)}
            className="flex h-10 w-full items-center gap-2.5 rounded-xl border border-[color-mix(in_oklab,var(--color-bad)_30%,transparent)] bg-coral-soft px-3 text-[14px] font-medium text-bad transition-colors hover:bg-[color-mix(in_oklab,var(--color-bad)_14%,transparent)]"
          >
            <Siren className="size-4" />
            Help and emergencies
          </button>
        }
        commands={[
          { label: "I'm running late", icon: Timer, run: () => setLate(true) },
          { label: "Report an incident", href: "/report", icon: ShieldAlert },
          { label: "Call the office", href: `tel:${OFFICE.phone}`, icon: Phone },
          { label: "Replay this afternoon from clock-in", group: "Preview", icon: RotateCcw, run: () => (run.dispatch({ type: "replay" }), router.push("/start")) },
          { label: "Jump back to 3:24 PM (Johnson stop)", group: "Preview", icon: RotateCcw, run: () => (run.dispatch({ type: "resume" }), router.push("/route")) },
        ]}
      >
        {children}
      </AppShell>

      <Dialog
        open={sos}
        onClose={() => setSos(false)}
        size="sm"
        icon={<Siren className="size-5 text-bad" />}
        title="Help and emergencies"
        description="If anyone is hurt or in danger, call 911 first. Then tell the office."
      >
        <div className="flex flex-col gap-2">
          <SosRow href="tel:911" tone="bad" icon={<Phone className="size-5" />} title="Call 911" sub="Crash, injury, a child who can't breathe" />
          <SosRow href={`tel:${OFFICE.phone}`} icon={<Phone className="size-5" />} title="Call the office" sub={OFFICE.phone} />
          <SosRow href="/report" onClick={() => setSos(false)} icon={<TriangleAlert className="size-5" />} title="Report an incident" sub="Four taps. The office sees it straight away." />
          <SosRow
            onClick={() => {
              setSos(false);
              setLate(true);
            }}
            icon={<Timer className="size-5" />}
            title="I'm running late"
            sub="Parents on the route see new arrival times"
          />
        </div>
      </Dialog>

      <LateDialog open={late} onClose={() => setLate(false)} />
    </>
  );
}

function SosRow({ href, onClick, icon, title, sub, tone }: { href?: string; onClick?: () => void; icon: ReactNode; title: string; sub: string; tone?: "bad" }) {
  const body = (
    <>
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", tone === "bad" ? "bg-coral text-white" : "bg-raised text-ink")}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-[16px] font-medium", tone === "bad" && "text-bad")}>{title}</span>
        <span className="block text-[13px] text-ink-muted">{sub}</span>
      </span>
      <ChevronRight className="size-4 text-ink-muted" />
    </>
  );
  const cls = "flex w-full items-center gap-3.5 rounded-2xl border border-line bg-card p-3 text-left transition-colors hover:bg-raised/60 active:scale-[0.99]";
  if (href?.startsWith("/"))
    return (
      <Link href={href} onClick={onClick} className={cls}>
        {body}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={cls}>
        {body}
      </a>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {body}
    </button>
  );
}

const reasons = ["Traffic", "School let out late", "Waiting at a stop", "Van problem", "Weather", "Something else"];

export function LateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const run = useRun();
  const [minutes, setMinutes] = useState<number | null>(10);
  const [reason, setReason] = useState<string | null>("Traffic");
  const remaining = route.stops.length - run.stopIndex;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      icon={<Timer className="size-5" />}
      title="Running late"
      description={`The office sees it now. Parents at the ${remaining} stops still to come see new arrival times in their app.`}
      footer={
        <>
          <Button variant="soft" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="ink"
            size="sm"
            disabled={!minutes || !reason}
            onClick={() => {
              if (minutes && reason) run.dispatch({ type: "late", minutes, reason });
              onClose();
            }}
          >
            Tell the office
          </Button>
        </>
      }
    >
      <p className="mb-2.5 text-[13px] font-medium text-ink-soft">About how late?</p>
      <ChoiceChips
        aria-label="Minutes late"
        size="lg"
        value={minutes}
        onChange={setMinutes}
        options={[5, 10, 15, 20, 30].map((m) => ({ value: m, label: m === 30 ? "30+ min" : `${m} min` }))}
      />
      <p className="mb-2.5 mt-6 text-[13px] font-medium text-ink-soft">Why?</p>
      <ChoiceChips aria-label="Reason" value={reason} onChange={setReason} options={reasons.map((r) => ({ value: r, label: r }))} />
    </Dialog>
  );
}
