import type { Metadata } from "next";
import { LiveView } from "@/components/live/live-view";

export const metadata: Metadata = { title: "Live map" };

export default function Page() {
  return <LiveView />;
}
