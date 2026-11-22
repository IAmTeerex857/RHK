import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { applications } from "@rhk/fixtures";
import { ApplicationDetail } from "@/components/applications/application-detail";

export function generateStaticParams() {
  return applications.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const a = applications.find((x) => x.id === id);
  return { title: a ? `${a.ref} · ${a.parent.name}` : "Application" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = applications.find((a) => a.id === id);
  if (!app) notFound();
  return <ApplicationDetail id={app.id} />;
}
