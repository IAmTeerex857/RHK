"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Check, Clock3, Download, KeyRound, LogOut, MapPin, Share, ShieldCheck, Smartphone, SquarePlus, Ticket, UserCheck, X } from "lucide-react";
import { announcements, conversations, getChild, OFFICE, programs, staff } from "@rhk/fixtures";
import { Avatar, AvatarStack } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { EmptyState } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Row } from "@rhk/ui/components/card";
import { Composer, Thread, type ChatMessage } from "@rhk/ui/components/chat";
import { Switch } from "@rhk/ui/components/controls";
import { Tabs } from "@rhk/ui/components/segmented";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { amHome, family, kids, parent, school, useNow } from "./family";

/* ------------------------------------------------------------------ messages */

const conv = conversations.find((c) => c.with.id === family.id)!;
const seedFor = (author: string) => staff.find((s) => author.startsWith(s.name.split(" ")[0]))?.id ?? author;

export function MessagesView() {
  const now = useNow();
  const [tab, setTab] = useState<"office" | "news">("office");
  const [thread, setThread] = useState<ChatMessage[]>(
    conv.messages.map((m) => ({ id: m.id, mine: m.from === "parent", author: m.author, seed: m.from === "parent" ? parent.id : seedFor(m.author), body: m.body, at: m.at.replace("Today, ", "") })),
  );
  const news = announcements.filter((a) => a.audience === "Everyone" || a.audience === school.name);
  return (
    <>
      <PageHeader title="Messages" description="Message the office about rides, bills or anything else. They reply in the app and by email." />
      <Tabs
        className="mb-4"
        value={tab}
        onChange={setTab}
        options={[
          { value: "office", label: "Office" },
          { value: "news", label: "Announcements", count: news.length },
        ]}
      />
      {tab === "office" ? (
        <Card flush className="flex h-[calc(100dvh-380px)] min-h-[420px] flex-col overflow-hidden lg:h-[calc(100dvh-300px)] lg:min-h-[480px]">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <AvatarStack people={staff.map((s) => ({ seed: s.id, name: s.name }))} size={30} />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium">Rush Hour Kids office</p>
              <p className="truncate text-[13px] text-ink-muted">Weekdays 6 AM – 6 PM · {OFFICE.phone}</p>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto bg-canvas/50 px-4 py-5">
            <Thread messages={thread} />
          </div>
          <div className="border-t border-line p-3">
            <Composer placeholder="Message the office…" onSend={(body) => setThread((t) => [...t, { id: `n-${Date.now()}`, mine: true, author: parent.name, seed: parent.id, body, at: now }])} />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {news.map((a) => (
            <Card key={a.id}>
              <div className="flex items-center justify-between">
                <Badge tone="info">{a.audience}</Badge>
                <span className="text-[13px] text-ink-muted">{a.sentAt}</span>
              </div>
              <h3 className="mt-4 font-display text-[18px] font-medium tracking-[-0.02em]">{a.title}</h3>
              <p className="mt-2 text-[14px] text-ink-soft">{a.body}</p>
              <p className="mt-4 text-[13px] text-ink-muted">From {a.sentBy}</p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ trips */

export function TripsView() {
  const mine = programs.filter((p) => p.childIds.some((id) => kids.some((k) => k.id === id)));
  const other = programs.filter((p) => !mine.includes(p));
  return (
    <>
      <PageHeader title="Trips & programs" description="Field trips, camps and summer rides, set up by the office. Questions? Message the office." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mine.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <div className="flex items-center justify-between">
              <Badge tone={p.kind === "field_trip" ? "lilac" : "info"}>{p.kind === "field_trip" ? "Field trip" : p.kind === "camp" ? "Camp" : "Summer"}</Badge>
              <Badge tone={p.status === "confirmed" ? "good" : "neutral"} dot>
                {p.status === "confirmed" ? "Confirmed" : "Planned"}
              </Badge>
            </div>
            <h3 className="mt-4 font-display text-[20px] font-medium tracking-[-0.03em]">{p.name}</h3>
            <div className="mt-3 flex flex-col gap-1.5 text-[14px] text-ink-soft">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4 text-ink-muted" /> {p.dates}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-ink-muted" /> {p.place}
              </span>
            </div>
            <p className="mt-4 rounded-xl bg-raised p-3 text-[14px] text-ink-soft">{p.notes}</p>
            <div className="mt-auto flex items-center gap-2 pt-5">
              {p.childIds
                .filter((id) => kids.some((k) => k.id === id))
                .map((id) => (
                  <span key={id} className="inline-flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-[13px] font-medium">
                    <Avatar seed={id} name={getChild(id).first} size={24} /> {getChild(id).first} is going
                  </span>
                ))}
            </div>
          </Card>
        ))}
      </div>
      {other.length ? (
        <>
          <p className="mb-3 mt-8 text-[13px] font-medium text-ink-muted">Also from the office</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {other.map((p) => (
              <Card key={p.id}>
                <h3 className="text-[16px] font-medium">{p.name}</h3>
                <p className="mt-1 text-[14px] text-ink-muted">
                  {p.dates} · {p.place}
                </p>
                <p className="mt-3 text-[14px] text-ink-soft">{p.notes}</p>
              </Card>
            ))}
          </div>
        </>
      ) : null}
      {!mine.length ? <EmptyState icon={<Ticket />} title="No trips yet" body="When the office plans one for your children, it shows up here." /> : null}
    </>
  );
}

/* ------------------------------------------------------------------ history */

type Ride = { slot: "Morning" | "Afternoon"; from: string; to: string; start: string; end: string; by?: string; note?: string; absent?: boolean };
const history: { day: string; rides: Ride[] }[] = [
  {
    day: "Today",
    rides: [
      { slot: "Afternoon", from: school.short, to: "Home", start: "2:44 PM", end: "On the way", note: "ETA 3:30 PM" },
      { slot: "Morning", from: "Home", to: school.short, start: amHome.time, end: "7:38 AM" },
    ],
  },
  {
    day: "Thursday, Nov 19",
    rides: [
      { slot: "Afternoon", from: school.short, to: "Home", start: "2:43 PM", end: "3:27 PM", by: "Gloria Johnson · Grandmother" },
      { slot: "Morning", from: "Home", to: school.short, start: "7:05 AM", end: "7:39 AM" },
    ],
  },
  {
    day: "Wednesday, Nov 18",
    rides: [
      { slot: "Afternoon", from: school.short, to: "Home", start: "2:45 PM", end: "3:31 PM", by: "Tanya Johnson · Parent" },
      { slot: "Morning", from: "Home", to: school.short, start: "7:03 AM", end: "7:37 AM" },
    ],
  },
  {
    day: "Wednesday, Nov 4",
    rides: [{ slot: "Afternoon", from: school.short, to: "Home", start: "", end: "", absent: true, note: "Eli absent · reported 2 days ahead · $35 on bill RHK-2237" }],
  },
];

export function HistoryView() {
  return (
    <>
      <PageHeader title="Ride history" description="Every pickup and drop-off, with times and who received them at home." />
      <div className="flex flex-col gap-6">
        {history.map((h) => (
          <section key={h.day}>
            <p className="mb-2.5 text-[13px] font-medium text-ink-muted">{h.day}</p>
            <Card flush>
              <ul>
                {h.rides.map((r, i) => (
                  <li key={i} className="flex items-center gap-3.5 border-b border-line px-5 py-4 last:border-0">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full ${r.absent ? "bg-raised text-ink-muted" : "bg-mint-soft text-good"}`}>
                      {r.absent ? <X className="size-4" /> : r.end === "On the way" ? <Clock3 className="size-4" /> : <Check className="size-4 stroke-[2.5]" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium">
                        {r.slot} · {r.absent ? "Absent" : `${r.from} → ${r.to}`}
                      </span>
                      <span className="block truncate text-[13px] text-ink-muted">
                        {r.note ?? (r.by ? `Received by ${r.by}` : "Checked in at school")}
                      </span>
                    </span>
                    {!r.absent ? (
                      <span className="text-right font-mono text-[13px] tabular">
                        <span className="block">{r.start}</span>
                        <span className="block text-ink-muted">{r.end}</span>
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ account */

export function AccountView() {
  const [n, setN] = useState({ ten: true, near: true, onoff: true, bills: true, news: true });
  return (
    <>
      <PageHeader title="Account" description="Your details, alerts and sign-in." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3.5">
            <Avatar seed={parent.id} name={parent.name} size={52} />
            <div className="min-w-0">
              <p className="text-[16px] font-medium">{parent.name}</p>
              <p className="truncate text-[14px] text-ink-muted">{family.name} family · since {family.joined}</p>
            </div>
          </div>
          <div className="mt-4">
            <Row label="Email" value={parent.email} />
            <Row label="Phone" value={parent.phone} />
            <Row label="Home" value={`${family.address}, ${family.city}`} />
            <Row label="Emergency contact" value={`${family.emergency.name} · ${family.emergency.relationship}`} />
          </div>
          <p className="mt-3 text-[13px] text-ink-muted">To change your address or add a second guardian, message the office. Routes depend on it.</p>
        </Card>

        <Card>
          <CardHeader title="Alerts" subtitle="Sent to this phone once the app is on your home screen" />
          <div className="mt-5 flex flex-col gap-5">
            <Switch checked={n.ten} onChange={(v) => setN((x) => ({ ...x, ten: v }))} label="Van about 10 minutes away" />
            <Switch checked={n.near} onChange={(v) => setN((x) => ({ ...x, near: v }))} label="Van a few minutes away" />
            <Switch checked={n.onoff} onChange={(v) => setN((x) => ({ ...x, onoff: v }))} label="Picked up and dropped off" />
            <Switch checked={n.bills} onChange={(v) => setN((x) => ({ ...x, bills: v }))} label="Bill reminders" description="Wednesday before, and Friday morning" />
            <Switch checked={n.news} onChange={(v) => setN((x) => ({ ...x, news: v }))} label="Announcements from the office" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Add the app to your home screen" icon={<Smartphone className="size-4" />} subtitle="iPhones only send ride alerts to apps on the home screen." />
          <ol className="mt-4 flex flex-col gap-3 text-[14px]">
            <li className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-raised">
                <Share className="size-4" />
              </span>
              Tap Share in Safari
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-raised">
                <SquarePlus className="size-4" />
              </span>
              Choose “Add to Home Screen”
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-raised">
                <Download className="size-4" />
              </span>
              Open Rush Hour Kids from your home screen
            </li>
          </ol>
        </Card>

        <Card>
          <CardHeader title="Sign-in" icon={<ShieldCheck className="size-4" />} />
          <div className="mt-3">
            <Row label="Method" value="Password + emailed code" />
            <Row label="Stay signed in" value="30 days" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" icon={<KeyRound className="size-4" />} href="/set-password" linkAs={Link}>
              Change password
            </Button>
            <Button variant="outline" size="sm" icon={<UserCheck className="size-4" />} href="/welcome" linkAs={Link}>
              Run setup again
            </Button>
            <Button variant="ghost" size="sm" icon={<LogOut className="size-4" />} href="/sign-in" linkAs={Link}>
              Sign out
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
