import type { Metadata } from "next";
import { HoursView } from "@/components/hours-view";

export const metadata: Metadata = { title: "Hours" };

export default function Page() {
  return <HoursView />;
}
