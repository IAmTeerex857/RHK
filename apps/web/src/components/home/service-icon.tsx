import {
  ArrowRight,
  CalendarDays,
  Flag,
  MapPin,
  Repeat,
  School,
  Sun,
  TreePalm,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@rhk/ui/lib/cn";

const icons: Record<string, LucideIcon> = {
  school: School,
  sun: Sun,
  pin: MapPin,
  arrow: ArrowRight,
  loop: Repeat,
  calendar: CalendarDays,
  flag: Flag,
  palm: TreePalm,
};

export function ServiceIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = icons[icon] ?? School;
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-xl bg-raised text-ink-soft",
        className,
      )}
    >
      <Icon className="size-5" />
    </span>
  );
}
