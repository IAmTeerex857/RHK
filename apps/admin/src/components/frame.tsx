"use client";

import {
  Banknote,
  Bus,
  CalendarClock,
  ChartColumn,
  FileText,
  History,
  LayoutGrid,
  Map,
  MessageSquare,
  Route as RouteIcon,
  Settings,
  ShieldAlert,
  Ticket,
  Truck,
  Users,
  UserRound,
  Megaphone,
  Receipt,
  Download,
  UserPlus,
} from "lucide-react";
import type { ReactNode } from "react";
import { adminNotices, applications, changeRequests, conversations, incidents, ME, routes, runFor } from "@rhk/fixtures";
import { AppShell, type NavGroup, type NavItem } from "@rhk/ui/shell/app-shell";
import { routeColor } from "@rhk/ui/lib/route-color";

const waiting = applications.filter((a) => a.status === "submitted" || a.status === "fee_paid").length;
const pendingChanges = changeRequests.filter((c) => c.status === "pending").length;
const unread = conversations.reduce((s, c) => s + c.unread, 0);
const openIncidents = incidents.filter((i) => i.status !== "closed").length;

/* This afternoon's routes, nested under Routes with their colour and live status. */
const liveRoutes: NavItem[] = routes
  .filter((r) => r.slot === "pm")
  .map((r) => {
    const run = runFor(r.id);
    const late = run?.status === "late";
    return {
      href: `/routes/${r.id}`,
      label: r.name.split(" · ")[0],
      icon: RouteIcon,
      dot: routeColor(r.id),
      meta: !run || run.status === "not_started" ? "soon" : late ? `${run.lateMinutes}m late` : run.lateMinutes ? `+${run.lateMinutes}m` : "on time",
      metaTone: late ? "bad" : "muted",
    } satisfies NavItem;
  })
  .sort((a, b) => a.label.localeCompare(b.label));

const today: NavItem = { href: "/", label: "Today", icon: LayoutGrid, key: "t", exact: true };
const live: NavItem = { href: "/live", label: "Live map", icon: Map, key: "l" };
const messages: NavItem = { href: "/messages", label: "Messages", icon: MessageSquare, key: "m", count: unread, alert: true };
const apps: NavItem = { href: "/applications", label: "Applications", icon: FileText, key: "a", count: waiting };

const nav: NavGroup[] = [
  { items: [today, live, messages] },
  {
    label: "Operations",
    items: [
      apps,
      { href: "/families", label: "Families", icon: Users, key: "f" },
      { href: "/schedules", label: "Schedules", icon: CalendarClock, key: "s", count: pendingChanges },
      { href: "/routes", label: "Routes", icon: RouteIcon, key: "r", children: liveRoutes },
      { href: "/programs", label: "Trips & programs", icon: Ticket, key: "p" },
    ],
  },
  {
    label: "Team & fleet",
    items: [
      { href: "/drivers", label: "Drivers", icon: UserRound, key: "d" },
      { href: "/fleet", label: "Fleet", icon: Truck, key: "v" },
      { href: "/incidents", label: "Incidents", icon: ShieldAlert, key: "i", count: openIncidents, alert: true },
    ],
  },
  {
    label: "Business · owner",
    items: [
      { href: "/billing", label: "Billing", icon: Banknote, key: "b" },
      { href: "/reports", label: "Reports", icon: ChartColumn, key: "o" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { href: "/history", label: "Change history", icon: History, key: "h" },
      { href: "/settings", label: "Settings", icon: Settings, key: "," },
    ],
  },
];

export function AdminFrame({ children }: { children: ReactNode }) {
  return (
    <AppShell
      app="Office"
      nav={nav}
      user={{ name: ME.admin.name, role: "Owner", seed: ME.admin.id, email: ME.admin.email }}
      notices={adminNotices}
      tabs={[today, live, apps, messages]}
      commands={[
        { label: "Record a payment", href: "/billing", icon: Receipt },
        { label: "New announcement", href: "/messages", icon: Megaphone },
        { label: "Add a family", href: "/families", icon: UserPlus },
        { label: "Export driver hours (CSV)", href: "/drivers", icon: Download },
        { label: "Open Van 2 · Route 2", href: "/routes/r-pm-2", icon: Bus },
      ]}
    >
      {children}
    </AppShell>
  );
}
