import type { Metadata } from "next";
import { AccountView } from "@/components/more-views";

export const metadata: Metadata = { title: "Account" };

export default function Page() {
  return <AccountView />;
}
