import { children, drivers, families, satelliteStops, schools, staff, vans } from "./people";
import { routes, runs } from "./ops";
import { invoices } from "./money";
import type { ID } from "./types";

const by = <T extends { id: ID }>(list: T[]) => {
  const m = new Map(list.map((x) => [x.id, x]));
  return (id: ID | undefined | null) => {
    const hit = id ? m.get(id) : undefined;
    if (!hit && id) throw new Error(`fixtures: unknown id ${id}`);
    return hit as T;
  };
};

export const getChild = by(children);
export const getFamily = by(families);
export const getDriver = by(drivers);
export const getVan = by(vans);
export const getSchool = by(schools);
export const getRoute = by(routes);
export const getRun = by(runs);
export const getStaff = by(staff);
export const getSatellite = by(satelliteStops);

export const childrenOf = (familyId: ID) => children.filter((c) => c.familyId === familyId);
export const invoicesOf = (familyId: ID) => invoices.filter((i) => i.familyId === familyId);
export const runFor = (routeId: ID) => runs.find((r) => r.routeId === routeId);
export const routesFor = (driverId: ID) => routes.filter((r) => r.driverId === driverId);

/** The signed-in people the three apps are previewed as. */
export const ME = {
  admin: staff[0],
  parentFamilyId: "f-johnson",
  parent: families[0].guardians[0],
  driver: drivers[0],
};
