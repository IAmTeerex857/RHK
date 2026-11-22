import type { Metadata } from "next";
import { SignIn } from "@rhk/ui/shell/auth";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return <SignIn app="Office" audience="The Rush Hour Kids office: owners and staff only." />;
}
