import type { Metadata } from "next";
import { MessagesView } from "@/components/more-views";

export const metadata: Metadata = { title: "Messages" };

export default function Page() {
  return <MessagesView />;
}
