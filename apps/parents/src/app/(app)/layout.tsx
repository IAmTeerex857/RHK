import { ParentFrame } from "@/components/frame";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <ParentFrame>{children}</ParentFrame>;
}
