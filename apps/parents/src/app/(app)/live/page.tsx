import type { Metadata } from "next";
import { LiveView } from "@/components/live-view";

export const metadata: Metadata = { title: "Live ride" };

export default function Page() {
  return <LiveView />;
}
