"use client";

/*
 * Data table: quiet header, hairline rows, hover state, optional row link, sortable columns.
 * Columns can hide below a breakpoint so the table stays readable on a phone.
 */

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { EmptyState } from "./blocks";

export type Column<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Value used for sorting; omit to make the column unsortable. */
  sort?: (row: T) => string | number;
  align?: "left" | "right" | "center";
  width?: string;
  hideBelow?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const hide = { sm: "max-sm:hidden", md: "max-md:hidden", lg: "max-lg:hidden", xl: "max-xl:hidden" } as const;

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  href,
  onRowClick,
  empty,
  className,
  dense,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  href?: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  className?: string;
  dense?: boolean;
}) {
  const router = useRouter();
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sort) return rows;
    return [...rows].sort((a, b) => {
      const x = col.sort!(a);
      const y = col.sort!(b);
      return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
    });
  }, [rows, columns, sort]);

  const clickable = Boolean(href || onRowClick);
  const go = (row: T) => (onRowClick ? onRowClick(row) : href ? router.push(href(row)) : undefined);

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            {columns.map((c) => {
              const active = sort?.key === c.key;
              return (
                <th
                  key={c.key}
                  scope="col"
                  style={{ width: c.width }}
                  className={cn(
                    "h-10 whitespace-nowrap border-b border-line px-4 text-[13px] font-medium text-ink-muted first:pl-5 last:pr-5",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.hideBelow && hide[c.hideBelow],
                  )}
                  aria-sort={active ? (sort!.dir === 1 ? "ascending" : "descending") : undefined}
                >
                  {c.sort ? (
                    <button
                      type="button"
                      onClick={() => setSort((s) => (s?.key === c.key ? (s.dir === 1 ? { key: c.key, dir: -1 } : null) : { key: c.key, dir: 1 }))}
                      className={cn("inline-flex h-6 items-center gap-1 align-middle transition-colors hover:text-ink", active && "text-ink", c.align === "right" && "flex-row-reverse")}
                    >
                      {c.header}
                      {active ? (
                        sort!.dir === 1 ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />
                      ) : (
                        <ChevronsUpDown className="size-3.5 opacity-50" />
                      )}
                    </button>
                  ) : (
                    <span className="inline-flex h-6 items-center align-middle">{c.header}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={clickable ? () => go(row) : undefined}
              onKeyDown={clickable ? (e) => e.key === "Enter" && go(row) : undefined}
              tabIndex={clickable ? 0 : undefined}
              className={cn("group", clickable && "cursor-pointer outline-none focus-visible:bg-raised")}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    "border-b border-line px-4 align-middle text-[14px] text-ink transition-colors first:pl-5 last:pr-5 group-last:border-b-0",
                    dense ? "h-11" : "h-[56px]",
                    clickable && "group-hover:bg-raised/60",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.hideBelow && hide[c.hideBelow],
                    c.className,
                  )}
                >
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? <div className="border-t border-line">{empty ?? <EmptyState title="Nothing here yet" body="New records show up here as soon as they're added." />}</div> : null}
    </div>
  );
}

/** Toolbar above a table: tabs or segmented on the left, search and filters on the right. */
export function TableToolbar({ left, right, className }: { left?: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5", className)}>
      <div className="min-w-0">{left}</div>
      <div className="flex flex-wrap items-center gap-2">{right}</div>
    </div>
  );
}
