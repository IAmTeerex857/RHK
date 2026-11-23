"use client";

import type { ReactNode } from "react";
import { Bus, CalendarDays, CalendarX2, History, House, MessageSquare, Receipt, Settings, Ticket, UserPlus, Users } from "lucide-react";
import { conversations, parentNotices } from "@rhk/fixtures";
import { AppShell, type NavGroup, type NavItem } from "@rhk/ui/shell/app-shell";
import { family, openBill, parent, progress } from "./family";

/* The family sent the last message, so nothing from the office is waiting for them. */
const lastFromOffice = conversations.find((c) => c.with.id === family.id)?.messages.at(-1)?.from === "office";

const home: NavItem = { href: "/", label: "Home", icon: House, key: "h", exact: true };
const live: NavItem = { href: "/live", label: "Live ride", icon: Bus, key: "l" };
const schedule: NavItem = { href: "/schedule", label: "Schedule", icon: CalendarDays, key: "s" };
const bills: NavItem = { href: "/bills", label: "Bills", icon: Receipt, key: "b", count: openBill ? 1 : undefined, alert: true };
const messages: NavItem = { href: "/messages", label: "Messages", icon: MessageSquare, key: "m", count: lastFromOffice ? 1 : undefined };

const nav: NavGroup[] = [
  { items: [home, live, messages] },
  {
    label: "Family",
    items: [
      { href: "/children", label: "Children", icon: Users, key: "c" },
      schedule,
      bills,
      { href: "/trips", label: "Trips & programs", icon: Ticket, key: "p" },
      { href: "/history", label: "Ride history", icon: History, key: "r" },
    ],
  },
  { label: "Account", items: [{ href: "/account", label: "Account", icon: Settings, key: "," }] },
];

export function ParentFrame({ children }: { children: ReactNode }) {
  return (
    <AppShell
      app="Parents"
      accountHref="/account"
      narrow
      nav={nav}
      user={{ name: parent.name, role: `${family.name} family`, seed: parent.id, email: parent.email }}
      notices={parentNotices}
      tabs={[home, schedule, bills, messages]}
      fab={{ href: "/live", label: "Live ride", icon: Bus, tone: "brand", ring: progress }}
      commands={[
        { label: "Report an absence", href: "/schedule", icon: CalendarX2 },
        { label: "Add an approved adult", href: "/children/c-maya", icon: UserPlus },
        { label: "Pay this week's bill", href: "/bills", icon: Receipt },
        { label: "Set up the app again", href: "/welcome", icon: Settings, group: "Preview" },
      ]}
    >
      {children}
    </AppShell>
  );
}
