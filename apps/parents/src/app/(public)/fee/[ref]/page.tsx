import type { Metadata } from "next";
import { applications } from "@rhk/fixtures";
import { FeeView } from "@/components/fee-view";

export const metadata: Metadata = { title: "Application fee" };

export function generateStaticParams() {
  return applications.filter((a) => a.feeRequestedOn).map((a) => ({ ref: a.ref }));
}

export default async function Page({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  return <FeeView reference={ref} />;
}
