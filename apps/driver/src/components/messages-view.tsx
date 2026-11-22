"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { announcements, conversations, OFFICE, staff } from "@rhk/fixtures";
import { AvatarStack } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { Card } from "@rhk/ui/components/card";
import { Composer, Thread, type ChatMessage } from "@rhk/ui/components/chat";
import { Tabs } from "@rhk/ui/components/segmented";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { me, nowLabel } from "./run-store";

const conv = conversations.find((c) => c.with.id === me.id)!;
const seedFor = (author: string) => staff.find((s) => s.name.startsWith(author))?.id ?? author;
const quick = ["On my way", "At school, waiting on dismissal", "Running about 10 minutes late", "All riders home"];

export function MessagesView() {
  const [tab, setTab] = useState<"office" | "news">("office");
  const [thread, setThread] = useState<ChatMessage[]>(
    conv.messages.map((m) => ({ id: m.id, mine: m.from === "driver", author: m.author, seed: m.from === "driver" ? me.id : seedFor(m.author), body: m.body, at: m.at.replace("Today, ", "") })),
  );
  const send = (body: string) => setThread((t) => [...t, { id: `n-${Date.now()}`, mine: true, author: me.name, seed: me.id, body, at: nowLabel() }]);
  const driverNews = announcements.filter((a) => a.audience === "Everyone" || a.audience.startsWith("Pine Ridge"));

  return (
    <>
      <PageHeader title="Messages" description="You message the office. The office talks to families, so parents' numbers stay with them." />
      <Tabs
        className="mb-4"
        value={tab}
        onChange={setTab}
        options={[
          { value: "office", label: "Office" },
          { value: "news", label: "Announcements", count: driverNews.length },
        ]}
      />
      {tab === "office" ? (
        <Card flush className="flex h-[calc(100dvh-380px)] min-h-[420px] flex-col overflow-hidden lg:h-[calc(100dvh-300px)] lg:min-h-[480px]">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <AvatarStack people={staff.map((s) => ({ seed: s.id, name: s.name }))} size={30} />
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-medium">Rush Hour Kids office</p>
              <p className="truncate text-[12.5px] text-ink-muted">Clara, Jordan and Tasha · usually reply in a few minutes</p>
            </div>
            <a
              href={`tel:${OFFICE.phone}`}
              aria-label="Call the office"
              title="Call the office"
              className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-card text-ink shadow-subtle transition-colors hover:bg-raised"
            >
              <Phone className="size-4" />
            </a>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto bg-canvas/50 px-4 py-5">
            <Thread messages={thread} />
          </div>
          <div className="border-t border-line p-3">
            <div className="scrollbar-none -mx-3 mb-2.5 flex gap-2 overflow-x-auto px-3">
              {quick.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="h-8 shrink-0 rounded-full border border-line-strong bg-card px-3 text-[13px] text-ink-soft transition-colors hover:bg-raised hover:text-ink"
                >
                  {q}
                </button>
              ))}
            </div>
            <Composer placeholder="Message the office…" onSend={send} />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {driverNews.map((a) => (
            <Card key={a.id}>
              <div className="flex items-center justify-between">
                <Badge tone="info">{a.audience}</Badge>
                <span className="text-[12.5px] text-ink-muted">{a.sentAt}</span>
              </div>
              <h3 className="mt-4 font-display text-[17px] font-medium tracking-[-0.02em]">{a.title}</h3>
              <p className="mt-2 text-[14px] text-ink-soft">{a.body}</p>
              <p className="mt-4 text-[12.5px] text-ink-muted">From {a.sentBy}</p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
