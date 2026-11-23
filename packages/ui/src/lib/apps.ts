/*
 * Where each portal lives, and how to reach the office. The custom subdomains (admin., driver.,
 * parent.) are not attached yet, so the Vercel URLs are the defaults; set the NEXT_PUBLIC_*_URL
 * variables once DNS is in place.
 */

export type AppName = "Office" | "Driver" | "Parents";

/* Next.js replaces process.env.NEXT_PUBLIC_* at build time; this package has no Node types. */
declare const process: { env: Record<string, string | undefined> };

export const APP_URLS: Record<AppName, string> = {
  Office: process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://rhk-admin.vercel.app",
  Driver: process.env.NEXT_PUBLIC_DRIVER_URL ?? "https://rhk-driver.vercel.app",
  Parents: process.env.NEXT_PUBLIC_PARENTS_URL ?? "https://rhk-parents.vercel.app",
};

/** The office's public phone number (from the marketing site). */
export const OFFICE_PHONE = { label: "(404) 427-6780", href: "tel:+14044276780" };
