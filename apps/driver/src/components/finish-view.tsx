"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BellRing, Check, Clock3, PackageSearch } from "lucide-react";
import { getChild, OFFICE } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { SlideToConfirm } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Checkbox, Field } from "@rhk/ui/components/field";
import { cn } from "@rhk/ui/lib/cn";
import { route, useRun, van } from "./run-store";

/** Van 2 seen from above: driver row first, the back bench last. 14 rider seats. */
const rows = [2, 3, 3, 3, 3];

const toMinutes = (t: string) => {
  const [hm, ap] = t.split(" ");
  const [h, m] = hm.split(":").map(Number);
  return ((h % 12) + (ap === "PM" ? 12 : 0)) * 60 + m;
};

export function FinishView() {
  const run = useRun();
  const [seen, setSeen] = useState<boolean[]>(rows.map(() => false));
  const [under, setUnder] = useState(false);
  const [odo, setOdo] = useState("");
  const held = Object.entries(run.kids).filter(([, k]) => k.state === "held").map(([id]) => getChild(id));
  const onBoard = run.onBoard.filter((id) => run.kids[id]?.state === "on");

  if (run.phase === "pre" || run.phase === "live") {
    return (
      <div className="mx-auto max-w-md pt-16 text-center">
        <p className="mono-label text-ink-muted">{route.name}</p>
        <h1 className="mt-3 font-display text-[30px] font-medium tracking-[-0.04em]">Finish the stops first</h1>
        <p className="mt-2 text-[15px] text-ink-muted">The empty-van check opens after the last stop.</p>
        <Link href="/route" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-cream">
          Back to the route <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  if (run.phase === "closed") return <Summary />;

  const walked = seen.every(Boolean) && under;
  const ready = walked && held.length === 0 && onBoard.length === 0 && odo.replace(/\D/g, "").length >= 5;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="pb-6 pt-4 lg:pt-6">
        <p className="mono-label text-ink-muted">
          Close the route · {van.name} {van.plate}
        </p>
        <h1 className="mt-2 font-display text-[28px] font-medium leading-[1.1] tracking-[-0.035em] sm:text-[32px]">Walk the van, front to back</h1>
        <p className="mt-2 text-[14.5px] text-ink-muted">Tap each row as you check it. Look under every seat. The route can&apos;t close until every row is clear.</p>
      </div>

      {held.map((c) => (
        <div key={c.id} className="mb-3 flex flex-wrap items-center gap-3 rounded-[20px] border border-[color-mix(in_oklab,var(--color-bad)_30%,transparent)] bg-coral-soft p-4">
          <Avatar seed={c.id} name={c.first} size={40} />
          <div className="min-w-[200px] flex-1">
            <p className="text-[15px] font-semibold">{c.first} is still with you</p>
            <p className="text-[13.5px] text-ink-soft">The office asked you to bring {c.first} to {OFFICE.address.split(",")[0]}.</p>
          </div>
          <Button variant="ink" size="sm" className="max-sm:w-full" icon={<BellRing className="size-4" />} onClick={() => run.dispatch({ type: "handOff", id: c.id, by: "Jordan Lee · Office" })}>
            Handed to the office
          </Button>
        </div>
      ))}

      <section className="rounded-[22px] border border-line bg-card p-5 sm:p-6">
        <div className="mx-auto max-w-[300px] rounded-[34px] border-2 border-line-strong bg-sunken p-4 pt-6">
          <div className="mb-4 flex items-center justify-between px-1 text-[11px] text-ink-muted">
            <span className="mono-label">Front</span>
            <span className="grid size-9 place-items-center rounded-full border border-line-strong font-mono text-[10px]">DRV</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {rows.map((n, r) => (
              <button
                key={r}
                type="button"
                aria-pressed={seen[r]}
                onClick={() => setSeen((s) => s.map((v, i) => (i === r ? !v : v)))}
                className={cn(
                  "flex items-center gap-2 rounded-2xl border p-2 transition-colors",
                  seen[r] ? "border-[color-mix(in_oklab,var(--color-good)_40%,transparent)] bg-mint-soft" : "border-line bg-card hover:border-line-strong",
                  n === 2 && "justify-end",
                )}
              >
                <span className="w-9 shrink-0 text-left font-mono text-[11px] text-ink-muted">R{r + 1}</span>
                <span className={cn("flex flex-1 gap-1.5", n === 2 && "justify-end")}>
                  {Array.from({ length: n }, (_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "grid h-10 flex-1 place-items-center rounded-lg transition-colors",
                        n === 2 && "max-w-[56px]",
                        seen[r] ? "bg-good text-white" : "bg-raised",
                      )}
                    >
                      {seen[r] ? <Check className="size-4 stroke-[3]" /> : null}
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>
          <p className="mono-label mt-4 text-center text-ink-muted">Back doors</p>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5">
          <Checkbox checked={under} onChange={setUnder} label="Under every seat and the back area" description="Small children fall asleep and slide down. Look, don't just glance." />
          <div className="flex items-start gap-3 rounded-2xl bg-raised p-4 text-[13.5px] text-ink-soft">
            <PackageSearch className="mt-0.5 size-4 shrink-0" />
            Found a backpack or a coat? Leave it on the front seat and tell the office. They let the family know.
          </div>
        </div>
      </section>

      <section className={cn("mt-3 rounded-[22px] border border-line bg-card p-5 sm:p-6", !walked && "opacity-60")}>
        <h2 className="text-[16px] font-semibold">Odometer at the end</h2>
        <p className="mt-0.5 text-[13.5px] text-ink-muted">Started at {(run.odoStart ?? 39876).toLocaleString()}. About {route.miles} miles for this route.</p>
        <Field className="mt-4" label="Odometer" inputMode="numeric" disabled={!walked} value={odo} onChange={(e) => setOdo(e.target.value.replace(/[^\d,]/g, ""))} />
      </section>

      <div className="sticky bottom-[96px] mt-5 lg:bottom-6">
        {ready ? (
          <SlideToConfirm label="Slide to clock out" doneLabel="Clocked out" tone="brand" onConfirm={() => setTimeout(() => run.dispatch({ type: "clockOut", odo: Number(odo.replace(/\D/g, "")) }), 450)} />
        ) : (
          <div className="flex h-16 items-center justify-center rounded-full border border-dashed border-line-strong bg-card/80 px-4 text-center text-[14.5px] text-ink-muted backdrop-blur">
            {held.length ? `Hand ${held[0].first} to the office first` : !walked ? `${seen.filter(Boolean).length} of ${rows.length} rows checked` : "Add the odometer reading"}
          </div>
        )}
      </div>
    </div>
  );
}

function Summary() {
  const run = useRun();
  const mins = run.clockIn && run.clockOut ? toMinutes(run.clockOut) - toMinutes(run.clockIn) : 0;
  const miles = run.odoEnd && run.odoStart ? Math.max(0, run.odoEnd - run.odoStart) : route.miles;
  const delivered = Object.values(run.kids).filter((k) => k.state === "off").length;
  return (
    <div className="mx-auto max-w-md pt-10">
      <div className="rounded-[24px] bg-bus-400 p-6 text-[#1d1a2f]">
        <span className="grid size-12 place-items-center rounded-full bg-[#1d1a2f] text-white">
          <Check className="size-6 stroke-[2.5]" />
        </span>
        <h1 className="mt-6 font-display text-[34px] font-semibold leading-[1.02] tracking-[-0.045em]">Route closed. Nice work.</h1>
        <p className="mt-2 text-[15px] text-[#1d1a2f]/75">Every rider is accounted for and the van is empty.</p>
        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-[#1d1a2f]/15 pt-5">
          <div>
            <dt className="text-[12.5px] text-[#1d1a2f]/70">Hours</dt>
            <dd className="mt-1 font-display text-[24px] font-semibold leading-none tracking-[-0.04em] tabular">{(mins / 60).toFixed(2)}</dd>
          </div>
          <div>
            <dt className="text-[12.5px] text-[#1d1a2f]/70">Miles</dt>
            <dd className="mt-1 font-display text-[24px] font-semibold leading-none tracking-[-0.04em] tabular">{miles.toFixed(1)}</dd>
          </div>
          <div>
            <dt className="text-[12.5px] text-[#1d1a2f]/70">Riders home</dt>
            <dd className="mt-1 font-display text-[24px] font-semibold leading-none tracking-[-0.04em] tabular">{delivered}</dd>
          </div>
        </dl>
      </div>
      <p className="mt-4 flex items-center justify-center gap-2 text-[13.5px] text-ink-muted">
        <Clock3 className="size-4" /> {run.clockIn} – {run.clockOut} · sent to the office
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Button variant="outline" size="md" href="/hours" linkAs={Link}>
          My hours
        </Button>
        <Button variant="ink" size="md" href="/" linkAs={Link}>
          Done
        </Button>
      </div>
    </div>
  );
}
