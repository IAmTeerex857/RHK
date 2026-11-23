import type { Metadata } from "next";
import { NotFoundScreen } from "@rhk/ui/shell/status-pages";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return <NotFoundScreen app="Driver" homeLabel="Today" />;
}
