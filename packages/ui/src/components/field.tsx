"use client";

/*
 * Form controls: floating-label input and textarea with a focus glow and an error shake,
 * a checkbox whose tick draws itself, and a day-toggle chip. Patterns follow amicro's
 * form-element catalogue (floating label, input focus glow, error shake, checkbox path draw).
 */

import { animate, AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../lib/cn";

/** Shakes the returned element when a new error appears, without remounting it (keeps focus). */
function useShake<T extends HTMLElement>(error?: string) {
  const reduce = useReducedMotion();
  const ref = useRef<T>(null);
  const prev = useRef(error);
  useEffect(() => {
    if (error && error !== prev.current && ref.current && !reduce) {
      animate(ref.current, { x: [0, -7, 7, -5, 5, -2, 0] }, { duration: 0.42 });
    }
    prev.current = error;
  }, [error, reduce]);
  return ref;
}

const shell =
  "group relative rounded-xl border bg-white transition-[border-color,box-shadow] duration-200 " +
  "focus-within:border-ink/40 focus-within:shadow-[0_0_0_4px_var(--color-bus-100)]";

function ErrorText({ id, error }: { id: string; error?: string }) {
  return (
    <AnimatePresence initial={false}>
      {error ? (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          className="px-1 pt-1.5 text-[13px] font-medium text-coral"
        >
          {error}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

export type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> & {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, icon, className, id, ...props },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  const shake = useShake<HTMLDivElement>(error);
  return (
    <div className={className}>
      <div ref={shake} className={cn(shell, error ? "border-coral" : "border-line-strong")}>
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted">{icon}</span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            "peer h-14 w-full rounded-xl bg-transparent px-4 pb-2 pt-6 text-[16px] text-ink outline-none",
            "placeholder-transparent",
            icon && "pl-11",
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-ink-muted transition-all duration-200",
            "peer-focus:top-[14px] peer-focus:text-[12px] peer-focus:font-semibold peer-focus:text-ink-soft",
            "peer-[:not(:placeholder-shown)]:top-[14px] peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:font-semibold",
            icon && "left-11",
          )}
        >
          {label}
          {props.required ? <span className="text-coral"> *</span> : null}
        </label>
      </div>
      {hint && !error ? (
        <p id={`${inputId}-hint`} className="px-1 pt-1.5 text-[13px] text-ink-muted">
          {hint}
        </p>
      ) : null}
      <ErrorText id={`${inputId}-err`} error={error} />
    </div>
  );
});

export type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "placeholder"> & {
  label: string;
  error?: string;
  hint?: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, hint, className, id, onChange, ...props },
  ref,
) {
  const auto = useId();
  const areaId = id ?? auto;
  const shake = useShake<HTMLDivElement>(error);
  const inner = useRef<HTMLTextAreaElement | null>(null);
  const grow = () => {
    const el = inner.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 120)}px`;
  };
  return (
    <div className={className}>
      <div ref={shake} className={cn(shell, error ? "border-coral" : "border-line-strong")}>
        <textarea
          ref={(el) => {
            inner.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          id={areaId}
          placeholder=" "
          rows={4}
          aria-invalid={error ? true : undefined}
          className="peer block min-h-[120px] w-full resize-none rounded-xl bg-transparent px-4 pb-3 pt-7 text-[16px] text-ink outline-none placeholder-transparent"
          onChange={(e) => {
            grow();
            onChange?.(e);
          }}
          {...props}
        />
        <label
          htmlFor={areaId}
          className={cn(
            "pointer-events-none absolute left-4 top-[18px] text-[15px] text-ink-muted transition-all duration-200",
            "peer-focus:top-[10px] peer-focus:text-[12px] peer-focus:font-semibold peer-focus:text-ink-soft",
            "peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:font-semibold",
          )}
        >
          {label}
        </label>
      </div>
      {hint && !error ? <p className="px-1 pt-1.5 text-[13px] text-ink-muted">{hint}</p> : null}
      <ErrorText id={`${areaId}-err`} error={error} />
    </div>
  );
});

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  className?: string;
  error?: boolean;
};

export function Checkbox({ checked, onChange, label, description, className, error }: CheckboxProps) {
  const id = useId();
  return (
    <label htmlFor={id} className={cn("group flex cursor-pointer items-start gap-3", className)}>
      <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
        <input
          id={id}
          type="checkbox"
          className="peer absolute inset-0 cursor-pointer opacity-0"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <motion.span
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-lg border transition-colors peer-focus-visible:shadow-[0_0_0_4px_var(--color-sky-soft)]",
            checked ? "border-bus-500 bg-bus-400" : error ? "border-coral bg-white" : "border-line-strong bg-white group-hover:border-ink/60",
          )}
          animate={{ scale: checked ? [1, 0.88, 1] : 1 }}
          transition={{ duration: 0.25 }}
        />
        <svg viewBox="0 0 24 24" className="relative size-4" aria-hidden>
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </svg>
      </span>
      <span className="text-[15px] leading-snug text-ink">
        {label}
        {description ? <span className="mt-0.5 block text-[13px] text-ink-muted">{description}</span> : null}
      </span>
    </label>
  );
}

export type ToggleChipProps = {
  pressed: boolean;
  onChange: (pressed: boolean) => void;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

/** A pill that toggles on and off, e.g. a weekday. */
export function ToggleChip({ pressed, onChange, children, className, ...rest }: ToggleChipProps) {
  return (
    <motion.button
      type="button"
      aria-pressed={pressed}
      onClick={() => onChange(!pressed)}
      whileTap={{ scale: 0.94 }}
      className={cn(
        "relative inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border px-4 font-display text-[14px] font-semibold transition-colors",
        pressed ? "border-bus-500 bg-bus-400 text-ink" : "border-line-strong bg-white text-ink-soft hover:border-ink/30",
        className,
      )}
      {...rest}
    >
      <AnimatePresence initial={false}>
        {pressed ? (
          <motion.svg
            key="tick"
            viewBox="0 0 24 24"
            className="size-4"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 16, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            aria-hidden
          >
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          </motion.svg>
        ) : null}
      </AnimatePresence>
      {children}
    </motion.button>
  );
}
