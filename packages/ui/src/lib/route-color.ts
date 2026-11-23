/**
 * One colour per van route, from the --color-route-N tokens. Route ids end in the route
 * number ("r-pm-2"), and names start with it ("Route 2 · Afternoon"); either works.
 */
export function routeNumber(idOrName: string) {
  const m = idOrName.match(/(\d+)(?!.*\d)/) ?? idOrName.match(/Route (\d+)/);
  return m ? Number(m[1]) : 1;
}

export const routeColor = (idOrName: string) => `var(--color-route-${((routeNumber(idOrName) - 1) % 4) + 1})`;
