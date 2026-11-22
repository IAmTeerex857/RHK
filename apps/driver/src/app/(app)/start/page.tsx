import type { Metadata } from "next";
import { StartView } from "@/components/start-view";

export const metadata: Metadata = { title: "Pre-trip" };

export default function Page() {
  return <StartView />;
}
