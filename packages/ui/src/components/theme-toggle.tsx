"use client";

/*
 * Light / dark toggle for the portals. The icon swaps with a spring morph
 * (scale + fade, stiffness 600 / damping 28), adapted from amicro's "Theme" button
 * (MIT, © 2026 Syed Subhan Uddin). Shares the landing site's storage key, so one choice
 * follows the person across every Rush Hour Kids app on the same domain.
 */

import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "../lib/cn";

export const THEME_KEY = "rhk-theme";

/** Inline <head> script: applies the saved choice (or the system setting) before first paint. */
export const themeScript = `(function(){try{var k="${THEME_KEY}",r=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)");var a=function(){var t=localStorage.getItem(k);r.classList.toggle("dark",t?t==="dark":m.matches)};a();m.addEventListener("change",function(){if(!localStorage.getItem(k))a()})}catch(e){}})()`;

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}
const isDark = () => document.documentElement.classList.contains("dark");

export function setTheme(next: "light" | "dark") {
  const root = document.documentElement;
  root.classList.add("rhk-theme-switching");
  root.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("rhk-theme-switching")));
}

export function useIsDark() {
  return useSyncExternalStore(subscribe, isDark, () => false);
}

const spring = { type: "spring", stiffness: 600, damping: 28 } as const;

export function ThemeToggle({ className }: { className?: string }) {
  const dark = useIsDark();
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label="Dark theme"
      aria-pressed={dark}
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative grid size-10 shrink-0 place-items-center rounded-full border border-line bg-card text-ink shadow-subtle transition-colors hover:bg-raised",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ scale: 0.5, opacity: 0, rotate: -40 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 40 }}
          transition={spring}
          className="grid place-items-center"
        >
          {dark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
