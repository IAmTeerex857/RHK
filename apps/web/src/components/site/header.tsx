"use client";

import Link from "next/link";
import { LinkButton } from "@/components/site/link-button";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Phone, X } from "lucide-react";
import { Button } from "@rhk/ui/components/button";
import { cn } from "@rhk/ui/lib/cn";
import { contact, nav } from "@/content/site";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
        <div
          className={cn(
            "mx-auto flex h-[68px] max-w-[76rem] items-center justify-between gap-4 rounded-2xl border px-3 pl-4 transition-all duration-300 md:px-4 md:pl-5",
            scrolled || open
              ? "border-line bg-card/90 shadow-card backdrop-blur-md dark:bg-card/85"
              : "border-transparent bg-transparent",
          )}
        >
          <Logo onClick={() => setOpen(false)} />

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-lg px-3.5 py-2 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink",
                    active && "text-ink",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-bus-200"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={contact.phoneHref}
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-[14px] font-semibold text-ink hover:bg-ink/5 xl:inline-flex"
            >
              <Phone className="size-4" />
              {contact.phone}
            </a>
            <LinkButton href="/application" size="sm" arrow className="hidden sm:inline-flex">
              Apply now
            </LinkButton>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid size-11 place-items-center rounded-full border border-line bg-card shadow-subtle lg:hidden"
            >
              <span className="sr-only">Menu</span>
              <motion.span
                className="absolute h-[2.5px] w-5 rounded-full bg-ink"
                animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
              />
              <motion.span
                className="absolute h-[2.5px] w-5 rounded-full bg-ink"
                animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-cream/95 px-5 pb-8 pt-28 backdrop-blur-md lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <nav aria-label="Mobile" className="mx-auto flex max-w-md flex-col gap-2">
              {[{ label: "Home", href: "/" }, ...nav].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, type: "spring", stiffness: 380, damping: 30 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-5 py-4 font-display text-[22px] font-semibold tracking-[-0.02em]",
                      pathname === item.href ? "border-bus-500 bg-bus-300" : "border-line bg-card",
                    )}
                  >
                    {item.label}
                    <span aria-hidden className="text-ink-muted">→</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                className="mt-4 grid grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
              >
                <LinkButton href="/application" size="lg" arrow onClick={() => setOpen(false)}>
                  Apply
                </LinkButton>
                <Button href={contact.phoneHref} variant="outline" size="lg" icon={<Phone className="size-[18px]" />}>
                  Call
                </Button>
              </motion.div>
            </nav>
            <button
              type="button"
              className="sr-only"
              onClick={() => setOpen(false)}
            >
              <X /> Close menu
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
