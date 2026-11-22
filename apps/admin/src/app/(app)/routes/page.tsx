import type { Metadata } from "next";
import { RoutesView } from "@/components/routes/routes-view";

export const metadata: Metadata = { title: "Routes" };

export default function Page() {
  return <RoutesView />;
}
