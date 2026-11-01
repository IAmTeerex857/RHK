import Link from "next/link";
import { cn } from "@rhk/ui/lib/cn";

/**
 * The Road R: an R drawn as a road with the dashed yellow centre line the bus drives on.
 * Keep it flat: one yellow tile, one ink road, the dashes in the tile colour.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" rx="16" fill="#ffc629" />
      <path
        d="M18 52 V14 H33 a10.5 10.5 0 0 1 0 21 H18 M30 35 L46 52"
        fill="none"
        stroke="#1d1a2f"
        strokeWidth="11"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M18 50 V14 H33 a10.5 10.5 0 0 1 0 21 H18 M31 36 L45 51"
        fill="none"
        stroke="#ffc629"
        strokeWidth="2.2"
        strokeDasharray="4.5 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  onClick,
  tone = "light",
}: {
  className?: string;
  onClick?: () => void;
  /** "dark" for use on the ink footer. */
  tone?: "light" | "dark";
}) {
  return (
    <Link href="/" onClick={onClick} className={cn("inline-flex items-center gap-2.5", className)} aria-label="Rush Hour Kids home">
      <LogoMark className="size-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[18px] font-semibold tracking-[-0.025em]", tone === "dark" ? "text-white" : "text-ink")}>
          Rush Hour Kids
        </span>
        <span className={cn("mt-1 text-[12px] font-medium", tone === "dark" ? "text-white/60" : "text-ink-muted")}>Transportation</span>
      </span>
    </Link>
  );
}
