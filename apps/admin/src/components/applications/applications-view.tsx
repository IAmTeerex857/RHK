"use client";

import { useMemo, useState } from "react";
import { ExternalLink, FileText, Inbox } from "lucide-react";
import { applications, getSchool, serviceLabel, type Application, type ApplicationStatus } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
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
                    <span className="block truncate text-[12.5px] text-ink-muted">
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
                  <span className="block truncate text-[12.5px] text-ink-muted">{getSchool(a.children[0].schoolId).short}</span>
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
        <div className="flex items-center gap-2 border-t border-line px-5 py-3 text-[12.5px] text-ink-muted">
          <FileText className="size-4" /> {rows.length} shown · new applications arrive from the website form
        </div>
      </Card>
    </>
  );
}
