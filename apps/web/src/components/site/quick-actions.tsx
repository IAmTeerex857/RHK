"use client";

/*
 * Phone and tablet only: a floating button that splits into Call / Text / Apply droplets.
 * Uses Gooey (liquid-gooey, MIT, © 2026 Jakub Antalik) so the pieces merge and split like liquid.
 */

import Link from "next/link";
import { Liquid } from "liquid-gooey";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FileText, MessageCircle, Phone, Plus } from "lucide-react";
import { contact } from "@/content/site";

const ACTIONS = [
  { label: "Call us", href: contact.phoneHref, icon: Phone, x: -74, y: -8 },
  { label: "Text us", href: contact.smsHref, icon: MessageCircle, x: -54, y: -62 },
  { label: "Apply now", href: "/application", icon: FileText, x: 2, y: -82 },
];

const SIZE = 56;
const BOX_W = 150;
const BOX_H = 150;
const LEFT = BOX_W - SIZE - 6;
const TOP = BOX_H - SIZE - 6;

export function QuickActions() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  if (pathname === "/application") return null;

  return (
    <div className="fixed bottom-4 right-3 z-40 lg:hidden" style={{ width: BOX_W, height: BOX_H, pointerEvents: "none" }}>
      <Liquid
        fill="var(--color-bus-400)"
        blur={9}
        contrast={20}
        shadow="0 0 0 2px #1d1a2f, 3px 3px 0 0 #1d1a2f"
        style={{ width: BOX_W, height: BOX_H, position: "relative" }}
      >
        {ACTIONS.map((a, i) => {
          const Icon = a.icon;
          const isLink = a.href.startsWith("/");
          const inner = (
            <Icon className="size-5 transition-opacity duration-200" strokeWidth={2.4} style={{ opacity: open ? 1 : 0 }} />
          );
          const cls =
            "grid size-full place-items-center rounded-full text-ink outline-none focus-visible:ring-4 focus-visible:ring-sky";
          return (
            <Liquid.Item
              key={a.label}
              style={{ position: "absolute", left: LEFT + 4, top: TOP + 4, width: SIZE - 8, height: SIZE - 8, pointerEvents: open ? "auto" : "none" }}
              x={open ? a.x : 0}
              y={open ? a.y : 0}
              transition="bouncy"
              delay={open ? i * 45 : (ACTIONS.length - i) * 30}
            >
              {isLink ? (
                <Link href={a.href} aria-label={a.label} tabIndex={open ? 0 : -1} className={cls}>
                  {inner}
                </Link>
              ) : (
                <a href={a.href} aria-label={a.label} tabIndex={open ? 0 : -1} className={cls}>
                  {inner}
                </a>
              )}
            </Liquid.Item>
          );
        })}
        <Liquid.Item style={{ position: "absolute", left: LEFT, top: TOP, width: SIZE, height: SIZE, pointerEvents: "auto" }}>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close quick actions" : "Call, text or apply"}
            className="grid size-full place-items-center rounded-full text-ink outline-none focus-visible:ring-4 focus-visible:ring-sky"
          >
            <Plus className="size-6 transition-transform duration-300" strokeWidth={2.8} style={{ transform: open ? "rotate(45deg)" : undefined }} />
          </button>
        </Liquid.Item>
      </Liquid>
    </div>
  );
}
