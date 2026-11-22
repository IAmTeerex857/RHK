const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usd0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** $142.50, or $3,415 with `whole`. */
export const money = (n: number, whole = false) => (whole ? usd0 : usd).format(n);

export const pct = (n: number, digits = 1) => `${(n * 100).toFixed(digits)}%`;

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const weekdayShort = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri" } as const;

export const serviceLabel = { both: "Before and after school", pm: "After school only", am: "Before school only" } as const;
