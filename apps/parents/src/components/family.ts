/*
 * The signed-in family (the Johnsons) and their live afternoon ride, from the shared fixtures.
 * Parents only ever see their own stop, their own children, and the driver's name, photo and van.
 */

import { useSyncExternalStore } from "react";
import { childrenOf, getDriver, getFamily, getRoute, getSchool, getVan, invoicesOf, ME, runFor } from "@rhk/fixtures";

export const family = getFamily(ME.parentFamilyId);
export const parent = ME.parent;
export const kids = childrenOf(family.id);
export const school = getSchool(kids[0].schoolId);

export const pmRoute = getRoute(kids[0].pmRouteId!);
export const amRoute = getRoute(kids[0].amRouteId!);
export const run = runFor(pmRoute.id)!;
export const driver = getDriver(run.driverId);
export const van = getVan(pmRoute.vanId);

export const homeStop = pmRoute.stops.find((s) => s.kind === "home" && s.childIds.includes(kids[0].id))!;
export const schoolStop = pmRoute.stops.find((s) => s.kind === "school")!;
export const amHome = amRoute.stops.find((s) => s.kind === "home" && s.childIds.includes(kids[0].id))!;
export const amSchool = amRoute.stops.find((s) => s.kind === "school")!;

/** Stops still to come before ours, counted without naming them (other families' homes stay private). */
const order = pmRoute.stops.findIndex((s) => s.id === homeStop.id);
export const stopsBefore = run.stops.slice(0, order).filter((s) => s.state !== "done").length;
export const progress = run.stops.slice(0, order + 1).filter((s) => s.state === "done").length / (order + 1);

export const bills = invoicesOf(family.id);
export const openBill = bills.find((b) => b.status === "open" || b.status === "overdue" || b.status === "partial");

export const first = (names: string[]) => (names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`);
export const kidNames = first(kids.map((k) => k.first));

/* ---------------------------------------------------------------- mock clock */

const BASE = new Date("2026-11-20T15:24:00-05:00").getTime();
const ETA = new Date("2026-11-20T15:30:00-05:00").getTime();
let t0 = 0;
const mockMs = () => {
  if (!t0) t0 = Date.now();
  return BASE + (Date.now() - t0);
};
const sub = (cb: () => void) => {
  const t = setInterval(cb, 5000);
  return () => clearInterval(t);
};
const fmt = (ms: number) => new Date(ms).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });

/** Mock "now" as "3:24 PM": 3:24 PM on the server, ticking in the browser. */
export function useNow() {
  return useSyncExternalStore(sub, () => fmt(mockMs()), () => fmt(BASE));
}

/** Whole minutes until the van reaches the Johnson home (6 at 3:24 PM). */
export function useMinutesAway() {
  return useSyncExternalStore(
    sub,
    () => Math.max(0, Math.ceil((ETA - mockMs()) / 60000)),
    () => Math.ceil((ETA - BASE) / 60000),
  );
}

export const ETA_LABEL = "3:30 PM";
