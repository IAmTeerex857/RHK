"use client";

import { useMemo, useState } from "react";
import { ExternalLink, FileText, Inbox } from "lucide-react";
import { applications, getSchool, serviceLabel, type Application, type ApplicationStatus } from "@rhk/fixtures";
import { Avatar, AvatarStack } from "@rhk/ui/components/avatar";
import { FlowGraph } from "@rhk/ui/components/flow";
import { cn } from "@rhk/ui/lib/cn";
import { EmptyState } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card } from "@rhk/ui/components/card";
import { SearchField } from "@rhk/ui/components/controls";
import { Segmented } from "@rhk/ui/components/segmented";
import { DataTable, TableToolbar } from "@rhk/ui/components/table";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { applicationStatus, StatusBadge } from "../status";

type Filter = "open" | ApplicationStatus | "all";

const isOpen = (a: Application) => a.status !== "approved" && a.status !== "declined";

export function ApplicationsView() {
  const [filter, setFilter] = useState<Filter>("open");
  const [q, setQ] = useState("");
  const count = (f: Filter) => applications.filter((a) => (f === "all" ? true : f === "open" ? isOpen(a) : a.status === f)).length;
  const rows = useMemo(
    () =>
      applications
        .filter((a) => (filter === "all" ? true : filter === "open" ? isOpen(a) : a.status === filter))
        .filter((a) => !q || `${a.parent.name} ${a.ref} ${a.children.map((c) => c.name).join(" ")}`.toLowerCase().includes(q.toLowerCase())),
    [filter, q],
  );

  return (
    <>
      <PageHeader
        title="Applications"
        description="Families apply on the website for free. Call to confirm a route has room, send the $25 link, then approve to create their account."
        actions={
          <Button variant="outline" size="sm" href="https://www.rushhourkidstransportation.com/application" icon={<ExternalLink className="size-4" />}>
            View the form
          </Button>
        }
      />
      <Pipeline filter={filter} onPick={setFilter} />
      <Card flush>
        <TableToolbar
          left={
            <div className="scrollbar-none -mx-1 overflow-x-auto px-1">
              <Segmented
                aria-label="Status"
                value={filter}
                onChange={setFilter}
                options={[
                  { value: "open", label: "Open", count: count("open") },
                  { value: "submitted", label: "New", count: count("submitted") },
                  { value: "route_confirmed", label: "Fee requested", count: count("route_confirmed") },
                  { value: "fee_paid", label: "Fee paid", count: count("fee_paid") },
                  { value: "all", label: "All", count: count("all") },
                ]}
              />
            </div>
          }
          right={<SearchField placeholder="Search applications" value={q} onChange={setQ} className="w-full sm:w-64" size="sm" />}
        />
        <DataTable
          rows={rows}
          rowKey={(a) => a.id}
          href={(a) => `/applications/${a.id}`}
          empty={<EmptyState icon={<Inbox />} title="Nothing here" body="No applications match this filter." />}
          columns={[
            { key: "ref", header: "Ref", width: "110px", cell: (a) => <span className="font-mono text-[13px] text-ink-soft">{a.ref}</span>, sort: (a) => a.ref, hideBelow: "md" },
            {
              key: "parent",
              header: "Parent",
              sort: (a) => a.parent.name,
              cell: (a) => (
                <span className="flex items-center gap-3">
                  <Avatar seed={a.parent.id} name={a.parent.name} size={30} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{a.parent.name}</span>
                    <span className="block truncate text-[13px] text-ink-muted">
                      {a.address}, {a.city}
                    </span>
                  </span>
                </span>
              ),
            },
            {
              key: "children",
              header: "Children",
              cell: (a) => (
                <span className="min-w-0">
                  <span className="block truncate">{a.children.map((c) => c.name.split(" ")[0]).join(", ")}</span>
                  <span className="block truncate text-[13px] text-ink-muted">{getSchool(a.children[0].schoolId).short}</span>
                </span>
              ),
              hideBelow: "sm",
            },
            { key: "service", header: "Service", cell: (a) => <span className="text-ink-soft">{serviceLabel[a.service]}</span>, hideBelow: "xl" },
            { key: "start", header: "Start", cell: (a) => <span className="tabular">{a.startDate}</span>, hideBelow: "lg" },
            { key: "submitted", header: "Submitted", cell: (a) => <span className="text-ink-muted">{a.submitted}</span>, hideBelow: "lg" },
            { key: "status", header: "Status", align: "right", sort: (a) => applicationStatus[a.status].step, cell: (a) => <StatusBadge map={applicationStatus} value={a.status} /> },
          ]}
        />
        <div className="flex items-center gap-2 border-t border-line px-5 py-3 text-[13px] text-ink-muted">
          <FileText className="size-4" /> {rows.length} shown · new applications arrive from the website form
        </div>
      </Card>
    </>
  );
}

/** The application path as a flow: website form → route confirmed and fee requested → fee paid → approved, with declines branching off. */
function Pipeline({ filter, onPick }: { filter: Filter; onPick: (f: Filter) => void }) {
  const stage = (
    id: Filter,
    title: string,
    next: string,
    color: string,
    list: Application[],
  ) => (
    <button
      type="button"
      onClick={() => onPick(id)}
      aria-pressed={filter === id}
      className={cn(
        "w-full rounded-2xl border bg-card p-3.5 text-left transition-[border-color,box-shadow]",
        filter === id ? "border-ink/30 shadow-[0_0_0_1px_var(--color-ink)]" : "border-line hover:border-line-strong",
      )}
    >
      <span className="flex items-center gap-2 text-[13px] text-ink-muted">
        <span className="size-2 rounded-full" style={{ background: color }} aria-hidden />
        {title}
      </span>
      <span className="mt-2 flex items-end justify-between gap-2">
        <span className="font-display text-[28px] font-medium leading-none tracking-[-0.04em] tabular">{list.length}</span>
        {list.length ? <AvatarStack people={list.map((a) => ({ seed: a.parent.id, name: a.parent.name }))} size={24} max={3} /> : null}
      </span>
      <span className="mt-2 block truncate text-[13px] text-ink-muted">{next}</span>
    </button>
  );
  const by = (st: ApplicationStatus) => applications.filter((a) => a.status === st);
  return (
    <Card className="mb-4">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[15px] font-medium">Path to a seat</p>
        <p className="text-[13px] text-ink-muted">Tap a stage to filter the list</p>
      </div>
      <FlowGraph
        cols={4}
        nodes={[
          { id: "new", col: 1, row: 1, children: stage("submitted", "Applied", "Call to confirm a route has room", "var(--color-route-2)", by("submitted")) },
          { id: "fee", col: 2, row: 1, children: stage("route_confirmed", "Route confirmed", "$25 link sent, waiting to pay", "var(--color-bus-500)", by("route_confirmed")) },
          { id: "paid", col: 3, row: 1, children: stage("fee_paid", "Fee paid", "Approve to create their account", "var(--color-route-3)", by("fee_paid")) },
          { id: "ok", col: 4, row: 1, children: stage("approved", "Approved", "Account created, rides start", "var(--color-good)", by("approved")) },
          { id: "no", col: 2, row: 2, children: stage("declined", "Declined", "No room on the route", "var(--color-ink-muted)", by("declined")) },
        ]}
        edges={[
          { from: "new", to: "fee", color: "var(--color-route-2)", active: by("submitted").length > 0 },
          { from: "fee", to: "paid", color: "var(--color-bus-500)", active: by("route_confirmed").length > 0 },
          { from: "paid", to: "ok", color: "var(--color-route-3)", active: by("fee_paid").length > 0 },
          { from: "new", to: "no", dashed: true },
        ]}
      />
    </Card>
  );
}
