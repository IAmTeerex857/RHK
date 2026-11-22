import type { Metadata } from "next";
import { TripsView } from "@/components/more-views";

export const metadata: Metadata = { title: "Trips & programs" };

export default function Page() {
  return <TripsView />;
}
