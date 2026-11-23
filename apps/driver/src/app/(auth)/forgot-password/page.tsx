import type { Metadata } from "next";
import { ForgotPassword } from "@rhk/ui/shell/auth";

export const metadata: Metadata = { title: "Forgot password" };

export default function Page() {
  return <ForgotPassword app="Driver" />;
}
