import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { drivers } from "@rhk/fixtures";
import { DriverDetail } from "@/components/drivers/driver-detail";

export function generateStaticParams() {
  return drivers.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: drivers.find((d) => d.id === id)?.name ?? "Driver" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!drivers.some((d) => d.id === id)) notFound();
  return <DriverDetail id={id} />;
}
