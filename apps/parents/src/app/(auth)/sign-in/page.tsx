import type { Metadata } from "next";
import { SignIn } from "@rhk/ui/shell/auth";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return <SignIn session="30 days" app="Parents" audience="For Rush Hour Kids families. Use the email the office has on file." home="/" />;
}
