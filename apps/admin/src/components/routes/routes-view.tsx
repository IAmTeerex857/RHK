"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock3, Gauge, MapPin, Plus, School as SchoolIcon } from "lucide-react";
import { drivers, getDriver, getSchool, getVan, routes, runFor, satelliteStops, schools, vans, type SatelliteStop, type School } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Badge } from "@rhk/ui/components/badge";
import { EmptyState } from "@rhk/ui/components/blocks";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader } from "@rhk/ui/components/card";
import { FlowRouter } from "@rhk/ui/components/flow";
import { routeColor } from "@rhk/ui/lib/route-color";
import { SegmentBar } from "@rhk/ui/components/charts";
import { ChoiceChips, Select, Switch } from "@rhk/ui/components/controls";
import { Dialog } from "@rhk/ui/components/dialog";
import { Field } from "@rhk/ui/components/field";
import { toast } from "@rhk/ui/components/toast";
import { cn } from "@rhk/ui/lib/cn";
import { Segmented, Tabs } from "@rhk/ui/components/segmented";
import { DataTable } from "@rhk/ui/components/table";
import { PageHeader } from "@rhk/ui/shell/app-shell";

export function RoutesView() {
  const [tab, setTab] = useState<"routes" | "schools" | "stops">("routes");
  const [slot, setSlot] = useState<"am" | "pm">("pm");
  const [active, setActive] = useState<Record<string, boolean>>(Object.fromEntries(satelliteStops.map((s) => [s.id, s.active])));
  const [schoolList, setSchoolList] = useState<School[]>(schools);
  const [stopList, setStopList] = useState<SatelliteStop[]>(satelliteStops);
  const [drafts, setDrafts] = useState<{ id: string; name: string; slot: "am" | "pm"; vanId: string; driverId: string; schoolIds: string[] }[]>([]);
  const [dialog, setDialog] = useState<null | "route" | "school" | "stop">(null);
  const [turningOff, setTurningOff] = useState<SatelliteStop | null>(null);
  const [moveTo, setMoveTo] = useState("");
  const [err, setErr] = useState<string | undefined>();
  const nextRouteNo = new Set(routes.map((r) => r.name.split(" · ")[0])).size + drafts.length + 1;
  const [nr, setNr] = useState({ slot: "pm" as "am" | "pm", vanId: vans[0].id, driverId: drivers[0].id, schoolIds: [] as string[] });
  const [ns, setNs] = useState({ name: "", short: "", address: "", city: "", bellAm: "", bellPm: "" });
  const [nst, setNst] = useState({ name: "", address: "", windowAm: "", windowPm: "" });
  const close = () => {
    setDialog(null);
    setErr(undefined);
  };

  const createRoute = () => {
    if (!nr.schoolIds.length) return setErr("Pick at least one school.");
    const name = `Route ${nextRouteNo}`;
    setDrafts((d) => [...d, { id: `draft-${Date.now()}`, name, ...nr }]);
    toast(`${name} created`, { body: "Add children to it from their schedules to build its stops." });
    setNr((x) => ({ ...x, schoolIds: [] }));
    setSlot(nr.slot);
    close();
  };
  const addSchool = () => {
    if (!ns.name.trim() || !ns.address.trim() || !ns.city.trim()) return setErr("Name, address and city are needed.");
    setSchoolList((l) => [...l, { id: `s-${Date.now()}`, name: ns.name.trim(), short: ns.short.trim() || ns.name.trim().split(" ")[0], address: ns.address.trim(), city: ns.city.trim(), bellAm: ns.bellAm || "Not set", bellPm: ns.bellPm || "Not set", children: 0 }]);
    toast(`${ns.name.trim()} added`);
    setNs({ name: "", short: "", address: "", city: "", bellAm: "", bellPm: "" });
    close();
  };
  const addStop = () => {
    if (!nst.name.trim() || !nst.address.trim()) return setErr("A name and an address are needed.");
    const id = `sat-${Date.now()}`;
    setStopList((l) => [...l, { id, name: nst.name.trim(), address: nst.address.trim(), windowAm: nst.windowAm || "Not used", windowPm: nst.windowPm || "Not used", active: true, children: 0 }]);
    setActive((a) => ({ ...a, [id]: true }));
    toast(`${nst.name.trim()} added`, { body: "Families can be moved to it from their schedule." });
    setNst({ name: "", address: "", windowAm: "", windowPm: "" });
    close();
  };
  const toggleStop = (st: SatelliteStop, on: boolean) => {
    if (!on && st.children > 0) {
      setMoveTo(stopList.find((x) => x.id !== st.id && active[x.id])?.id ?? "");
      return setTurningOff(st);
    }
    setActive((a) => ({ ...a, [st.id]: on }));
    toast(on ? `${st.name} is in use again` : `${st.name} turned off`);
  };

  return (
    <>
      <PageHeader
        title="Routes"
        description="Each van runs a morning and an afternoon route. Stops, order and riders come from each child's year schedule."
        actions={
          <Button variant="ink" size="sm" icon={<Plus className="size-4" />} onClick={() => setDialog(tab === "routes" ? "route" : tab === "schools" ? "school" : "stop")}>
            {tab === "routes" ? "New route" : tab === "schools" ? "Add school" : "Add satellite stop"}
          </Button>
        }
      />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <Tabs
          value={tab}
          onChange={setTab}
          options={[
            { value: "routes", label: "Routes", count: routes.length },
            { value: "schools", label: "Schools", count: schoolList.length },
            { value: "stops", label: "Satellite stops", count: stopList.length },
          ]}
        />
        {tab === "routes" ? (
          <Segmented
            size="sm"
            value={slot}
            onChange={setSlot}
            options={[
              { value: "am", label: "Morning" },
              { value: "pm", label: "Afternoon" },
            ]}
          />
        ) : null}
      </div>

      {tab === "routes" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {routes
            .filter((r) => r.slot === slot)
            .map((r) => {
              const van = getVan(r.vanId);
              const d = getDriver(r.driverId);
              const riders = new Set(r.stops.flatMap((s) => s.childIds)).size;
              return (
                <Link key={r.id} href={`/routes/${r.id}`} className="group">
                  <Card className="h-full transition-[border-color,box-shadow] group-hover:border-line-strong group-hover:shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 font-display text-[18px] font-medium tracking-[-0.02em]">
                          <span className="size-2.5 rounded-[3px]" style={{ background: routeColor(r.id) }} aria-hidden />
                          {r.name.split(" · ")[0]}
                        </p>
                        <p className="mt-0.5 text-[13px] text-ink-muted">{r.schoolIds.map((s) => getSchool(s).short).join(", ")}</p>
                      </div>
                      <Badge tone={van.status === "in_service" ? "neutral" : "warn"}>{van.name}</Badge>
                    </div>
                    <div className="mt-5 flex items-center gap-2.5">
                      <Avatar seed={d.id} name={d.name} size={28} />
                      <span className="text-[14px]">{d.name}</span>
                    </div>
                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-[13px] text-ink-muted">
                        <span>Seats</span>
                        <span className="font-mono tabular">
                          {riders}/{van.capacity}
                        </span>
                      </div>
                      <SegmentBar value={riders} total={van.capacity} color={routeColor(r.id)} size="sm" label="Seats used" />
                    </div>
                    <dl className="mt-5 grid grid-cols-[0.7fr_1.4fr_0.8fr] gap-3 border-t border-line pt-4 text-[13px]">
                      <div>
                        <dt className="flex items-center gap-1 text-ink-muted">
                          <MapPin className="size-3.5" /> Stops
                        </dt>
                        <dd className="mt-1 font-mono text-[14px] tabular">{r.stops.length}</dd>
                      </div>
                      <div>
                        <dt className="flex items-center gap-1 text-ink-muted">
                          <Clock3 className="size-3.5" /> Window
                        </dt>
                        <dd className="mt-1 whitespace-nowrap font-mono text-[14px] tabular">{r.start.replace(" PM", "").replace(" AM", "")}–{r.end.replace(" PM", "").replace(" AM", "")}</dd>
                      </div>
                      <div>
                        <dt className="flex items-center gap-1 text-ink-muted">
                          <Gauge className="size-3.5" /> Miles
                        </dt>
                        <dd className="mt-1 font-mono text-[14px] tabular">{r.miles}</dd>
                      </div>
                    </dl>
                  </Card>
                </Link>
              );
            })}
          {drafts
            .filter((r) => r.slot === slot)
            .map((r) => (
              <Card key={r.id} className="h-full border-dashed">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-[18px] font-medium tracking-[-0.02em]">{r.name}</p>
                    <p className="mt-0.5 text-[13px] text-ink-muted">{r.schoolIds.map((s) => schoolList.find((x) => x.id === s)?.short).join(", ")}</p>
                  </div>
                  <Badge>New</Badge>
                </div>
                <div className="mt-5 flex items-center gap-2.5">
                  <Avatar seed={r.driverId} name={getDriver(r.driverId).name} size={28} />
                  <span className="text-[14px]">{getDriver(r.driverId).name}</span>
                </div>
                <p className="mt-5 border-t border-line pt-4 text-[13px] text-ink-muted">{getVan(r.vanId).name} · no stops yet</p>
              </Card>
            ))}
          <Dispatch slot={slot} />
        </div>
      ) : tab === "schools" ? (
        <Card flush>
          <DataTable
            rows={schoolList}
            empty={<EmptyState icon={<SchoolIcon />} title="No schools yet" body="Add the schools your routes serve, with their bell times." />}
            rowKey={(s) => s.id}
            columns={[
              {
                key: "name",
                header: "School",
                cell: (s) => (
                  <span className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-raised">
                      <SchoolIcon className="size-4" />
                    </span>
                    <span>
                      <span className="block font-medium">{s.name}</span>
                      <span className="block text-[13px] text-ink-muted">
                        {s.address}, {s.city}
                      </span>
                    </span>
                  </span>
                ),
              },
              { key: "am", header: "Morning bell", cell: (s) => <span className="font-mono tabular">{s.bellAm}</span>, hideBelow: "sm" },
              { key: "pm", header: "Release", cell: (s) => <span className="font-mono tabular">{s.bellPm}</span>, hideBelow: "sm" },
              { key: "routes", header: "Routes", cell: (s) => routes.filter((r) => r.schoolIds.includes(s.id)).map((r) => r.name.split(" · ")[0]).filter((v, i, a) => a.indexOf(v) === i).join(", "), hideBelow: "md" },
              { key: "kids", header: "Children", align: "right", cell: (s) => <span className="font-mono tabular">{s.children}</span> },
            ]}
          />
        </Card>
      ) : (
        <Card flush>
          <DataTable
            rows={stopList}
            empty={<EmptyState icon={<MapPin />} title="No satellite stops" body="Add a meeting point families can use instead of home." />}
            rowKey={(s) => s.id}
            columns={[
              {
                key: "name",
                header: "Stop",
                cell: (s) => (
                  <span>
                    <span className="block font-medium">{s.name}</span>
                    <span className="block text-[13px] text-ink-muted">{s.address}</span>
                  </span>
                ),
              },
              { key: "am", header: "Morning", cell: (s) => <span className="font-mono text-[13px] tabular">{s.windowAm}</span>, hideBelow: "md" },
              { key: "pm", header: "Afternoon", cell: (s) => <span className="font-mono text-[13px] tabular">{s.windowPm}</span>, hideBelow: "md" },
              { key: "kids", header: "Children", align: "right", cell: (s) => <span className="font-mono tabular">{s.children}</span>, hideBelow: "sm" },
              {
                key: "on",
                header: "In use",
                align: "right",
                cell: (s) => <Switch checked={active[s.id]} onChange={(v) => toggleStop(s, v)} />,
              },
            ]}
          />
          <p className="border-t border-line px-5 py-3 text-[13px] text-ink-muted">Turning a stop off asks you to move its children to another stop first. Parents are told by email and push.</p>
        </Card>
      )}

      <Dialog
        open={dialog === "route"}
        onClose={close}
        icon={<Plus className="size-5" />}
        title={`New route: Route ${nextRouteNo}`}
        description="Pick the run, van, driver and schools. Stops come from the children you add to it."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={close}>
              Cancel
            </Button>
            <Button variant="ink" size="sm" onClick={createRoute}>
              Create route
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-[13px] font-medium text-ink-soft">Run</p>
            <ChoiceChips
              size="sm"
              value={nr.slot}
              onChange={(v) => setNr((x) => ({ ...x, slot: v }))}
              options={[
                { value: "am", label: "Morning" },
                { value: "pm", label: "Afternoon" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select label="Van" value={nr.vanId} onChange={(e) => setNr((x) => ({ ...x, vanId: e.target.value }))}>
              {vans.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} · {v.capacity} seats
                </option>
              ))}
            </Select>
            <Select label="Driver" value={nr.driverId} onChange={(e) => setNr((x) => ({ ...x, driverId: e.target.value }))}>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <p className="mb-2 text-[13px] font-medium text-ink-soft">Schools</p>
            <div className="flex flex-wrap gap-2">
              {schoolList.map((sc) => {
                const on = nr.schoolIds.includes(sc.id);
                return (
                  <button
                    key={sc.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setNr((x) => ({ ...x, schoolIds: on ? x.schoolIds.filter((i) => i !== sc.id) : [...x.schoolIds, sc.id] }))}
                    className={cn(
                      "inline-flex h-8 items-center rounded-full border px-3 text-[13px] font-medium transition-colors",
                      on ? "border-ink bg-ink text-cream" : "border-line-strong bg-card text-ink hover:bg-raised",
                    )}
                  >
                    {sc.short}
                  </button>
                );
              })}
            </div>
            {err ? <p className="mt-2 text-[13px] font-medium text-bad">{err}</p> : null}
          </div>
        </div>
      </Dialog>

      <Dialog
        open={dialog === "school"}
        onClose={close}
        icon={<SchoolIcon className="size-5" />}
        title="Add a school"
        description="Bell times set when vans need to arrive and leave."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={close}>
              Cancel
            </Button>
            <Button variant="ink" size="sm" onClick={addSchool}>
              Add school
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="School name" className="sm:col-span-2" value={ns.name} onChange={(e) => setNs((x) => ({ ...x, name: e.target.value }))} />
          <Field label="Short name" hint="Shown on route cards" value={ns.short} onChange={(e) => setNs((x) => ({ ...x, short: e.target.value }))} />
          <Field label="City" value={ns.city} onChange={(e) => setNs((x) => ({ ...x, city: e.target.value }))} />
          <Field label="Street address" className="sm:col-span-2" value={ns.address} onChange={(e) => setNs((x) => ({ ...x, address: e.target.value }))} />
          <Field label="Morning bell" type="time" value={ns.bellAm} onChange={(e) => setNs((x) => ({ ...x, bellAm: e.target.value }))} />
          <Field label="Release" type="time" value={ns.bellPm} onChange={(e) => setNs((x) => ({ ...x, bellPm: e.target.value }))} />
        </div>
        {err ? <p className="mt-3 text-[13px] font-medium text-bad">{err}</p> : null}
      </Dialog>

      <Dialog
        open={dialog === "stop"}
        onClose={close}
        icon={<MapPin className="size-5" />}
        title="Add a satellite stop"
        description="A meeting point families can use instead of home pickup or drop-off."
        footer={
          <>
            <Button variant="soft" size="sm" onClick={close}>
              Cancel
            </Button>
            <Button variant="ink" size="sm" onClick={addStop}>
              Add stop
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Name" className="sm:col-span-2" value={nst.name} onChange={(e) => setNst((x) => ({ ...x, name: e.target.value }))} />
          <Field label="Address" className="sm:col-span-2" value={nst.address} onChange={(e) => setNst((x) => ({ ...x, address: e.target.value }))} />
          <Field label="Morning window" hint="For example 6:50 to 7:00 AM" value={nst.windowAm} onChange={(e) => setNst((x) => ({ ...x, windowAm: e.target.value }))} />
          <Field label="Afternoon window" hint="Leave empty if not used" value={nst.windowPm} onChange={(e) => setNst((x) => ({ ...x, windowPm: e.target.value }))} />
        </div>
        {err ? <p className="mt-3 text-[13px] font-medium text-bad">{err}</p> : null}
      </Dialog>

      <Dialog
        open={Boolean(turningOff)}
        onClose={() => setTurningOff(null)}
        size="sm"
        icon={<MapPin className="size-5" />}
        title={turningOff ? `Turn off ${turningOff.name}?` : ""}
        description={turningOff ? `${turningOff.children} ${turningOff.children === 1 ? "child uses" : "children use"} this stop. Move them first. Their parents are told by email and push.` : undefined}
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setTurningOff(null)}>
              Cancel
            </Button>
            <Button
              variant="ink"
              size="sm"
              disabled={!moveTo}
              onClick={() => {
                if (!turningOff) return;
                const to = stopList.find((x) => x.id === moveTo)!;
                setStopList((l) => l.map((x) => (x.id === turningOff.id ? { ...x, children: 0 } : x.id === to.id ? { ...x, children: x.children + turningOff.children } : x)));
                setActive((a) => ({ ...a, [turningOff.id]: false }));
                toast(`${turningOff.name} turned off`, { body: `${turningOff.children} moved to ${to.name}. Parents notified.` });
                setTurningOff(null);
              }}
            >
              Move and turn off
            </Button>
          </>
        }
      >
        {stopList.some((x) => turningOff && x.id !== turningOff.id && active[x.id]) ? (
          <Select label="Move them to" value={moveTo} onChange={(e) => setMoveTo(e.target.value)}>
            {stopList
              .filter((x) => turningOff && x.id !== turningOff.id && active[x.id])
              .map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
          </Select>
        ) : (
          <p className="text-[14px] text-ink-muted">There&apos;s no other satellite stop in use. Add one first, or move these children to home stops from their schedules.</p>
        )}
      </Dialog>
    </>
  );
}

/** Riders fanning out from the schools (afternoon) or into them (morning), one curve per route. */
function Dispatch({ slot }: { slot: "am" | "pm" }) {
  const list = routes.filter((r) => r.slot === slot);
  const total = new Set(list.flatMap((r) => r.stops.flatMap((s) => s.childIds))).size;
  const status = (id: string) => {
    const run = runFor(id);
    if (slot === "am") return "Done";
    if (!run) return "Not started";
    if (run.status === "late") return `${run.lateMinutes} min late`;
    if (run.status === "not_started") return "Starts soon";
    return run.lateMinutes ? `${run.lateMinutes} min behind` : "On time";
  };
  return (
    <Card className="md:col-span-2 xl:col-span-4">
      <CardHeader
        title={slot === "pm" ? "Afternoon dispatch" : "Morning dispatch"}
        subtitle={slot === "pm" ? `${total} riders leave ${schools.length} schools on ${list.length} vans` : `${total} riders picked up from home on ${list.length} vans`}
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <FlowRouter
          height={240}
          labelWidth={210}
          source={{ label: slot === "pm" ? "Schools" : "Homes", sub: slot === "pm" ? "Release 2:40 – 3:25 PM" : "From 6:40 AM" }}
          targets={list.map((r) => {
            const riders = new Set(r.stops.flatMap((s) => s.childIds)).size;
            const run = runFor(r.id);
            return {
              id: r.id,
              label: r.name.split(" · ")[0],
              sub: `${getVan(r.vanId).name} · ${getDriver(r.driverId).name.split(" ")[0]}`,
              value: riders,
              valueLabel: slot === "pm" && run ? `${run.onBoard}/${riders} on` : `${riders} riders`,
              color: routeColor(r.id),
              muted: slot === "pm" && run?.status === "not_started",
            };
          })}
        />
        <div className="rounded-2xl bg-raised/60 p-4">
          <div className="grid grid-cols-[1fr_72px_64px] gap-3 pb-2 text-[12px] text-ink-muted">
            <span>Route</span>
            <span>Share</span>
            <span className="text-right">Stops</span>
          </div>
          {list.map((r) => {
            const riders = new Set(r.stops.flatMap((s) => s.childIds)).size;
            const run = runFor(r.id);
            const done = slot === "am" ? r.stops.length : (run?.stops.filter((x) => x.state === "done").length ?? 0);
            return (
              <Link key={r.id} href={`/routes/${r.id}`} className="grid grid-cols-[1fr_72px_64px] items-center gap-3 border-t border-line py-2.5 text-[14px] transition-colors hover:text-ink">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="size-2 shrink-0 rounded-full" style={{ background: routeColor(r.id) }} aria-hidden />
                  <span className="truncate">{r.name.split(" · ")[0]}</span>
                  <span className="truncate text-[13px] text-ink-muted">{status(r.id)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 flex-1 rounded-full bg-line">
                    <span className="block h-full rounded-full" style={{ width: `${(riders / total) * 100}%`, background: routeColor(r.id) }} />
                  </span>
                </span>
                <span className="text-right font-mono text-[13px] text-ink-muted tabular">
                  {done}/{r.stops.length}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
