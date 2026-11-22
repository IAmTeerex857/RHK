import type { Metadata } from "next";
import { SignIn } from "@rhk/ui/shell/auth";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return <SignIn app="Driver" audience="For Rush Hour Kids drivers. The office sets up your account." home="/" />;
}
