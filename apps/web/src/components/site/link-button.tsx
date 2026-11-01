"use client";

import Link from "next/link";
import { Button, type ButtonProps } from "@rhk/ui/components/button";

/** Button that navigates with Next.js client-side routing. Safe to use from server components. */
export function LinkButton(props: Omit<ButtonProps, "linkAs"> & { href: string }) {
  return <Button {...props} linkAs={Link} />;
}
