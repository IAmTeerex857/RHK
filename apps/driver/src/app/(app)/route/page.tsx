import type { Metadata } from "next";
import { RouteView } from "@/components/route-view";

export const metadata: Metadata = { title: "Route" };

export default function Page() {
  return <RouteView />;
}
