"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@rhk/ui/lib/cn";

export const THEME_KEY = "rhk-theme";

/**
 * Runs in <head> before the first paint: the visitor's saved choice, or else their system
 * setting, so the page never flashes the wrong theme. Without a saved choice it keeps following
 * the system setting live.
 */
export const themeScript = `(function(){try{var k="${THEME_KEY}",r=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)");var a=function(){var t=localStorage.getItem(k);r.classList.toggle("dark",t?t==="dark":m.matches)};a();m.addEventListener("change",function(){if(!localStorage.getItem(k))a()})}catch(e){}})()`;

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}
const isDark = () => document.documentElement.classList.contains("dark");

export function ThemeToggle({ className }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);
  const toggle = () => {
    const next = !isDark();
    const root = document.documentElement;
    // switch every colour at once, not through each element's own colour transition
    root.classList.add("rhk-theme-switching");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {}
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("rhk-theme-switching")));
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark theme"
      aria-pressed={dark}
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative grid size-11 place-items-center overflow-hidden rounded-full border border-line bg-card text-ink shadow-subtle transition-colors hover:bg-raised",
        className,
      )}
    >
      <Sun className="size-[19px] transition-transform duration-300 dark:-translate-y-8 dark:rotate-90" />
      <Moon className="absolute size-[18px] translate-y-8 -rotate-90 transition-transform duration-300 dark:translate-y-0 dark:rotate-0" />
    </button>
  );
}
