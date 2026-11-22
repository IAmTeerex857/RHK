import { AdminFrame } from "@/components/frame";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AdminFrame>{children}</AdminFrame>;
}
