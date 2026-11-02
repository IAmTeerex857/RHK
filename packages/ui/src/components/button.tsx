"use client";

/*
 * Buttons. Hover is a colour step and a 2px arrow nudge; press is a tiny scale down.
 * Arrow treatment adapted from amicro's text-reveal button (MIT, © 2026 Syed Subhan Uddin).
 */

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { forwardRef, useMemo, type ElementType, type ReactNode } from "react";
import { cn } from "../lib/cn";

type Variant = "primary" | "ink" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-bus-400 text-ink shadow-subtle hover:bg-bus-300",
  ink: "bg-ink text-cream shadow-subtle hover:bg-ink/90",
  outline: "border border-line-strong bg-card text-ink hover:bg-raised",
  ghost: "bg-transparent text-ink hover:bg-raised",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 gap-2 text-[14px] rounded-[10px]",
  md: "h-11 px-5 gap-2 text-[15px] rounded-xl",
  lg: "h-12 px-6 gap-2.5 text-[16px] rounded-xl",
};

export type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Show an arrow that nudges forward on hover. */
  arrow?: boolean;
  /** Leading icon. */
  icon?: ReactNode;
  href?: string;
  /** Component used to render links, e.g. Next.js `Link`, so navigation stays client-side. */
  linkAs?: ElementType;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { children, variant = "primary", size = "md", arrow = false, icon, href, linkAs, className, type = "button", disabled, onClick, ...rest },
  ref,
) {
  const reduce = useReducedMotion();
  const MotionLink = useMemo(() => (linkAs ? motion.create(linkAs) : motion.a), [linkAs]);

  const inner = (
    <>
      {icon ? <span className="grid size-[18px] shrink-0 place-items-center">{icon}</span> : null}
      <span className="whitespace-nowrap">{children}</span>
      {arrow ? (
        <ArrowRight className="size-[18px] shrink-0 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
      ) : null}
    </>
  );

  const classes = cn(
    "group relative inline-flex select-none items-center justify-center font-display font-medium",
    "transition-[background-color,border-color,color,box-shadow] duration-150",
    "disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );

  const press = reduce ? undefined : { scale: 0.98 };
  const pressTransition = { duration: 0.12, ease: [0.22, 1, 0.36, 1] } as const;

  if (href) {
    return (
      <MotionLink
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        whileTap={press}
        transition={pressTransition}
        onClick={onClick}
        {...rest}
      >
        {inner}
      </MotionLink>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={classes}
      whileTap={press}
      transition={pressTransition}
      onClick={onClick}
      {...rest}
    >
      {inner}
    </motion.button>
  );
});
