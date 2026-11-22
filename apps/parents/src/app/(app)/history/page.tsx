import type { Metadata } from "next";
import { HistoryView } from "@/components/more-views";

export const metadata: Metadata = { title: "Ride history" };

export default function Page() {
  return <HistoryView />;
}
