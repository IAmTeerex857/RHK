"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ArrowRight, Check, Clock3, Gauge, HeartPulse, Info, TriangleAlert, Wrench } from "lucide-react";
import { getChild } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { SlideToConfirm } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { ChoiceChips } from "@rhk/ui/components/controls";
import { Dialog } from "@rhk/ui/components/dialog";
import { Field, TextArea } from "@rhk/ui/components/field";
import { cn } from "@rhk/ui/lib/cn";
import { route, useMockTime, useRun, van } from "./run-store";

/** Pre-trip items. `stop` items keep the van parked until the office clears it. */
const checks = [
  { id: "tires", label: "Tires", hint: "No flats, no bulges", stop: true },
  { id: "lights", label: "Lights and signals", hint: "Head, brake, hazard, turn", stop: true },
  { id: "brakes", label: "Brakes", hint: "Firm pedal, parking brake holds", stop: true },
  { id: "belts", label: "Seatbelts, every row", hint: "Click in and release", stop: true },
  { id: "doors", label: "Doors and child locks", hint: "Slider closes, locks engage", stop: true },
  { id: "mirrors", label: "Mirrors and windows", hint: "Clean and set", stop: false },
  { id: "kit", label: "First-aid kit and extinguisher", hint: "Sealed and in date", stop: false },
  { id: "boosters", label: "Booster seats", hint: "4 on board for under-8s", stop: false },
  { id: "clean", label: "Clean inside", hint: "Nothing left from the morning", stop: false },
] as const;

const omit = <T,>(o: Record<string, T>, key: string) => Object.fromEntries(Object.entries(o).filter(([k]) => k !== key));

const fuelLevels = [
  { value: 0.125, label: "E" },
  { value: 0.25, label: "¼" },
  { value: 0.5, label: "½" },
  { value: 0.75, label: "¾" },
  { value: 1, label: "F" },
];

export function StartView() {
  const run = useRun();
  const router = useRouter();
  const time = useMockTime();
  const [ok, setOk] = useState<Record<string, boolean>>({});
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [reporting, setReporting] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [fuel, setFuel] = useState<number | null>(null);
  const [odo, setOdo] = useState("");

  if (run.phase !== "pre") return <AlreadyStarted />;

  const clocked = Boolean(run.clockIn);
  const answered = checks.filter((c) => ok[c.id] || issues[c.id]).length;
  const blocking = checks.filter((c) => c.stop && issues[c.id]);
  const checked = answered === checks.length;
  const readings = fuel !== null && odo.replace(/\D/g, "").length >= 5;
  const ready = clocked && checked && readings && blocking.length === 0;
  const riders = route.stops[0].childIds.map(getChild);
  const item = checks.find((c) => c.id === reporting);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="pb-6 pt-4 lg:pt-6">
        <p className="mono-label text-ink-muted">
          Pre-trip · {route.name} · {van.name} {van.plate}
        </p>
        <h1 className="mt-2 font-display text-[28px] font-medium leading-[1.1] tracking-[-0.035em] sm:text-[32px]">Before you roll</h1>
        <p className="mt-2 text-[14.5px] text-ink-muted">Clock in, walk round the van, log fuel and miles. Takes about four minutes.</p>
      </div>

      <ol className="flex flex-col gap-3">
        <Section n={1} title="Clock in" done={clocked} sub={clocked ? `Clocked in at ${run.clockIn}` : "Your hours count from here, for this run only."}>
          {!clocked ? (
            <button
              type="button"
              onClick={() => run.dispatch({ type: "clockIn" })}
              className="flex h-14 w-full items-center justify-between rounded-2xl bg-bus-400 px-5 text-[#1d1a2f] transition-transform active:scale-[0.99]"
            >
              <span className="flex items-center gap-2.5 text-[16px] font-semibold">
                <Clock3 className="size-5" /> Clock in
              </span>
              <span className="font-mono text-[15px] font-medium tabular">{time}</span>
            </button>
          ) : null}
        </Section>

        <Section
          n={2}
          title="Vehicle check"
          done={checked && !blocking.length}
          locked={!clocked}
          sub={`${answered} of ${checks.length} checked${Object.keys(issues).length ? ` · ${Object.keys(issues).length} reported` : ""}`}
          action={
            clocked && !checked ? (
              <Button variant="soft" size="xs" onClick={() => setOk(Object.fromEntries(checks.filter((c) => !issues[c.id]).map((c) => [c.id, true])))}>
                All OK
              </Button>
            ) : null
          }
        >
          <ul className={cn("-mx-1 flex flex-col", !clocked && "pointer-events-none opacity-50")}>
            {checks.map((c) => {
              const good = ok[c.id];
              const bad = issues[c.id];
              return (
                <li key={c.id} className="flex items-center gap-3 rounded-xl px-1 py-2.5">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={Boolean(good)}
                    onClick={() => {
                      setOk((o) => ({ ...o, [c.id]: !o[c.id] }));
                      setIssues((x) => omit(x, c.id));
                    }}
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-lg border transition-colors",
                      good ? "border-good bg-good text-white" : bad ? "border-bad bg-coral-soft text-bad" : "border-line-strong bg-card",
                    )}
                  >
                    {good ? <Check className="size-4 stroke-[3]" /> : bad ? <TriangleAlert className="size-3.5" /> : null}
                  </button>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium">{c.label}</span>
                    <span className={cn("block truncate text-[13px]", bad ? "text-bad" : "text-ink-muted")}>{bad || c.hint}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setReporting(c.id);
                      setNote(issues[c.id] ?? "");
                    }}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] text-ink-muted transition-colors hover:bg-raised hover:text-ink"
                  >
                    <Wrench className="size-3.5" />
                    <span className="max-sm:sr-only">Problem</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {blocking.length ? (
            <div className="mt-3 flex gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--color-bad)_30%,transparent)] bg-coral-soft p-4 text-[14px]">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-bad" />
              <p>
                <span className="font-semibold">Don&apos;t drive this van.</span> The office has the report and will send a spare van or a fix. Stay with the van.
              </p>
            </div>
          ) : null}
        </Section>

        <Section n={3} title="Fuel and odometer" done={readings} locked={!checked || blocking.length > 0} sub="The office uses these for mileage and fuel reports.">
          <div className={cn("flex flex-col gap-5", (!checked || blocking.length > 0) && "pointer-events-none opacity-50")}>
            <div>
              <p className="mb-2.5 flex items-center gap-2 text-[13px] font-medium text-ink-soft">
                <Gauge className="size-4" /> Fuel gauge
              </p>
              <ChoiceChips aria-label="Fuel level" size="lg" value={fuel} onChange={setFuel} options={fuelLevels} className="[&>button]:min-w-14" />
              {fuel !== null && fuel <= 0.25 ? <p className="mt-2 text-[13px] text-bad">Below a quarter tank. Fill up after this run and log it.</p> : null}
            </div>
            <Field label="Odometer" inputMode="numeric" hint="Morning ended at 39,875" value={odo} onChange={(e) => setOdo(e.target.value.replace(/[^\d,]/g, ""))} />
          </div>
        </Section>

        <Section n={4} title="Today's riders" done={ready} locked={!readings} sub={`${riders.length} from Pine Ridge Elementary at ${route.stops[0].time}`}>
          <ul className="flex flex-col gap-2">
            {riders.map((c) => (
              <li key={c.id} className="flex items-center gap-3">
                <Avatar seed={c.id} name={c.first} size={34} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-medium">
                    {c.first} {c.last}
                  </span>
                  {c.medical ? (
                    <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-bad">
                      <HeartPulse className="size-3.5" /> {c.medical}
                    </span>
                  ) : (
                    <span className="block text-[12.5px] text-ink-muted">
                      {c.grade} grade · {c.teacher}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-3 rounded-2xl bg-raised p-4 text-[14px]">
            <Info className="mt-0.5 size-4 shrink-0 text-ink-muted" />
            <p>
              <span className="font-medium">From the office:</span> Kai&apos;s grandfather, Bao Tran, will meet the van today. He&apos;s on Kai&apos;s approved list.
            </p>
          </div>
        </Section>
      </ol>

      <div className="sticky bottom-[96px] mt-5 lg:bottom-6">
        {ready ? (
          <SlideToConfirm
            label="Slide to start Route 2"
            doneLabel="Route started"
            onConfirm={() =>
              setTimeout(() => {
                run.dispatch({ type: "start", odo: Number(odo.replace(/\D/g, "")), fuel: fuel ?? 0.5 });
                router.push("/route");
              }, 450)
            }
          />
        ) : (
          <div className="flex h-16 items-center justify-center rounded-full border border-dashed border-line-strong bg-card/80 text-[14.5px] text-ink-muted backdrop-blur">
            {blocking.length ? "This van can't start. The office is on it." : "Finish the steps above to start the route"}
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(reporting)}
        onClose={() => setReporting(null)}
        size="sm"
        icon={<Wrench className="size-5" />}
        title={item ? `Problem with ${item.label.toLowerCase()}` : ""}
        description={item?.stop ? "This one keeps the van parked until the office clears it." : "The office will book a fix. You can still drive."}
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setReporting(null)}>
              Cancel
            </Button>
            <Button
              variant="ink"
              size="sm"
              disabled={note.trim().length < 3}
              onClick={() => {
                if (reporting) {
                  setIssues((x) => ({ ...x, [reporting]: note.trim() }));
                  setOk((x) => omit(x, reporting));
                }
                setReporting(null);
              }}
            >
              Send to the office
            </Button>
          </>
        }
      >
        <TextArea label="What's wrong?" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
      </Dialog>
    </div>
  );
}

function Section({ n, title, sub, done, locked, action, children }: { n: number; title: string; sub: string; done: boolean; locked?: boolean; action?: ReactNode; children: ReactNode }) {
  return (
    <li className={cn("rounded-[20px] border border-line bg-card p-5 transition-opacity", locked && "opacity-60")}>
      <div className="flex items-start gap-3.5">
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full font-mono text-[13px] font-medium",
            done ? "bg-good text-white" : locked ? "bg-raised text-ink-muted" : "bg-ink text-cream",
          )}
        >
          {done ? <Check className="size-4 stroke-[3]" /> : n}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[16px] font-semibold tracking-[-0.01em]">{title}</h2>
            {action}
          </div>
          <p className="mt-0.5 text-[13.5px] text-ink-muted">{sub}</p>
        </div>
      </div>
      {!locked ? <div className="mt-4 sm:pl-[46px]">{children}</div> : null}
    </li>
  );
}

function AlreadyStarted() {
  const run = useRun();
  return (
    <div className="mx-auto max-w-md pt-16 text-center">
      <Badge tone="good" dot>
        Pre-trip passed
      </Badge>
      <h1 className="mt-4 font-display text-[30px] font-medium tracking-[-0.04em]">You&apos;re already on the road</h1>
      <p className="mt-2 text-[15px] text-ink-muted">
        Clocked in at {run.clockIn}, route started {run.startedAt}. The next pre-trip opens Monday at 6:10 AM.
      </p>
      <Link href="/route" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-cream">
        Back to the route <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
