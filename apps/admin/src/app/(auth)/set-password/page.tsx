import type { Metadata } from "next";
import { SetPassword } from "@rhk/ui/shell/auth";

export const metadata: Metadata = { title: "Set your password" };

export default function Page() {
  return <SetPassword app="Office" />;
}
