"use client";

/*
 * Everyday controls: icon button, switch, search field, select, dropdown menu and the
 * 6-digit sign-in code input.
 */

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { cn } from "../lib/cn";
import { Kbd } from "./badge";

/* ------------------------------------------------------------------ icon button */

export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { label: string; size?: "sm" | "md" | "lg"; variant?: "outline" | "ghost" | "ink" | "soft"; badge?: boolean }
>(function IconButton({ label, size = "md", variant = "outline", className, children, badge, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full transition-colors disabled:opacity-50",
        { sm: "size-8", md: "size-10", lg: "size-12" }[size],
        {
          outline: "border border-line bg-card text-ink shadow-subtle hover:bg-raised",
          ghost: "text-ink-soft hover:bg-raised hover:text-ink",
          ink: "bg-ink text-cream hover:bg-ink/90",
          soft: "bg-raised text-ink hover:bg-sunken",
        }[variant],
        className,
      )}
      {...rest}
    >
      {children}
      {badge ? <span className="absolute right-2 top-2 size-2 rounded-full bg-coral ring-2 ring-card" aria-hidden /> : null}
    </button>
  );
});

/* ------------------------------------------------------------------ switch */

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const id = useId();
  const control = (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors disabled:opacity-50",
        checked ? "bg-good" : "bg-line-strong",
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 700, damping: 34 }}
        className={cn("size-6 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.25)]", checked && "ml-auto")}
      />
    </button>
  );
  if (!label) return <span className={className}>{control}</span>;
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-[15px] font-medium text-ink">{label}</span>
        {description ? <span className="mt-0.5 block text-[14px] text-ink-muted">{description}</span> : null}
      </label>
      {control}
    </div>
  );
}

/* ------------------------------------------------------------------ search */

export function SearchField({
  placeholder = "Search",
  shortcut,
  className,
  value,
  onChange,
  size = "md",
}: {
  placeholder?: string;
  shortcut?: boolean;
  className?: string;
  value?: string;
  onChange?: (v: string) => void;
  size?: "sm" | "md";
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut]);
  return (
    <label
      className={cn(
        "flex items-center gap-2.5 rounded-full border border-line bg-card text-ink shadow-subtle transition-shadow focus-within:shadow-[0_0_0_4px_var(--color-bus-100)]",
        size === "sm" ? "h-9 px-3.5" : "h-10 px-4",
        className,
      )}
    >
      <Search className="size-4 shrink-0 text-ink-muted" aria-hidden />
      <input
        ref={ref}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-ink-muted [&::-webkit-search-cancel-button]:hidden"
      />
      {shortcut ? (
        <span className="hidden items-center gap-0.5 sm:flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      ) : null}
    </label>
  );
}

/* ------------------------------------------------------------------ select */

export function Select({
  label,
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  const id = useId();
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={rest.id ?? id} className="mb-1.5 block text-[13px] font-medium text-ink-soft">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={rest.id ?? id}
          className="h-11 w-full appearance-none rounded-xl border border-line-strong bg-card pl-3.5 pr-10 text-[15px] text-ink outline-none transition-shadow focus:border-ink/40 focus:shadow-[0_0_0_4px_var(--color-bus-100)]"
          {...rest}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" aria-hidden />
      </div>
    </div>
  );
}

/** Compact pill trigger that looks like the reference filters ("Last 30 days ⌄"). */
export function FilterPill({
  icon,
  children,
  onClick,
  className,
  active,
}: {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[14px] font-medium shadow-subtle transition-colors",
        active ? "border-ink bg-ink text-cream" : "border-line bg-card text-ink hover:bg-raised",
        className,
      )}
    >
      {icon ? <span className="text-ink-muted [&_svg]:size-4">{icon}</span> : null}
      {children}
      <ChevronDown className="size-4 text-ink-muted" aria-hidden />
    </button>
  );
}

/* ------------------------------------------------------------------ dropdown menu */

export type MenuItem = { label: string; icon?: ReactNode; onSelect?: () => void; tone?: "default" | "danger"; hint?: string };

export function Menu({
  trigger,
  items,
  align = "end",
  className,
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  items: (MenuItem | "divider")[];
  align?: "start" | "end";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className={cn("relative", className)}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className={cn(
              "absolute top-full z-50 mt-2 min-w-[220px] max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-card p-1.5 shadow-float",
              align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left",
            )}
          >
            {items.map((it, i) =>
              it === "divider" ? (
                <div key={i} className="my-1 h-px bg-line" />
              ) : (
                <button
                  key={it.label}
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    it.onSelect?.();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[14px] transition-colors hover:bg-raised",
                    it.tone === "danger" ? "text-bad" : "text-ink",
                  )}
                >
                  {it.icon ? <span className="shrink-0 text-ink-muted [&_svg]:size-4">{it.icon}</span> : null}
                  <span className="min-w-0 flex-1 truncate" title={it.label}>{it.label}</span>
                  {it.hint ? <span className="shrink-0 text-[12px] text-ink-muted">{it.hint}</span> : null}
                </button>
              ),
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ code input */

/** Six boxes for the emailed sign-in code. Paste fills all six; backspace walks back. */
export function CodeInput({
  length = 6,
  value,
  onChange,
  error,
  autoFocus,
}: {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  autoFocus?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const set = (i: number, ch: string) => {
    const chars = value.padEnd(length, " ").split("");
    chars[i] = ch || " ";
    onChange(chars.join("").replace(/\s+$/, ""));
  };
  return (
    <div className="flex justify-between gap-2" role="group" aria-label="Sign-in code">
      {Array.from({ length }, (_, i) => {
        const ch = value[i]?.trim() ?? "";
        return (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            autoFocus={autoFocus && i === 0}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${i + 1}`}
            maxLength={i === 0 ? length : 1}
            value={ch}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              if (v.length > 1) {
                onChange(v.slice(0, length));
                refs.current[Math.min(v.length, length) - 1]?.focus();
                return;
              }
              set(i, v);
              if (v && i < length - 1) refs.current[i + 1]?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !ch && i > 0) refs.current[i - 1]?.focus();
              if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
              if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
            }}
            onPaste={(e) => {
              const v = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
              if (v) {
                e.preventDefault();
                onChange(v);
                refs.current[Math.min(v.length, length) - 1]?.focus();
              }
            }}
            className={cn(
              "h-14 w-full min-w-0 rounded-2xl border bg-card text-center font-display text-[24px] font-medium text-ink outline-none transition-[border-color,box-shadow] tabular sm:h-16",
              error ? "border-coral" : ch ? "border-ink/40" : "border-line-strong",
              "focus:border-ink/50 focus:shadow-[0_0_0_4px_var(--color-bus-100)]",
            )}
          />
        );
      })}
    </div>
  );
}

/** Single-choice chips for short option sets (minutes late, a reason, a fuel level). */
export function ChoiceChips<T extends string | number>({
  options,
  value,
  onChange,
  size = "md",
  className,
  "aria-label": ariaLabel,
}: {
  options: { value: T; label: ReactNode }[];
  value: T | null;
  onChange: (v: T) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-full border font-medium transition-[background-color,border-color,color] duration-150",
              { sm: "h-8 px-3 text-[13px]", md: "h-10 px-4 text-[14px]", lg: "h-12 px-5 text-[15px]" }[size],
              on ? "border-ink bg-ink text-cream" : "border-line-strong bg-card text-ink hover:bg-raised",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
