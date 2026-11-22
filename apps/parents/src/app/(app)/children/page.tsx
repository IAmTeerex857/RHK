import type { Metadata } from "next";
import { ChildrenView } from "@/components/children-view";

export const metadata: Metadata = { title: "Children" };

export default function Page() {
  return <ChildrenView />;
}
