"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Megaphone, Send } from "lucide-react";
import { announcements, conversations, ME, type Conversation } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge, CountPill } from "@rhk/ui/components/badge";
import { Button } from "@rhk/ui/components/button";
import { Card } from "@rhk/ui/components/card";
import { Composer, Thread, type ChatMessage } from "@rhk/ui/components/chat";
import { SearchField, Select } from "@rhk/ui/components/controls";
import { Dialog } from "@rhk/ui/components/dialog";
import { Field, TextArea } from "@rhk/ui/components/field";
import { Tabs } from "@rhk/ui/components/segmented";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { cn } from "@rhk/ui/lib/cn";

const toChat = (c: Conversation): ChatMessage[] =>
  c.messages.map((m) => ({ id: m.id, mine: m.from === "office", author: m.author, seed: m.from === "office" ? ME.admin.id : c.with.seed, body: m.body, at: m.at.replace("Today, ", "") }));

export function MessagesView() {
  const [tab, setTab] = useState<"inbox" | "announcements">("inbox");
  const [sel, setSel] = useState<string | null>(conversations[0].id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>(Object.fromEntries(conversations.map((c) => [c.id, toChat(c)])));
  const [read, setRead] = useState<Record<string, boolean>>({});
  const [announce, setAnnounce] = useState(false);
  const conv = conversations.find((c) => c.id === sel) ?? conversations[0];

  return (
    <>
      <PageHeader
        title="Messages"
        description="Parents and drivers message the office. Announcements go to everyone, a school, an area or a route."
        actions={
          <Button variant="ink" size="sm" icon={<Megaphone className="size-4" />} onClick={() => setAnnounce(true)}>
            New announcement
          </Button>
        }
      />
      <Tabs
        className="mb-4"
        value={tab}
        onChange={setTab}
        options={[
          { value: "inbox", label: "Inbox", count: conversations.reduce((n, c) => n + (read[c.id] ? 0 : c.unread), 0) },
          { value: "announcements", label: "Announcements", count: announcements.length },
        ]}
      />
      {tab === "inbox" ? (
        <Card flush className="grid grid-cols-1 h-[calc(100dvh-390px)] min-h-[420px] lg:h-[calc(100dvh-280px)] lg:min-h-[520px] overflow-hidden lg:grid-cols-[340px_1fr]">
          <div className={cn("flex min-h-0 flex-col border-line lg:border-r", mobileOpen && "max-lg:hidden")}>
            <div className="border-b border-line p-3">
              <SearchField size="sm" placeholder="Search messages" />
            </div>
            <ul className="min-h-0 flex-1 overflow-y-auto p-1.5">
              {conversations.map((c) => {
                const last = c.messages[c.messages.length - 1];
                const unread = read[c.id] ? 0 : c.unread;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSel(c.id);
                        setRead((r) => ({ ...r, [c.id]: true }));
                        setMobileOpen(true);
                      }}
                      className={cn("flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors", sel === c.id ? "bg-raised" : "hover:bg-raised/60")}
                    >
                      <Avatar seed={c.with.seed} name={c.with.name} size={38} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className={cn("truncate text-[14px]", unread ? "font-medium" : "font-medium")}>{c.with.name}</span>
                          <span className="shrink-0 text-[12px] text-ink-muted">{c.updated}</span>
                        </span>
                        <span className="mt-0.5 flex items-center gap-2">
                          <Badge tone={c.with.kind === "driver" ? "lilac" : "neutral"} className="h-5 px-1.5 text-[11px]">
                            {c.with.kind === "driver" ? "Driver" : "Parent"}
                          </Badge>
                          <span className="truncate text-[13px] text-ink-muted">{c.subject}</span>
                        </span>
                        <span className="mt-1 flex items-center justify-between gap-2">
                          <span className={cn("line-clamp-1 text-[13px]", unread ? "text-ink" : "text-ink-muted")}>{last.body}</span>
                          {unread ? <CountPill tone="alert">{unread}</CountPill> : null}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={cn("flex min-h-0 flex-col", !mobileOpen && "max-lg:hidden")}>
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Back to inbox" className="grid size-8 place-items-center rounded-lg hover:bg-raised lg:hidden">
                <ArrowLeft className="size-4" />
              </button>
              <Avatar seed={conv.with.seed} name={conv.with.name} size={34} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium">{conv.with.name}</p>
                <p className="truncate text-[13px] text-ink-muted">{conv.subject}</p>
              </div>
              <Button
                variant="outline"
                size="xs"
                href={conv.with.kind === "family" ? `/families/${conv.with.id}` : `/drivers/${conv.with.id}`}
                linkAs={Link}
              >
                {conv.with.kind === "family" ? "Open family" : "Open driver"}
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto bg-canvas/50 px-4 py-5">
              <Thread messages={threads[conv.id]} />
            </div>
            <div className="border-t border-line p-3">
              <Composer
                placeholder={`Reply to ${conv.with.name.split(" ")[0]}…`}
                onSend={(body) =>
                  setThreads((t) => ({
                    ...t,
                    [conv.id]: [...t[conv.id], { id: `new-${Date.now()}`, mine: true, author: ME.admin.name, seed: ME.admin.id, body, at: "Now" }],
                  }))
                }
              />
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {announcements.map((a) => (
            <Card key={a.id} className="flex flex-col">
              <div className="flex items-center justify-between">
                <Badge tone="info">{a.audience}</Badge>
                <span className="text-[13px] text-ink-muted">{a.sentAt}</span>
              </div>
              <h3 className="mt-4 font-display text-[18px] font-medium tracking-[-0.02em]">{a.title}</h3>
              <p className="mt-2 text-[14px] text-ink-soft">{a.body}</p>
              <div className="mt-auto pt-5">
                <div className="mb-2 flex justify-between text-[13px] text-ink-muted">
                  <span>Opened</span>
                  <span className="font-mono tabular">
                    {a.opened}/{a.reach}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-raised">
                  <div className="h-full rounded-full bg-data-500" style={{ width: `${(a.opened / a.reach) * 100}%` }} />
                </div>
                <p className="mt-3 text-[13px] text-ink-muted">Sent by {a.sentBy} · push and email</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={announce}
        onClose={() => setAnnounce(false)}
        icon={<Megaphone className="size-5" />}
        title="New announcement"
        description="Sent by push to installed apps and by email to everyone in the audience."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setAnnounce(false)}>
              Cancel
            </Button>
            <Button variant="ink" size="sm" icon={<Send className="size-4" />} onClick={() => setAnnounce(false)}>
              Send to 12 families
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Select label="Audience" defaultValue="all">
            <option value="all">Everyone · 12 families, 5 drivers</option>
            <optgroup label="School">
              <option>Pine Ridge Elementary · 4 families</option>
              <option>Maple Creek Academy · 3 families</option>
              <option>Riverside Middle School · 3 families</option>
              <option>Cedar Hill Elementary · 3 families</option>
            </optgroup>
            <optgroup label="Route">
              <option>Route 1</option>
              <option>Route 2</option>
              <option>Route 3</option>
              <option>Route 4</option>
            </optgroup>
            <optgroup label="Area">
              <option>Douglas County</option>
              <option>Cobb County</option>
              <option>DeKalb County</option>
            </optgroup>
          </Select>
          <Field label="Title" />
          <TextArea label="Message" />
        </div>
      </Dialog>
    </>
  );
}
