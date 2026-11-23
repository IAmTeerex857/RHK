"use client";

import { useMemo, useState } from "react";
import { FileSpreadsheet, Plus, Upload, Users } from "lucide-react";
import { childrenOf, families, money, priceList, schools } from "@rhk/fixtures";
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
import { toast } from "@rhk/ui/components/toast";
import { downloadCsv } from "@rhk/ui/lib/download";
import { PageHeader } from "@rhk/ui/shell/app-shell";

export function FamiliesView() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "balance" | "paused">("all");
  const [importOpen, setImportOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [file, setFile] = useState<{ name: string; size: number; rows: string[][] | null } | null>(null);
  const [nf, setNf] = useState({ name: "", email: "", phone: "", address: "", first: "", last: "", school: schools[0].id, service: "both", plan: "weekly", price: "list", custom: "", reason: "" });
  const [addErr, setAddErr] = useState<string | undefined>();
  const listPrice = priceList.find((p) => p.service === nf.service);
  const closeImport = () => {
    setImportOpen(false);
    setFile(null);
  };
  const create = () => {
    if (!nf.name.trim() || !nf.first.trim() || !nf.last.trim()) return setAddErr("Add the parent's name and the child's first and last name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(nf.email)) return setAddErr("Enter the parent's email. The invite goes there.");
    if (nf.price === "custom" && !(Number(nf.custom) > 0)) return setAddErr("Enter the custom price, or use the price list.");
    setAddErr(undefined);
    setAddOpen(false);
    toast(`${nf.name.trim().split(" ").slice(-1)[0]} family created`, { body: `Set-password email sent to ${nf.email}` });
    setNf((x) => ({ ...x, name: "", email: "", phone: "", address: "", first: "", last: "", price: "list", custom: "", reason: "" }));
  };
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
              cell: (f) => <span className={`font-mono tabular ${f.balance > 0 ? "text-ink" : "text-ink-muted"}`}>{f.balance > 0 ? money(f.balance) : "$0.00"}</span>,
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
        onClose={closeImport}
        icon={<FileSpreadsheet className="size-5" />}
        title="Import families"
        description="Existing families skip the application and the $25 fee."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={closeImport}>
              Cancel
            </Button>
            <Button
              variant="ink"
              size="sm"
              disabled={!file || (file.rows !== null && file.rows.length < 2)}
              onClick={() => {
                const n = file?.rows ? file.rows.length - 1 : null;
                closeImport();
                toast(n !== null ? `${n} row${n === 1 ? "" : "s"} imported` : "Spreadsheet imported", { body: "New families get a set-password email. They skip the application and the fee." });
              }}
            >
              {file?.rows ? `Import ${Math.max(0, file.rows.length - 1)} rows` : "Import"}
            </Button>
          </>
        }
      >
        {file ? (
          <div className="rounded-2xl border border-line">
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <FileSpreadsheet className="size-5 text-ink-muted" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{file.name}</span>
                <span className="block text-[12px] text-ink-muted">
                  {(file.size / 1024).toFixed(1)} KB{file.rows ? ` · ${Math.max(0, file.rows.length - 1)} rows` : ""}
                </span>
              </span>
              <button type="button" onClick={() => setFile(null)} className="text-[13px] font-medium text-ink-muted hover:text-ink">
                Change
              </button>
            </div>
            {file.rows ? (
              file.rows.length > 1 ? (
                <div className="scrollbar-none overflow-x-auto">
                  <table className="w-full text-left text-[12px]">
                    <thead className="text-ink-muted">
                      <tr>
                        {file.rows[0].slice(0, 5).map((h, i) => (
                          <th key={i} className="whitespace-nowrap px-4 py-2 font-mono font-normal">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {file.rows.slice(1, 6).map((r, i) => (
                        <tr key={i} className="border-t border-line">
                          {r.slice(0, 5).map((c, k) => (
                            <td key={k} className="whitespace-nowrap px-4 py-2">
                              {c}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {file.rows.length > 6 ? <p className="border-t border-line px-4 py-2 text-[12px] text-ink-muted">and {file.rows.length - 6} more rows</p> : null}
                </div>
              ) : (
                <p className="px-4 py-3 text-[13px] text-bad">This file has no rows under the headings.</p>
              )
            ) : (
              <p className="px-4 py-3 text-[13px] text-ink-muted">Excel files are checked row by row when you import. Save as CSV to preview them here first.</p>
            )}
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-line-strong bg-raised/60 px-6 py-10 text-center transition-colors hover:bg-raised">
            <Upload className="size-6 text-ink-muted" />
            <span className="mt-3 text-[15px] font-medium">Choose a spreadsheet</span>
            <span className="mt-1 text-[13px] text-ink-muted">CSV or Excel · one row per child</span>
            <input
              type="file"
              accept=".csv,.xlsx"
              className="sr-only"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const rows = f.name.toLowerCase().endsWith(".csv")
                  ? (await f.text())
                      .split(/\r?\n/)
                      .filter((l) => l.trim())
                      .map((l) => l.split(",").map((c) => c.replace(/^"|"$/g, "").trim()))
                  : null;
                setFile({ name: f.name, size: f.size, rows });
                e.target.value = "";
              }}
            />
          </label>
        )}
        <div className="mt-4 rounded-xl border border-line p-4">
          <p className="text-[13px] font-medium">Columns we look for</p>
          <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-ink-muted">
            parent_name, parent_email, parent_phone, address, child_first, child_last, age, grade, school, service (both | am | pm), days, plan (weekly | monthly), price
          </p>
          <button
            type="button"
            onClick={() =>
              downloadCsv("rush-hour-kids-import-template.csv", [
                ["parent_name", "parent_email", "parent_phone", "address", "child_first", "child_last", "age", "grade", "school", "service", "days", "plan", "price"],
                ["Tanya Johnson", "tanya@example.com", "(678) 555-0101", "4182 Brookstone Dr, Douglasville", "Maya", "Johnson", "8", "3rd", "Pine Ridge Elementary", "both", "mon tue wed thu fri", "weekly", "95"],
              ])
            }
            className="mt-3 text-[13px] font-medium text-ink underline-offset-4 hover:underline"
          >
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
            <Button variant="ink" size="sm" onClick={create}>
              Create and invite
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-[13px] font-medium text-ink-muted">Parent or guardian</p>
          <Field label="Full name" value={nf.name} onChange={(e) => setNf((x) => ({ ...x, name: e.target.value }))} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Email" type="email" value={nf.email} onChange={(e) => setNf((x) => ({ ...x, email: e.target.value }))} />
            <Field label="Phone" type="tel" value={nf.phone} onChange={(e) => setNf((x) => ({ ...x, phone: e.target.value }))} />
          </div>
          <Field label="Home address" value={nf.address} onChange={(e) => setNf((x) => ({ ...x, address: e.target.value }))} />
          <p className="mt-3 text-[13px] font-medium text-ink-muted">First child</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="First name" value={nf.first} onChange={(e) => setNf((x) => ({ ...x, first: e.target.value }))} />
            <Field label="Last name" value={nf.last} onChange={(e) => setNf((x) => ({ ...x, last: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select label="School" value={nf.school} onChange={(e) => setNf((x) => ({ ...x, school: e.target.value }))}>
              {schools.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </Select>
            <Select label="Service" value={nf.service} onChange={(e) => setNf((x) => ({ ...x, service: e.target.value }))}>
              <option value="both">Before and after school</option>
              <option value="pm">After school only</option>
              <option value="am">Before school only</option>
            </Select>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select label="Plan" value={nf.plan} onChange={(e) => setNf((x) => ({ ...x, plan: e.target.value }))}>
              <option value="weekly">Weekly · due Fridays</option>
              <option value="monthly">Monthly · due 2nd Friday</option>
            </Select>
            <Select label="Price" value={nf.price} onChange={(e) => setNf((x) => ({ ...x, price: e.target.value }))}>
              <option value="list">
                From price list ({listPrice ? money(nf.plan === "weekly" ? listPrice.weekly : listPrice.monthly) : "not set"} / {nf.plan === "weekly" ? "week" : "month"})
              </option>
              <option value="custom">Custom price</option>
            </Select>
          </div>
          {nf.price === "custom" ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label={`Price per ${nf.plan === "weekly" ? "week" : "month"}`} inputMode="decimal" value={nf.custom} onChange={(e) => setNf((x) => ({ ...x, custom: e.target.value }))} />
              <Field label="Reason" hint="For example: sibling half off" value={nf.reason} onChange={(e) => setNf((x) => ({ ...x, reason: e.target.value }))} />
            </div>
          ) : null}
          {addErr ? <p className="text-[13px] font-medium text-bad">{addErr}</p> : null}
        </div>
      </Sheet>
    </>
  );
}
