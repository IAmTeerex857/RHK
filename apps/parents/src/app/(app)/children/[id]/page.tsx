import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { childrenOf, ME } from "@rhk/fixtures";
import { ChildView } from "@/components/children-view";

const kids = childrenOf(ME.parentFamilyId);

export function generateStaticParams() {
  return kids.map((k) => ({ id: k.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const k = kids.find((x) => x.id === id);
  return { title: k ? `${k.first} ${k.last}` : "Child" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!kids.some((k) => k.id === id)) notFound();
  return <ChildView id={id} />;
}
