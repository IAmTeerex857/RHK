"use client";

/*
 * Dialog and side sheet on the native <dialog> element: focus is trapped, Esc closes,
 * the page behind is inert. On phones the dialog becomes a bottom sheet.
 * Layout follows the "Export this view" reference: icon tile, title, subtitle, round close.
 */

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../lib/cn";

type Base = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    el.addEventListener("cancel", cancel);
    return () => el.removeEventListener("cancel", cancel);
  }, [onClose]);
  const onBackdrop = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };
  return { ref, onBackdrop };
}

function Head({ title, description, icon, onClose }: Pick<Base, "title" | "description" | "icon" | "onClose">) {
  return (
    <header className="flex items-start gap-3.5">
      {icon ? (
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-raised text-ink">{icon}</span>
      ) : null}
      <div className="min-w-0 flex-1 pt-0.5">
        <h2 className="font-display text-[18px] font-medium tracking-[-0.02em] text-ink">{title}</h2>
        {description ? <p className="mt-1 text-[14px] text-ink-muted">{description}</p> : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-raised hover:text-ink"
      >
        <X className="size-[18px]" />
      </button>
    </header>
  );
}

export function Dialog({ open, onClose, title, description, icon, children, footer, className, size = "md" }: Base & { size?: "sm" | "md" | "lg" }) {
  const { ref, onBackdrop } = useDialog(open, onClose);
  return (
    <dialog
      ref={ref}
      onClick={onBackdrop}
      className={cn(
        "rhk-dialog m-auto w-full bg-transparent p-0 text-ink backdrop:bg-[rgb(12_10_20/0.38)] backdrop:backdrop-blur-[2px]",
        "max-sm:mb-0 max-sm:max-w-none",
        { sm: "max-w-[440px]", md: "max-w-[580px]", lg: "max-w-[760px]" }[size],
      )}
    >
      <div
        className={cn(
          "flex max-h-[min(88dvh,820px)] flex-col rounded-[20px] border border-line bg-card shadow-float max-sm:rounded-b-none",
          className,
        )}
      >
        <div className="px-6 pt-6 sm:px-7 sm:pt-7">
          <Head title={title} description={description} icon={icon} onClose={onClose} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-7">{children}</div>
        {footer ? (
          <footer className="flex flex-wrap items-center justify-end gap-2.5 border-t border-line px-6 py-4 sm:px-7 max-sm:pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}

/** Right-hand drawer (detail editors, filters). Full screen on phones. */
export function Sheet({ open, onClose, title, description, icon, children, footer, className, width = 560 }: Base & { width?: number }) {
  const { ref, onBackdrop } = useDialog(open, onClose);
  return (
    <dialog
      ref={ref}
      onClick={onBackdrop}
      className="rhk-sheet ml-auto mr-0 h-dvh max-h-dvh w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-[rgb(12_10_20/0.32)] sm:p-2"
      style={{ maxWidth: width + 16 }}
    >
      <div className={cn("flex h-full flex-col border border-line bg-card shadow-float sm:rounded-[18px]", className)}>
        <div className="border-b border-line px-6 py-5">
          <Head title={title} description={description} icon={icon} onClose={onClose} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <footer className="flex flex-wrap items-center justify-end gap-2.5 border-t border-line px-6 py-4 max-sm:pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}

/** Radio card (title + description), the export-format pattern. */
export function RadioCard({
  checked,
  onChange,
  title,
  description,
  name,
  className,
}: {
  checked: boolean;
  onChange: () => void;
  title: ReactNode;
  description?: ReactNode;
  name: string;
  className?: string;
}) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3.5 rounded-2xl p-2 transition-colors hover:bg-raised", className)}>
      <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
        <input type="radio" name={name} checked={checked} onChange={onChange} className="peer absolute inset-0 cursor-pointer opacity-0" />
        <span
          className={cn(
            "size-6 rounded-full border transition-all peer-focus-visible:shadow-[0_0_0_4px_var(--color-sky-soft)]",
            checked ? "border-[7px] border-ink bg-card" : "border-line-strong bg-card",
          )}
          aria-hidden
        />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-medium text-ink">{title}</span>
        {description ? <span className="mt-0.5 block text-[14px] text-ink-muted">{description}</span> : null}
      </span>
    </label>
  );
}
