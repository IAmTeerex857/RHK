import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { families } from "@rhk/fixtures";
import { FamilyDetail } from "@/components/families/family-detail";

export function generateStaticParams() {
  return families.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const f = families.find((x) => x.id === id);
  return { title: f ? `${f.name} family` : "Family" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!families.some((f) => f.id === id)) notFound();
  return <FamilyDetail id={id} />;
}
