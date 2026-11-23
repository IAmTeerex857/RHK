"use client";

import { useMemo, useState } from "react";
import { FileSpreadsheet, Plus, Upload, Users } from "lucide-react";
import { childrenOf, families, money } from "@rhk/fixtures";
import { Avatar, AvatarStack } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { EmptyState } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card } from "@rhk/ui/components/card";
import { SearchField, Select } from "@rhk/ui/components/controls";
import { Dialog, Sheet } from "@rhk/ui/components/dialog";
import { Field } from "@rhk/ui/components/field";
import { Segmented } from "@rhk/ui/components/segmented";
import { DataTable, TableToolbar } from "@rhk/ui/components/table";
import { PageHeader } from "@rhk/ui/shell/app-shell";

export function FamiliesView() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "balance" | "paused">("all");
  const [importOpen, setImportOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const rows = useMemo(
    () =>
      families
        .filter((f) => (filter === "balance" ? f.balance > 0 : filter === "paused" ? f.status === "paused" : true))
        .filter((f) => {
          if (!q) return true;
          const hay = `${f.name} ${f.guardians.map((g) => g.name).join(" ")} ${childrenOf(f.id).map((c) => c.first).join(" ")} ${f.city}`.toLowerCase();
          return hay.includes(q.toLowerCase());
        }),
    [q, filter],
  );
  const kids = families.reduce((n, f) => n + childrenOf(f.id).filter((c) => c.status === "active").length, 0);

  return (
    <>
      <PageHeader
        title="Families"
        description={`${families.length} families · ${kids} children riding · import your existing list to skip the application and fee.`}
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Upload className="size-4" />} onClick={() => setImportOpen(true)}>
              Import spreadsheet
            </Button>
            <Button variant="ink" size="sm" icon={<Plus className="size-4" />} onClick={() => setAddOpen(true)}>
              Add family
            </Button>
          </>
        }
      />
      <Card flush>
        <TableToolbar
          left={
            <Segmented
              aria-label="Filter"
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All", count: families.length },
                { value: "balance", label: "Owe money", count: families.filter((f) => f.balance > 0).length },
                { value: "paused", label: "Paused", count: families.filter((f) => f.status === "paused").length },
              ]}
            />
          }
          right={<SearchField placeholder="Search families, children, cities" value={q} onChange={setQ} size="sm" className="w-full sm:w-72" />}
        />
        <DataTable
          rows={rows}
          rowKey={(f) => f.id}
          href={(f) => `/families/${f.id}`}
          empty={<EmptyState icon={<Users />} title="No families found" body="Try another name, or clear the filter." />}
          columns={[
            {
              key: "family",
              header: "Family",
              sort: (f) => f.name,
              cell: (f) => (
                <span className="flex items-center gap-3">
                  <Avatar seed={f.guardians[0].id} name={f.guardians[0].name} size={32} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{f.name}</span>
                    <span className="block truncate text-[13px] text-ink-muted">{f.guardians.map((g) => g.name.split(" ")[0]).join(" & ")}</span>
                  </span>
                </span>
              ),
            },
            {
              key: "children",
              header: "Children",
              cell: (f) => {
                const cs = childrenOf(f.id);
                return (
                  <span className="flex items-center gap-2.5">
                    <AvatarStack size={26} people={cs.map((c) => ({ seed: c.id, name: c.first }))} />
                    <span className="truncate text-ink-soft">{cs.map((c) => c.first).join(", ")}</span>
                  </span>
                );
              },
              hideBelow: "sm",
            },
            { key: "area", header: "Area", sort: (f) => f.city, cell: (f) => <span className="text-ink-soft">{f.city}</span>, hideBelow: "lg" },
            { key: "plan", header: "Plan", sort: (f) => f.cadence, cell: (f) => <span className="capitalize text-ink-soft">{f.cadence}</span>, hideBelow: "md" },
            { key: "since", header: "Since", cell: (f) => <span className="text-ink-muted">{f.joined}</span>, hideBelow: "xl" },
            {
              key: "balance",
              header: "Balance",
              align: "right",
              sort: (f) => f.balance,
              cell: (f) => <span className={`font-mono tabular ${f.balance > 0 ? "text-ink" : "text-ink-muted"}`}>{f.balance > 0 ? money(f.balance) : "—"}</span>,
            },
            {
              key: "status",
              header: "Status",
              align: "right",
              cell: (f) =>
                f.status === "paused" ? (
                  <Badge dot>Paused</Badge>
                ) : (
                  <Badge tone="good" dot>
                    Active
                  </Badge>
                ),
              hideBelow: "sm",
            },
          ]}
        />
      </Card>

      <Dialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        icon={<FileSpreadsheet className="size-5" />}
        title="Import families"
        description="Existing families skip the application and the $25 fee."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button variant="ink" size="sm" disabled>
              Review import
            </Button>
          </>
        }
      >
        <label className="flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-line-strong bg-raised/60 px-6 py-10 text-center transition-colors hover:bg-raised">
          <Upload className="size-6 text-ink-muted" />
          <span className="mt-3 text-[15px] font-medium">Drop a spreadsheet, or choose a file</span>
          <span className="mt-1 text-[13px] text-ink-muted">CSV or Excel · one row per child</span>
          <input type="file" accept=".csv,.xlsx" className="sr-only" />
        </label>
        <div className="mt-4 rounded-xl border border-line p-4">
          <p className="text-[13px] font-medium">Columns we look for</p>
          <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-ink-muted">
            parent_name, parent_email, parent_phone, address, child_first, child_last, age, grade, school, service (both | am | pm), days, plan (weekly | monthly), price
          </p>
          <button type="button" className="mt-3 text-[13px] font-medium text-ink underline-offset-4 hover:underline">
            Download a template
          </button>
        </div>
      </Dialog>

      <Sheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        icon={<Plus className="size-5" />}
        title="Add a family"
        description="We'll email the parent a link to set their password."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="ink" size="sm" onClick={() => setAddOpen(false)}>
              Create and invite
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-[13px] font-medium text-ink-muted">Parent or guardian</p>
          <Field label="Full name" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Email" type="email" />
            <Field label="Phone" type="tel" />
          </div>
          <Field label="Home address" />
          <p className="mt-3 text-[13px] font-medium text-ink-muted">First child</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="First name" />
            <Field label="Last name" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select label="School" defaultValue="s-pine">
              <option value="s-pine">Pine Ridge Elementary</option>
              <option value="s-maple">Maple Creek Academy</option>
              <option value="s-river">Riverside Middle School</option>
              <option value="s-cedar">Cedar Hill Elementary</option>
            </Select>
            <Select label="Service" defaultValue="both">
              <option value="both">Before and after school</option>
              <option value="pm">After school only</option>
              <option value="am">Before school only</option>
            </Select>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select label="Plan" defaultValue="weekly">
              <option value="weekly">Weekly · due Fridays</option>
              <option value="monthly">Monthly · due 2nd Friday</option>
            </Select>
            <Select label="Price" defaultValue="list">
              <option value="list">From price list ($95 / week)</option>
              <option value="custom">Custom price…</option>
            </Select>
          </div>
        </div>
      </Sheet>
    </>
  );
}
