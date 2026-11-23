"use client";

import { useMemo, useState } from "react";
import { Download, History } from "lucide-react";
import { audit } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { EmptyState } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card } from "@rhk/ui/components/card";
import { SearchField } from "@rhk/ui/components/controls";
import { Segmented } from "@rhk/ui/components/segmented";
import { DataTable, TableToolbar } from "@rhk/ui/components/table";
import { PageHeader } from "@rhk/ui/shell/app-shell";

const group = (a: string) =>
  /payment|price|fee/i.test(a) ? "money" : /dropped|absent|absence/i.test(a) ? "rides" : /application|approved adult/i.test(a) ? "families" : "other";

export function HistoryView() {
  const [q, setQ] = useState("");
  const [g, setG] = useState<"all" | "rides" | "money" | "families">("all");
  const rows = useMemo(
    () => audit.filter((e) => (g === "all" ? true : group(e.action) === g)).filter((e) => !q || `${e.who} ${e.action} ${e.target} ${e.detail}`.toLowerCase().includes(q.toLowerCase())),
    [q, g],
  );
  return (
    <>
      <PageHeader
        title="Change history"
        description="Every change to every record: who, what, when, and the value before and after. Kept from day one."
        actions={
          <Button variant="outline" size="sm" icon={<Download className="size-4" />}>
            Export
          </Button>
        }
      />
      <Card flush>
        <TableToolbar
          left={
            <Segmented
              value={g}
              onChange={setG}
              options={[
                { value: "all", label: "All" },
                { value: "rides", label: "Rides" },
                { value: "money", label: "Money" },
                { value: "families", label: "Families" },
              ]}
            />
          }
          right={<SearchField size="sm" value={q} onChange={setQ} placeholder="Search people, records, values" className="w-full sm:w-72" />}
        />
        <DataTable
          dense
          rows={rows}
          rowKey={(e) => e.id}
          empty={<EmptyState icon={<History />} title="No changes match" />}
          columns={[
            { key: "at", header: "When", width: "110px", cell: (e) => <span className="font-mono text-[13px] text-ink-muted">{e.at}</span> },
            {
              key: "who",
              header: "Who",
              cell: (e) => (
                <span className="flex items-center gap-2.5">
                  <Avatar seed={e.who} name={e.who} size={24} />
                  <span className="whitespace-nowrap">{e.who}</span>
                </span>
              ),
            },
            { key: "action", header: "Action", cell: (e) => <Badge tone={group(e.action) === "money" ? "good" : group(e.action) === "rides" ? "info" : "neutral"}>{e.action}</Badge> },
            { key: "target", header: "Record", cell: (e) => <span className="font-medium">{e.target}</span>, hideBelow: "sm" },
            { key: "detail", header: "Change", cell: (e) => <span className="text-ink-soft">{e.detail}</span>, hideBelow: "md" },
          ]}
        />
      </Card>
    </>
  );
}
