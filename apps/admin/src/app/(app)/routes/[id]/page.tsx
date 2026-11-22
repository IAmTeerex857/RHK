import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routes } from "@rhk/fixtures";
import { RouteDetail } from "@/components/routes/route-detail";

export function generateStaticParams() {
  return routes.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: routes.find((r) => r.id === id)?.name ?? "Route" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!routes.some((r) => r.id === id)) notFound();
  return <RouteDetail id={id} />;
}
