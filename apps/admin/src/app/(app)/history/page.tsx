import type { Metadata } from "next";
import { HistoryView } from "@/components/reports/history-view";

export const metadata: Metadata = { title: "Change history" };

export default function Page() {
  return <HistoryView />;
}
