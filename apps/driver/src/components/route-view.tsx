"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BellRing,
  Check,
  CircleSlash,
  HeartPulse,
  MapPin,
  Navigation,
  Phone,
  ShieldAlert,
  Timer,
  Undo2,
  UserCheck,
  UserRoundX,
} from "lucide-react";
import { getChild, OFFICE, type RouteStop } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { RouteMap, SlideToConfirm, Steps, type Step } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader } from "@rhk/ui/components/card";
import { Ring } from "@rhk/ui/components/charts";
import { Dialog } from "@rhk/ui/components/dialog";
import { cn } from "@rhk/ui/lib/cn";
import { routeColor } from "@rhk/ui/lib/route-color";
import { LateDialog } from "./frame";
import { kidsAt, mmss, receivers, route, stopName, stopResolved, useRun, useWait, van, type ChildRec } from "./run-store";

const WAIT = 300;

export function RouteView() {
  const run = useRun();
  const [late, setLate] = useState(false);

  if (run.phase === "pre") return <NotStarted />;

  const stop = run.stop;
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3 pb-5 pt-4 lg:pt-6">
        <div>
          <p className="mono-label text-ink-muted">
            {route.name} · {van.name}
          </p>
          <h1 className="mt-2 font-display text-[28px] font-medium leading-[1.1] tracking-[-0.035em] sm:text-[32px]">
            {run.phase === "live" ? `${run.onBoard.length} on board` : run.phase === "closing" ? "Last stop done" : "Route closed"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {run.late && run.phase === "live" ? (
            <Badge tone="warn" dot>
              {run.late.minutes} min behind
            </Badge>
          ) : (
            <Badge tone="good" dot>
              On time
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          {run.phase === "live" && stop ? <CurrentStop stop={stop} /> : <Finished />}

          <div className="grid grid-cols-3 gap-2">
            <QuickAction color="var(--color-route-4)" icon={<Timer />} label="Running late" onClick={() => setLate(true)} />
            <QuickAction color="var(--color-coral)" icon={<ShieldAlert />} label="Report" href="/report" />
            <QuickAction color="var(--color-good)" icon={<Phone />} label="Call office" href={`tel:${OFFICE.phone}`} />
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5">
          <Card flush className="overflow-hidden">
            <LiveMap />
          </Card>
          <Card>
            <CardHeader title="Stops" subtitle={`${Object.keys(run.stopsDone).length} of ${route.stops.length} done · ${route.miles} mi`} />
            <Steps className="mt-5" dense steps={stopSteps(run)} />
          </Card>
          <Card>
            <CardHeader title="Run log" subtitle="Sent to the office as it happens" />
            <ul className="mt-4 flex flex-col">
              {run.log.slice(0, 6).map((l, i) => (
                <li key={`${l.at}-${i}`} className="flex gap-3 border-b border-line py-2.5 text-[14px] last:border-0">
                  <span className="w-[62px] shrink-0 font-mono text-[12px] text-ink-muted tabular">{l.at}</span>
                  <span className={cn(l.tone === "bad" ? "text-bad" : l.tone === "warn" ? "text-ink" : "text-ink-soft")}>{l.text}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <LateDialog open={late} onClose={() => setLate(false)} />
    </>
  );
}

/* ------------------------------------------------------------------ current stop */

function CurrentStop({ stop }: { stop: RouteStop }) {
  const run = useRun();
  const router = useRouter();
  const left = useWait(run.arrivedAt, WAIT);
  const [handOff, setHandOff] = useState<string | null>(null);
  const kids = kidsAt(stop);
  const here = Boolean(run.arrivedAt);
  const resolved = stopResolved(run, stop);
  const last = run.current === route.stops.length - 1;
  const school = stop.kind === "school";
  const maps = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${stop.address}, Douglasville, GA`)}`;

  return (
    <section className="overflow-hidden rounded-[22px] border border-line bg-card">
      <div className={cn("p-5 sm:p-6", !here && "bg-bus-400 text-[#1d1a2f]")}>
        <div className="flex items-center justify-between gap-3">
          <span className={cn("mono-label", here ? "text-ink-muted" : "text-[#1d1a2f]/70")}>
            Stop {run.current + 1} of {route.stops.length} · {school ? "Pick up" : stop.kind === "satellite" ? "Satellite lot" : "Drop off"}
          </span>
          <span className={cn("font-mono text-[13px] tabular", here ? "text-ink-muted" : "text-[#1d1a2f]/70")}>{here ? "Arrived" : `ETA ${run.current === 3 ? "3:30 PM" : stop.time}`}</span>
        </div>
        <h2 className="mt-3 font-display text-[32px] font-medium leading-[1.02] tracking-[-0.045em] sm:text-[40px]">{stopName(stop)}</h2>
        <p className={cn("mt-1.5 flex items-center gap-1.5 text-[15px]", here ? "text-ink-muted" : "text-[#1d1a2f]/75")}>
          <MapPin className="size-4" /> {stop.address}
        </p>
        {!here ? (
          <div className="mt-5 flex gap-2">
            <a
              href={maps}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1d1a2f]/[0.08] px-5 text-[15px] font-medium transition-colors hover:bg-[#1d1a2f]/[0.12]"
            >
              <Navigation className="size-4" /> Directions
            </a>
            <button
              type="button"
              onClick={() => run.dispatch({ type: "arrive" })}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#1d1a2f] px-5 text-[16px] font-medium text-white transition-transform active:scale-[0.98]"
            >
              I&apos;m here
            </button>
          </div>
        ) : null}
      </div>

      {here && !school && kids.length ? <WaitTimer left={left ?? WAIT} /> : null}

      {kids.length ? (
        <ul className="border-t border-line">
          {kids.map((id) => (
            <ChildRow key={id} id={id} rec={run.kids[id]} school={school} enabled={here} onHandOff={() => setHandOff(id)} />
          ))}
        </ul>
      ) : (
        <p className="border-t border-line px-5 py-5 text-[14px] text-ink-muted sm:px-6">No riders at this stop today. Wait out the stop window, then move on.</p>
      )}

      <div className="border-t border-line p-4 sm:p-5">
        {here || !kids.length ? (
          resolved ? (
            <SlideToConfirm
              key={stop.id}
              tone={last ? "brand" : "ink"}
              label={last ? "Slide to finish the route" : "Slide to leave this stop"}
              doneLabel={last ? "Route finished" : "On to the next stop"}
              onConfirm={() =>
                setTimeout(() => {
                  run.dispatch({ type: "depart" });
                  if (last) router.push("/route/finish");
                }, 450)
              }
            />
          ) : (
            <p className="flex items-center justify-center gap-2 py-3 text-[14px] text-ink-muted">
              <UserCheck className="size-4" />
              {school ? "Check every child on, or mark them absent" : "Hand each child to an approved adult"}
            </p>
          )
        ) : (
          <p className="py-3 text-center text-[14px] text-ink-muted">Tap “I&apos;m here” when you pull up.</p>
        )}
      </div>

      <HandOffDialog id={handOff} onClose={() => setHandOff(null)} />
    </section>
  );
}

function WaitTimer({ left }: { left: number }) {
  const up = left === 0;
  return (
    <div className={cn("flex items-center gap-4 border-t border-line px-5 py-4 sm:px-6", up && "bg-coral-soft")}>
      <Ring value={left / WAIT} size={52} stroke={5} tone={up ? "bad" : left < 60 ? "warn" : "good"}>
        <Timer className="size-4 text-ink-muted" />
      </Ring>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[24px] font-medium leading-none tabular">{mmss(left)}</p>
        <p className="mt-1 text-[13px] text-ink-muted">
          {up ? "Five minutes are up. If no approved adult is here, alert the office." : "Wait up to five minutes for an approved adult."}
        </p>
      </div>
    </div>
  );
}

function ChildRow({ id, rec, school, enabled, onHandOff }: { id: string; rec: ChildRec; school: boolean; enabled: boolean; onHandOff: () => void }) {
  const run = useRun();
  const c = getChild(id);
  const state = rec?.state ?? "waiting";
  const settled = school ? state === "on" || state === "absent" : state === "off" || state === "held";
  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4 last:border-0 sm:px-6">
      <Avatar seed={c.id} name={c.first} size={44} />
      <div className="min-w-0 flex-1">
        <p className="text-[16px] font-medium">
          {c.first} {c.last}
        </p>
        <p className="text-[13px] text-ink-muted">
          Age {c.age} · {c.grade} grade
        </p>
        {c.medical ? (
          <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-medium text-bad">
            <HeartPulse className="size-3.5" /> {c.medical}
          </p>
        ) : null}
      </div>
      {settled ? (
        <div className="flex items-center gap-2">
          {state === "on" ? (
            <Badge tone="good" dot>
              On board
            </Badge>
          ) : state === "absent" ? (
            <Badge tone="neutral">Absent</Badge>
          ) : state === "held" ? (
            <Badge tone="bad" dot>
              Office alerted
            </Badge>
          ) : (
            <Badge tone="good" icon={<Check className="size-3.5" />}>
              {rec.by?.split(" · ")[0]}
            </Badge>
          )}
          <button
            type="button"
            onClick={() => run.dispatch({ type: "undo", id })}
            aria-label={`Undo for ${c.first}`}
            className="grid size-8 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-raised hover:text-ink"
          >
            <Undo2 className="size-4" />
          </button>
        </div>
      ) : school ? (
        <div className="flex w-full gap-2 sm:w-auto">
          <Button variant="outline" size="md" disabled={!enabled} onClick={() => run.dispatch({ type: "absent", id })} icon={<CircleSlash className="size-4" />} className="flex-1 sm:flex-none">
            Absent
          </Button>
          <Button variant={enabled ? "ink" : "outline"} size="md" disabled={!enabled} onClick={() => run.dispatch({ type: "board", id })} icon={<Check className="size-4" />} className="flex-1 sm:flex-none">
            On board
          </Button>
        </div>
      ) : (
        <Button variant={enabled ? "ink" : "outline"} size="md" disabled={!enabled} onClick={onHandOff} icon={<UserCheck className="size-4" />} className="w-full sm:w-auto">
          Hand off
        </Button>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ hand-off */

function HandOffDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const run = useRun();
  const [pick, setPick] = useState<string | null>(null);
  const [confirmHold, setConfirmHold] = useState(false);
  const c = id ? getChild(id) : null;
  const people = c ? receivers(c) : [];
  const chosen = people.find((p) => p.id === pick);
  const close = () => {
    setPick(null);
    setConfirmHold(false);
    onClose();
  };

  return (
    <Dialog
      open={Boolean(id)}
      onClose={close}
      size="sm"
      icon={<UserCheck className="size-5" />}
      title={c ? `Who's receiving ${c.first}?` : ""}
      description="Only hand a child to someone on this list. Ask for photo ID if you don't know them."
      footer={
        confirmHold ? (
          <>
            <Button variant="soft" size="sm" onClick={() => setConfirmHold(false)}>
              Back
            </Button>
            <Button
              variant="ink"
              size="sm"
              icon={<BellRing className="size-4" />}
              onClick={() => {
                if (id) run.dispatch({ type: "hold", id });
                close();
              }}
            >
              Alert the office
            </Button>
          </>
        ) : (
          <>
            <Button variant="danger" size="sm" icon={<UserRoundX className="size-4" />} onClick={() => setConfirmHold(true)} className="mr-auto">
              No approved adult
            </Button>
            <Button
              variant="ink"
              size="sm"
              disabled={!chosen}
              onClick={() => {
                if (id && chosen) run.dispatch({ type: "handOff", id, by: `${chosen.name} · ${chosen.relationship}` });
                close();
              }}
            >
              {chosen ? `Hand to ${chosen.name.split(" ")[0]}` : "Choose someone"}
            </Button>
          </>
        )
      }
    >
      {confirmHold && c ? (
        <div className="rounded-2xl border border-[color-mix(in_oklab,var(--color-bad)_30%,transparent)] bg-coral-soft p-4">
          <p className="text-[15px] font-medium">{c.first} stays on the van.</p>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-[14px] text-ink-soft">
            <li>The office calls the parent and the approved adults now.</li>
            <li>Keep {c.first} buckled in and carry on with the route.</li>
            <li>The office tells you where to bring {c.first}. Don&apos;t call the family yourself.</li>
          </ul>
        </div>
      ) : (
        <ul className="flex flex-col gap-2" role="radiogroup" aria-label="Approved adults">
          {people.map((p) => {
            const on = pick === p.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPick(p.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors",
                    on ? "border-ink bg-card shadow-[0_0_0_1px_var(--color-ink)]" : "border-line hover:bg-raised/60",
                  )}
                >
                  <Avatar seed={p.seed} name={p.name} size={40} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium">{p.name}</span>
                    <span className="block text-[13px] text-ink-muted">{p.relationship}</span>
                  </span>
                  <span className={cn("grid size-5 place-items-center rounded-full border", on ? "border-ink bg-ink text-cream" : "border-line-strong")}>
                    {on ? <Check className="size-3 stroke-[3]" /> : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Dialog>
  );
}

/* ------------------------------------------------------------------ side panels */

function LiveMap() {
  const run = useRun();
  const i = Math.min(run.current, route.stops.length - 1);
  const cur = route.stops[i];
  const prev = route.stops[Math.max(0, i - 1)];
  const t = run.arrivedAt || run.phase !== "live" ? 1 : 0.6;
  const vx = prev.x + (cur.x - prev.x) * t;
  const vy = prev.y + (cur.y - prev.y) * t;
  return (
    <RouteMap
      className="h-[260px] lg:h-[300px]"
      color={routeColor(route.id)}
      stops={route.stops.map((s, idx) => ({
        id: s.id,
        x: s.x,
        y: s.y,
        label: s.kind === "school" ? "S" : String(idx),
        state: s.kind === "school" ? "school" : run.stopsDone[s.id] ? "done" : idx === run.current ? "next" : "todo",
      }))}
      van={{ x: vx, y: vy, label: van.name }}
    />
  );
}

function stopSteps(run: ReturnType<typeof useRun>): Step[] {
  return route.stops.map((s, idx) => {
    const kids = kidsAt(s);
    const held = kids.some((id) => run.kids[id]?.state === "held");
    const doneAt = run.stopsDone[s.id];
    const names = kids.map((id) => {
      const k = run.kids[id];
      const n = getChild(id).first;
      if (k?.state === "absent") return `${n} (absent)`;
      if (k?.state === "held") return `${n} (on van)`;
      return n;
    });
    return {
      title: stopName(s),
      detail: names.length ? names.join(", ") : "Satellite lot · no riders today",
      meta: doneAt ?? (idx === run.current && run.phase === "live" ? (run.arrivedAt ? "Here" : idx === 3 ? "ETA 3:30" : s.time.replace(" PM", "")) : s.time.replace(" PM", "")),
      state: held ? "alert" : doneAt ? "done" : idx === run.current && run.phase === "live" ? "current" : "todo",
    };
  });
}

function QuickAction({ icon: glyph, label, href, onClick, color }: { icon: React.ReactNode; label: string; href?: string; onClick?: () => void; color: string }) {
  const cls =
    "flex h-[84px] flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-card text-[13px] font-medium text-ink transition-colors hover:bg-raised/60 active:scale-[0.98]";
  const icon = (
    <span className="grid size-8 place-items-center rounded-[10px] [&_svg]:size-4" style={{ background: `color-mix(in oklab, ${color} 12%, var(--color-card))`, color: `color-mix(in oklab, ${color} 80%, var(--color-ink))` }}>
      {glyph}
    </span>
  );
  if (href?.startsWith("/"))
    return (
      <Link href={href} className={cls}>
        {icon}
        {label}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={cls}>
        {icon}
        {label}
      </a>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {icon}
      {label}
    </button>
  );
}

function NotStarted() {
  return (
    <div className="mx-auto max-w-md pt-16 text-center">
      <p className="mono-label text-ink-muted">{route.name}</p>
      <h1 className="mt-3 font-display text-[28px] font-medium tracking-[-0.04em]">Not started yet</h1>
      <p className="mt-2 text-[15px] text-ink-muted">Clock in and do the pre-trip check first. The route opens when the van passes.</p>
      <Button variant="primary" size="lg" href="/start" linkAs={Link} className="mt-6" arrow>
        Clock in and start pre-trip
      </Button>
    </div>
  );
}

function Finished() {
  const run = useRun();
  return (
    <section className="rounded-[22px] bg-bus-400 p-6 text-[#1d1a2f]">
      <p className="mono-label text-[#1d1a2f]/70">{run.phase === "closed" ? `Clocked out ${run.clockOut}` : "Before you clock out"}</p>
      <h2 className="mt-3 font-display text-[32px] font-medium leading-[1.02] tracking-[-0.045em]">{run.phase === "closed" ? "Route closed" : "Walk the van"}</h2>
      <p className="mt-2 text-[15px] text-[#1d1a2f]/75">
        {run.phase === "closed" ? "Every rider is accounted for. Thanks, see you Monday." : "Check every seat and row, then clock out. The route can't close until you do."}
      </p>
      {run.phase !== "closed" ? (
        <Link href="/route/finish" className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-[#1d1a2f] px-6 text-[16px] font-medium text-white">
          Empty-van check <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </section>
  );
}
