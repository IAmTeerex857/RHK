import { DriverFrame } from "@/components/frame";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <DriverFrame>{children}</DriverFrame>;
}
