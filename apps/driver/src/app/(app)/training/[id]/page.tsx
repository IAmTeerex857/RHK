import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses } from "@rhk/fixtures";
import { CourseView } from "@/components/training-view";

const live = courses.filter((c) => c.status === "approved");

export function generateStaticParams() {
  return live.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: live.find((c) => c.id === id)?.title ?? "Course" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!live.some((c) => c.id === id)) notFound();
  return <CourseView id={id} />;
}
