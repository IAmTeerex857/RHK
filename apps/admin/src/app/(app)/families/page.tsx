import type { Metadata } from "next";
import { FamiliesView } from "@/components/families/families-view";

export const metadata: Metadata = { title: "Families" };

export default function Page() {
  return <FamiliesView />;
}
