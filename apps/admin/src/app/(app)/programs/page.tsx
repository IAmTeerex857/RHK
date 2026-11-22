import type { Metadata } from "next";
import { ProgramsView } from "@/components/programs/programs-view";

export const metadata: Metadata = { title: "Trips & programs" };

export default function Page() {
  return <ProgramsView />;
}
