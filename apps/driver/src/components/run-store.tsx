"use client";

/*
 * Today's afternoon run, held on the client so every driver screen shares it.
 * It starts where the fixtures put Marcus at 3:24 PM: three stops done, the Johnson stop next.
 * `replay()` rewinds to before clock-in so the whole flow can be walked from the start.
 * The backend will replace this with the run record and its event log.
 */

import { createContext, useContext, useEffect, useMemo, useReducer, useState, useSyncExternalStore, type ReactNode } from "react";
import { getChild, getFamily, getRoute, getVan, ME, runFor, type Child, type RouteStop } from "@rhk/fixtures";

export const ROUTE_ID = "r-pm-2";
export const route = getRoute(ROUTE_ID);
export const van = getVan(route.vanId);
const fixtureRun = runFor(ROUTE_ID)!;

export type ChildState = "waiting" | "on" | "off" | "absent" | "held";
export type ChildRec = { state: ChildState; at?: string; by?: string };
export type Phase = "pre" | "live" | "closing" | "closed";
export type LogEntry = { at: string; text: string; tone?: "good" | "warn" | "bad" };

export type RunState = {
  phase: Phase;
  clockIn?: string;
  clockOut?: string;
  startedAt?: string;
  /** Index of the stop the van is at or heading to. */
  current: number;
  /** Real timestamp (ms) when the driver tapped "I'm here" at the current stop. */
  arrivedAt?: number;
  stopsDone: Record<string, string>;
  kids: Record<string, ChildRec>;
  late?: { minutes: number; reason: string };
  alerts: string[];
  log: LogEntry[];
  odoStart?: number;
  odoEnd?: number;
  fuel?: number;
};

/* ---------------------------------------------------------------- mock clock */

const BASE = new Date("2026-11-20T15:24:00-05:00").getTime();
const fmt = (ms: number) => new Date(ms).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });

/* The mock world starts at 3:24 PM when the page first runs in the browser and keeps ticking. */
let t0 = 0;
const mockMs = () => {
  if (!t0) t0 = Date.now();
  return BASE + (Date.now() - t0);
};
export const nowLabel = () => fmt(mockMs());

const subscribeMinute = (cb: () => void) => {
  const t = setInterval(cb, 5000);
  return () => clearInterval(t);
};

/** Current mock time as "3:24 PM". Renders 3:24 PM on the server, then ticks in the browser. */
export function useMockTime() {
  return useSyncExternalStore(subscribeMinute, nowLabel, () => fmt(BASE));
}

/* ---------------------------------------------------------------- initial state */

const riders = route.stops[0].childIds;

function live(): RunState {
  return {
    phase: "live",
    clockIn: "2:19 PM",
    startedAt: "2:31 PM",
    current: 3,
    stopsDone: { "pm2-s0": "2:44 PM", "pm2-s1": "3:05 PM", "pm2-s2": "3:16 PM" },
    kids: {
      "c-maya": { state: "on", at: "2:42 PM" },
      "c-eli": { state: "on", at: "2:42 PM" },
      "c-nia": { state: "on", at: "2:43 PM" },
      "c-kai": { state: "off", at: "3:05 PM", by: "Bao Tran · Grandfather" },
      "c-leo": { state: "off", at: "3:16 PM", by: "Sofia Martinez · Parent" },
    },
    late: { minutes: 2, reason: "Traffic" },
    alerts: [],
    odoStart: 39876,
    fuel: 0.5,
    log: [
      { at: "3:16 PM", text: "Leo handed to Sofia Martinez", tone: "good" },
      { at: "3:05 PM", text: "Kai handed to Bao Tran", tone: "good" },
      { at: "2:44 PM", text: "Left Pine Ridge Elementary with 5 on board" },
      { at: "2:31 PM", text: "Route started" },
      { at: "2:19 PM", text: "Clocked in · pre-trip check passed" },
    ],
  };
}

function fresh(): RunState {
  return {
    phase: "pre",
    current: 0,
    stopsDone: {},
    kids: Object.fromEntries(riders.map((id) => [id, { state: "waiting" as ChildState }])),
    alerts: [],
    log: [],
  };
}

/* ---------------------------------------------------------------- reducer */

type Action =
  | { type: "clockIn" }
  | { type: "start"; odo: number; fuel: number }
  | { type: "arrive" }
  | { type: "board"; id: string }
  | { type: "absent"; id: string }
  | { type: "handOff"; id: string; by: string }
  | { type: "hold"; id: string }
  | { type: "undo"; id: string }
  | { type: "depart" }
  | { type: "late"; minutes: number; reason: string }
  | { type: "close" }
  | { type: "clockOut"; odo: number }
  | { type: "replay" }
  | { type: "resume" };

const first = (id: string) => getChild(id).first;

function reducer(s: RunState, a: Action): RunState {
  const at = nowLabel();
  const log = (text: string, tone?: LogEntry["tone"]) => [{ at, text, tone }, ...s.log];
  switch (a.type) {
    case "clockIn":
      return { ...s, clockIn: at, log: log("Clocked in") };
    case "start":
      return { ...s, phase: "live", startedAt: at, odoStart: a.odo, fuel: a.fuel, log: log("Route started") };
    case "arrive":
      return { ...s, arrivedAt: Date.now(), log: log(`Arrived at ${stopName(route.stops[s.current])}`) };
    case "board":
      return { ...s, kids: { ...s.kids, [a.id]: { state: "on", at } }, log: log(`${first(a.id)} on board`) };
    case "absent":
      return { ...s, kids: { ...s.kids, [a.id]: { state: "absent", at } }, log: log(`${first(a.id)} marked absent · office told`, "warn") };
    case "handOff":
      return { ...s, kids: { ...s.kids, [a.id]: { state: "off", at, by: a.by } }, log: log(`${first(a.id)} handed to ${a.by.split(" · ")[0]}`, "good") };
    case "hold":
      return {
        ...s,
        kids: { ...s.kids, [a.id]: { state: "held", at } },
        alerts: [...s.alerts, a.id],
        log: log(`No approved adult for ${first(a.id)} · office alerted, staying on the van`, "bad"),
      };
    case "undo": {
      const stop = route.stops[s.current];
      const back: ChildState = stop.kind === "school" ? "waiting" : "on";
      return { ...s, kids: { ...s.kids, [a.id]: { state: back } }, alerts: s.alerts.filter((x) => x !== a.id) };
    }
    case "depart": {
      const stop = route.stops[s.current];
      const next = s.current + 1;
      const onBoard = Object.values(s.kids).filter((k) => k.state === "on" || k.state === "held").length;
      const text = stop.kind === "school" ? `Left ${stopName(stop)} with ${onBoard} on board` : `Left ${stopName(stop)}`;
      return {
        ...s,
        stopsDone: { ...s.stopsDone, [stop.id]: at },
        current: next,
        arrivedAt: undefined,
        phase: next >= route.stops.length ? "closing" : s.phase,
        log: log(text),
      };
    }
    case "late":
      return { ...s, late: { minutes: a.minutes, reason: a.reason }, log: log(`Running ${a.minutes} min late · ${a.reason.toLowerCase()}`, "warn") };
    case "close":
      return { ...s, phase: "closing", current: route.stops.length };
    case "clockOut":
      return { ...s, phase: "closed", clockOut: at, odoEnd: a.odo, log: log("Empty-van check done · clocked out", "good") };
    case "replay":
      return fresh();
    case "resume":
      return live();
  }
}

/* ---------------------------------------------------------------- helpers */

export const stopName = (s: RouteStop) => (s.kind === "home" ? `${s.label} home` : s.label);

/** Who may receive a child at home: the family's guardians, then the approved adults. Names only. */
export function receivers(c: Child) {
  const fam = getFamily(c.familyId);
  return [
    ...fam.guardians.map((g) => ({ id: g.id, name: g.name, relationship: "Parent", seed: g.id })),
    ...c.approvedAdults.map((a) => ({ id: a.id, name: a.name, relationship: a.relationship, seed: a.id })),
  ];
}

/** Children handled at a stop: picked up at school, dropped at homes and satellite lots. */
export function kidsAt(stop: RouteStop) {
  if (stop.kind === "school") return stop.childIds;
  if (stop.kind === "satellite") return [];
  return stop.childIds;
}

export function stopResolved(s: RunState, stop: RouteStop) {
  return kidsAt(stop).every((id) => {
    const k = s.kids[id]?.state;
    return stop.kind === "school" ? k === "on" || k === "absent" : k === "off" || k === "held";
  });
}

/* ---------------------------------------------------------------- context */

type Store = RunState & {
  dispatch: (a: Action) => void;
  onBoard: string[];
  stop: RouteStop | undefined;
  stopIndex: number;
  progress: number;
};

const Ctx = createContext<Store | null>(null);

export function RunProvider({ children }: { children: ReactNode }) {
  const [s, dispatch] = useReducer(reducer, undefined, live);
  const value = useMemo<Store>(() => {
    const onBoard = Object.entries(s.kids)
      .filter(([, k]) => k.state === "on" || k.state === "held")
      .map(([id]) => id);
    return {
      ...s,
      dispatch,
      onBoard,
      stop: route.stops[s.current],
      stopIndex: s.current,
      progress: Object.keys(s.stopsDone).length / route.stops.length,
    };
  }, [s]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRun() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useRun must be used inside <RunProvider>");
  return v;
}

/** Seconds left on the five-minute wait at the current stop (null before arrival). */
export function useWait(arrivedAt?: number, limit = 300) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!arrivedAt) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [arrivedAt]);
  if (!arrivedAt) return null;
  const elapsed = Math.max(0, Math.floor(((now || arrivedAt) - arrivedAt) / 1000));
  return Math.max(0, limit - elapsed);
}

export const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

export const me = ME.driver;
export { fixtureRun };
