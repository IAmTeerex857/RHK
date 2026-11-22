/*
 * Surfaces.
 * - Card: white rounded card on the grey canvas, hairline border, soft depth.
 * - Panel: the tinted "tray" that holds inner cards, with an optional mono status footer
 *   (the model-router / shard-ring pattern).
 * - CardHeader: title + muted subtitle, actions on the right.
 */

import { MoreHorizontal } from "lucide-react";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "../lib/cn";

type CardProps<T extends ElementType = "section"> = {
  as?: T;
  className?: string;
  children?: ReactNode;
  /** Remove the default padding (tables, maps, edge-to-edge content). */
  flush?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Card<T extends ElementType = "section">({ as, className, children, flush, ...rest }: CardProps<T>) {
  const Tag = (as ?? "section") as ElementType;
  return (
    <Tag
      className={cn(
        "relative rounded-2xl border border-line bg-card shadow-[0_1px_0_rgb(0_0_0/0.02)]",
        !flush && "p-5",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  subtitle,
  actions,
  className,
  icon,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <header className={cn("flex items-start justify-between gap-3", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {icon ? <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-raised text-ink">{icon}</span> : null}
        <div className="min-w-0">
          <h3 className="truncate font-display text-[15px] font-medium tracking-[-0.015em] text-ink">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-[13px] text-ink-muted">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function MoreButton({ label = "More options", className, onClick }: { label?: string; className?: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid size-8 place-items-center rounded-lg border border-transparent text-ink-muted transition-colors hover:bg-raised hover:text-ink",
        className,
      )}
    >
      <MoreHorizontal className="size-[18px]" />
    </button>
  );
}

/** Tinted tray with inner cards and an optional mono footer line. */
export function Panel({
  title,
  meta,
  actions,
  footer,
  footerAction,
  children,
  className,
}: {
  title?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  footerAction?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[20px] border border-line bg-sunken p-1", className)}>
      {title || actions ? (
        <header className="flex items-center justify-between gap-3 px-4 pb-2.5 pt-3">
          <div className="flex min-w-0 items-baseline gap-2.5">
            {title ? <h3 className="truncate font-display text-[15px] font-medium tracking-[-0.015em]">{title}</h3> : null}
            {meta ? <span className="truncate text-[13.5px] text-ink-muted">{meta}</span> : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-1.5">{actions}</div> : null}
        </header>
      ) : null}
      <div className="flex flex-col gap-1.5">{children}</div>
      {footer || footerAction ? (
        <footer className="flex items-center justify-between gap-3 px-4 pb-2 pt-3">
          <span className="mono-label truncate text-ink-muted">{footer}</span>
          {footerAction}
        </footer>
      ) : null}
    </section>
  );
}

/** Inner white card used inside a Panel. */
export function PanelCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border border-line bg-card p-5", className)}>{children}</div>;
}

/** Key/value row with a hairline, for detail lists. */
export function Row({ label, value, className }: { label: ReactNode; value: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-4 border-b border-line py-3 last:border-b-0", className)}>
      <span className="text-[14px] text-ink-muted">{label}</span>
      <span className="text-right text-[14px] font-medium text-ink tabular">{value}</span>
    </div>
  );
}
