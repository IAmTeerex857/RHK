import type { Metadata } from "next";
import { FinishView } from "@/components/finish-view";

export const metadata: Metadata = { title: "Close the route" };

export default function Page() {
  return <FinishView />;
}
