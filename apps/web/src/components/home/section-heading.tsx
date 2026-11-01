import type { ReactNode } from "react";
import { cn } from "@rhk/ui/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  body,
  className,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-[40rem]", align === "center" && "mx-auto text-center", className)}>
      <p className="font-display text-[14px] font-medium text-ink-muted">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-[34px] font-semibold leading-[1.04] tracking-[-0.025em] md:text-[46px]">{title}</h2>
      {body ? <p className="mt-4 text-[17px] leading-relaxed text-ink-soft md:text-[17px]">{body}</p> : null}
    </div>
  );
}
