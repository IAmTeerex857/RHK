import type { Metadata } from "next";
import { TrainingView } from "@/components/training-view";

export const metadata: Metadata = { title: "Training" };

export default function Page() {
  return <TrainingView />;
}
