"use client";

/*
 * The portal shell shared by admin, driver and parent apps.
 *
 * Desktop: sidebar on the grey canvas (collapsible to an icon rail), slim top bar with the
 * breadcrumb on the left and search / notifications / theme / account on the right.
 * Phone: header with round buttons and a centred title, a drawer for the full nav, and a
 * floating pill tab bar whose active tab widens to show its label, plus a round action button.
 * Keyboard: ⌘K opens the command menu; "G" then a letter jumps to a section.
 */

import { AnimatePresence, motion } from "motion/react";
import { Bell, ChevronRight, ChevronsUpDown, LogOut, Menu as MenuIcon, PanelLeft, Search, Settings, User, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Avatar } from "../components/avatar";
import { CountPill, Kbd } from "../components/badge";
import { IconButton, Menu } from "../components/controls";
import { LogoMark } from "../components/logo-mark";
import { ThemeToggle } from "../components/theme-toggle";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  count?: number;
  /** Count shown as an alert (coral) rather than neutral. */
  alert?: boolean;
  /** "G" then this key jumps here. */
  key?: string;
  exact?: boolean;
};
export type NavGroup = { label?: string; items: NavItem[] };

export type Notice = { id: string; title: string; body?: string; time: string; tone?: "alert" | "info" | "good"; unread?: boolean; href?: string };

export type ShellUser = { name: string; role: string; seed: string; email: string; photo?: string };

export type Command = { label: string; hint?: string; icon?: LucideIcon; href?: string; group?: string; run?: () => void };

type ShellProps = {
  app: string;
  nav: NavGroup[];
  user: ShellUser;
  notices?: Notice[];
  /** Up to four items for the phone tab bar. */
  tabs?: NavItem[];
  /** Round action button beside the phone tab bar. */
  fab?: { href?: string; onClick?: () => void; label: string; icon: LucideIcon; tone?: "ink" | "brand" | "bad"; ring?: number };
  sidebarFooter?: ReactNode;
  commands?: Command[];
  children: ReactNode;
  /** Narrow content column (phone-first apps). */
  narrow?: boolean;
};

const ShellCtx = createContext<{ openPalette: () => void; setCrumb: (c: string | null) => void } | null>(null);
export const useShell = () => useContext(ShellCtx);

function isActive(pathname: string, item: NavItem) {
  if (item.exact || item.href === "/") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

const COLLAPSE_KEY = "rhk-sidebar-collapsed";

export function AppShell({ app, nav, user, notices = [], tabs, fab, sidebarFooter, commands = [], children, narrow }: ShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);
  const [crumb, setCrumb] = useState<string | null>(null);
  const flat = useMemo(() => nav.flatMap((g) => g.items), [nav]);
  const current = useMemo(
    () => [...flat].sort((a, b) => b.href.length - a.href.length).find((i) => isActive(pathname, i)),
    [flat, pathname],
  );

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {}
  }, []);
  const toggleCollapse = () =>
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      } catch {}
      return !c;
    });

  useEffect(() => setDrawer(false), [pathname]);

  // ⌘K and "G then key"
  useEffect(() => {
    let g = 0;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
        return;
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === "g") {
        g = Date.now();
        return;
      }
      if (Date.now() - g < 900) {
        const hit = flat.find((i) => i.key?.toLowerCase() === e.key.toLowerCase());
        if (hit) {
          e.preventDefault();
          router.push(hit.href);
        }
        g = 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flat, router]);

  const openPalette = useCallback(() => setPalette(true), []);
  const unread = notices.filter((n) => n.unread).length;
  const ctx = useMemo(() => ({ openPalette, setCrumb }), [openPalette]);

  return (
    <ShellCtx.Provider value={ctx}>
      <div className="min-h-dvh bg-canvas text-ink lg:flex">
        {/* ---------------- desktop sidebar */}
        <aside
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 flex-col py-3 transition-[width] duration-200 ease-out lg:flex",
            collapsed ? "w-[68px] px-2.5" : "w-[248px] px-3",
          )}
        >
          <div className={cn("flex h-11 items-center", collapsed ? "justify-center" : "justify-between pl-1.5")}>
            <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label={`Rush Hour Kids ${app}`}>
              <LogoMark className="size-8 shrink-0" />
              {!collapsed ? (
                <span className="min-w-0 leading-none">
                  <span className="block truncate font-display text-[14.5px] font-semibold tracking-[-0.02em]">Rush Hour Kids</span>
                  <span className="mt-1 block truncate text-[12px] text-ink-muted">{app}</span>
                </span>
              ) : null}
            </Link>
            {!collapsed ? (
              <IconButton label="Collapse sidebar" variant="ghost" size="sm" onClick={toggleCollapse}>
                <PanelLeft className="size-4" />
              </IconButton>
            ) : null}
          </div>

          <button
            type="button"
            onClick={openPalette}
            className={cn(
              "mt-3 flex h-9 items-center gap-2 rounded-[10px] border border-line bg-card text-[13.5px] text-ink-muted shadow-[0_1px_0_rgb(0_0_0/0.02)] transition-colors hover:text-ink",
              collapsed ? "w-full justify-center" : "px-3",
            )}
            aria-label="Search and jump (⌘K)"
          >
            <Search className="size-4 shrink-0" />
            {!collapsed ? (
              <>
                <span className="flex-1 text-left">Search</span>
                <Kbd>⌘K</Kbd>
              </>
            ) : null}
          </button>

          <nav className="scrollbar-none -mx-1 mt-3 flex-1 overflow-y-auto px-1" aria-label="Main">
            {nav.map((group, gi) => (
              <div key={gi} className={gi ? "mt-5" : undefined}>
                {group.label && !collapsed ? (
                  <p className="mb-1 px-2.5 text-[12px] font-medium text-ink-muted">{group.label}</p>
                ) : group.label ? (
                  <div className="mx-auto mb-2 h-px w-6 bg-line" />
                ) : null}
                <ul className="flex flex-col gap-px">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <SideLink item={item} active={current?.href === item.href} collapsed={collapsed} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {sidebarFooter && !collapsed ? <div className="mt-3">{sidebarFooter}</div> : null}

          <div className="mt-3 border-t border-line pt-3">
            {collapsed ? (
              <div className="flex flex-col items-center gap-2">
                <IconButton label="Expand sidebar" variant="ghost" size="sm" onClick={toggleCollapse}>
                  <PanelLeft className="size-4 rotate-180" />
                </IconButton>
                <Avatar seed={user.seed} name={user.name} photo={user.photo} size={32} />
              </div>
            ) : (
              <UserMenu user={user} />
            )}
          </div>
        </aside>

        {/* ---------------- content column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* desktop top bar */}
          <header className="sticky top-0 z-30 hidden h-14 items-center justify-between gap-4 bg-canvas/85 px-8 backdrop-blur-md lg:flex">
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[13.5px]">
              {current ? (
                <>
                  <Link href={current.href} className="flex items-center gap-1.5 text-ink-muted transition-colors hover:text-ink">
                    <current.icon className="size-4" />
                    {current.label}
                  </Link>
                  {pathname !== current.href ? (
                    <>
                      <ChevronRight className="size-3.5 text-ink-muted" />
                      <span className="truncate font-medium text-ink">{crumb ?? "Details"}</span>
                    </>
                  ) : null}
                </>
              ) : null}
            </nav>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openPalette}
                className="flex h-9 w-56 items-center gap-2 rounded-full border border-line bg-card px-3.5 text-[13.5px] text-ink-muted transition-colors hover:text-ink xl:w-64"
              >
                <Search className="size-4" />
                <span className="flex-1 text-left">Search or jump to…</span>
                <Kbd>⌘K</Kbd>
              </button>
              <Notifications notices={notices} unread={unread} />
              <ThemeToggle className="size-9" />
            </div>
          </header>

          {/* phone header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 bg-canvas/85 px-4 backdrop-blur-md lg:hidden">
            <IconButton label="Open menu" onClick={() => setDrawer(true)}>
              <MenuIcon className="size-[18px]" />
            </IconButton>
            <p className="min-w-0 truncate font-display text-[16px] font-medium tracking-[-0.02em]">{current?.label ?? app}</p>
            <div className="flex items-center gap-2">
              <Notifications notices={notices} unread={unread} compact />
              <ThemeToggle />
            </div>
          </header>

          <main
            id="main"
            className={cn(
              "w-full flex-1 px-4 pb-32 pt-2 sm:px-6 lg:px-8 lg:pb-14",
              narrow ? "mx-auto max-w-[1080px]" : "max-w-[1480px]",
            )}
          >
            {children}
          </main>
        </div>

        {/* phone tab bar */}
        {tabs?.length ? <TabBar tabs={tabs} fab={fab} pathname={pathname} /> : null}

        {/* phone drawer */}
        <AnimatePresence>
          {drawer ? (
            <>
              <motion.div
                className="fixed inset-0 z-50 bg-[rgb(12_10_20/0.38)] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawer(false)}
              />
              <motion.aside
                className="fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[86vw] flex-col bg-canvas px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-float lg:hidden"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 420, damping: 40 }}
                aria-label="Menu"
              >
                <div className="flex h-11 items-center justify-between pl-1.5">
                  <span className="flex items-center gap-2.5">
                    <LogoMark className="size-8" />
                    <span className="leading-none">
                      <span className="block font-display text-[14.5px] font-semibold">Rush Hour Kids</span>
                      <span className="mt-1 block text-[12px] text-ink-muted">{app}</span>
                    </span>
                  </span>
                  <IconButton label="Close menu" variant="ghost" onClick={() => setDrawer(false)}>
                    <X className="size-[18px]" />
                  </IconButton>
                </div>
                <nav className="mt-4 flex-1 overflow-y-auto" aria-label="Main">
                  {nav.map((group, gi) => (
                    <div key={gi} className={gi ? "mt-5" : undefined}>
                      {group.label ? <p className="mb-1 px-2.5 text-[12px] font-medium text-ink-muted">{group.label}</p> : null}
                      {group.items.map((item) => (
                        <SideLink key={item.href} item={item} active={current?.href === item.href} collapsed={false} large />
                      ))}
                    </div>
                  ))}
                </nav>
                <div className="border-t border-line pt-3">
                  <UserMenu user={user} up />
                </div>
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>

        <CommandPalette open={palette} onClose={() => setPalette(false)} nav={flat} commands={commands} />
      </div>
    </ShellCtx.Provider>
  );
}

/* ------------------------------------------------------------------ pieces */

function SideLink({ item, active, collapsed, large }: { item: NavItem; active: boolean; collapsed: boolean; large?: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label + (item.key ? `  ·  G then ${item.key.toUpperCase()}` : "") : undefined}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-[10px] border text-[14px] transition-colors duration-150",
        large ? "h-11 px-3" : "h-9 px-2.5",
        collapsed && "justify-center px-0",
        active
          ? "border-line bg-card font-medium text-ink shadow-[0_1px_2px_rgb(0_0_0/0.04)]"
          : "border-transparent text-ink-soft hover:bg-[color-mix(in_oklab,var(--color-card)_60%,transparent)] hover:text-ink",
      )}
    >
      <Icon className={cn("size-[17px] shrink-0", active ? "text-ink" : "text-ink-muted group-hover:text-ink")} />
      {!collapsed ? <span className="flex-1 truncate">{item.label}</span> : null}
      {item.count !== undefined && item.count > 0 ? (
        collapsed ? (
          <span className={cn("absolute right-1.5 top-1.5 size-2 rounded-full", item.alert ? "bg-coral" : "bg-ink-muted")} />
        ) : (
          <CountPill tone={item.alert ? "alert" : "neutral"}>{item.count}</CountPill>
        )
      ) : null}
    </Link>
  );
}

function UserMenu({ user, up }: { user: ShellUser; up?: boolean }) {
  return (
    <Menu
      align="start"
      className={up ? "[&>[role=menu]]:bottom-full [&>[role=menu]]:top-auto [&>[role=menu]]:mb-2" : "[&>[role=menu]]:bottom-full [&>[role=menu]]:top-auto [&>[role=menu]]:mb-2"}
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="flex w-full items-center gap-2.5 rounded-xl p-1.5 text-left transition-colors hover:bg-card"
        >
          <Avatar seed={user.seed} name={user.name} photo={user.photo} size={34} status="online" />
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[13.5px] font-medium">{user.name}</span>
            <span className="block truncate text-[12px] text-ink-muted">{user.role}</span>
          </span>
          <ChevronsUpDown className="size-4 text-ink-muted" />
        </button>
      )}
      items={[
        { label: user.email, icon: <User />, onSelect: () => (window.location.href = "/settings") },
        { label: "Settings", icon: <Settings />, onSelect: () => (window.location.href = "/settings") },
        "divider",
        { label: "Sign out", icon: <LogOut />, onSelect: () => (window.location.href = "/sign-in") },
      ]}
    />
  );
}

function Notifications({ notices, unread, compact }: { notices: Notice[]; unread: number; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const dot = { alert: "bg-bad", info: "bg-data-400", good: "bg-good" } as const;
  return (
    <div ref={ref} className="relative">
      <IconButton label={`Notifications${unread ? `, ${unread} unread` : ""}`} className={compact ? undefined : "size-9"} onClick={() => setOpen((o) => !o)} badge={unread > 0}>
        <Bell className="size-[17px]" />
      </IconButton>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="fixed inset-x-3 top-[68px] z-50 origin-top rounded-2xl border border-line bg-card shadow-float sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[380px] sm:origin-top-right"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-[14px] font-medium">Notifications</p>
              <span className="text-[12.5px] text-ink-muted">{unread} unread</span>
            </div>
            <ul className="max-h-[60dvh] overflow-y-auto p-1.5">
              {notices.length === 0 ? <li className="px-3 py-8 text-center text-[13.5px] text-ink-muted">You&apos;re all caught up.</li> : null}
              {notices.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.href ?? "#"}
                    onClick={() => setOpen(false)}
                    className="flex gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-raised"
                  >
                    <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.unread ? dot[n.tone ?? "info"] : "bg-transparent")} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-medium text-ink">{n.title}</span>
                      {n.body ? <span className="mt-0.5 block text-[13px] text-ink-muted">{n.body}</span> : null}
                    </span>
                    <span className="shrink-0 text-[12px] text-ink-muted tabular">{n.time}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function TabBar({ tabs, fab, pathname }: { tabs: NavItem[]; fab?: ShellProps["fab"]; pathname: string }) {
  const active = [...tabs].sort((a, b) => b.href.length - a.href.length).find((t) => isActive(pathname, t));
  const fabTone = { ink: "bg-ink text-cream", brand: "bg-bus-400 text-[#1d1a2f]", bad: "bg-coral text-white" }[fab?.tone ?? "ink"];
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-end justify-between gap-3 px-4 pb-[max(14px,env(safe-area-inset-bottom))] lg:hidden">
      <nav
        aria-label="Tabs"
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-card/95 p-1.5 shadow-float backdrop-blur-md"
      >
        {tabs.map((t) => {
          const on = active?.href === t.href;
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={on ? "page" : undefined}
              aria-label={t.label}
              className={cn("relative flex h-12 items-center justify-center rounded-full", on ? "px-4" : "w-12")}
            >
              {on ? (
                <motion.span layoutId="rhk-tab" className="absolute inset-0 rounded-full bg-raised" transition={{ type: "spring", stiffness: 500, damping: 40 }} />
              ) : null}
              <span className="relative flex items-center gap-2">
                <Icon className={cn("size-[21px]", on ? "text-ink" : "text-ink-muted")} />
                {on ? <span className="text-[15px] font-medium">{t.label}</span> : null}
                {t.count && !on ? <span className="absolute -right-1 -top-1 size-2 rounded-full bg-coral ring-2 ring-card" /> : null}
              </span>
            </Link>
          );
        })}
      </nav>
      {fab ? (
        <FabEl
          href={fab.href}
          onClick={fab.onClick}
          label={fab.label}
          className={cn("pointer-events-auto relative grid size-[60px] place-items-center rounded-full shadow-float transition-transform active:scale-95", fabTone)}
        >
          {fab.ring !== undefined ? (
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 60 60" aria-hidden>
              <circle cx="30" cy="30" r="27" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="3" />
              <circle
                cx="30"
                cy="30"
                r="27"
                fill="none"
                stroke="var(--color-good)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 27}
                strokeDashoffset={2 * Math.PI * 27 * (1 - fab.ring)}
              />
            </svg>
          ) : null}
          <fab.icon className="relative size-6" />
        </FabEl>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ command menu */

function CommandPalette({ open, onClose, nav, commands }: { open: boolean; onClose: () => void; nav: NavItem[]; commands: Command[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const ref = useRef<HTMLDialogElement>(null);
  const all: Command[] = useMemo(
    () => [
      ...nav.map((n) => ({ label: n.label, href: n.href, icon: n.icon, group: "Go to", hint: n.key ? `G ${n.key.toUpperCase()}` : undefined })),
      ...commands.map((c) => ({ group: "Actions", ...c })),
    ],
    [nav, commands],
  );
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? all.filter((c) => c.label.toLowerCase().includes(s) || c.group?.toLowerCase().includes(s)) : all;
  }, [all, q]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      setQ("");
      setSel(0);
      el.showModal();
    }
    if (!open && el.open) el.close();
  }, [open]);
  useEffect(() => setSel(0), [q]);

  const run = (c: Command) => {
    onClose();
    if (c.run) c.run();
    else if (c.href) (c.href.startsWith("/") ? router.push(c.href) : window.location.assign(c.href));
  };

  let lastGroup = "";
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="mx-auto mt-[12vh] w-[min(640px,calc(100vw-24px))] max-w-none bg-transparent p-0 text-ink backdrop:bg-[rgb(12_10_20/0.32)]"
    >
      <div className="overflow-hidden rounded-[18px] border border-line bg-card shadow-float">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-[18px] text-ink-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(results.length - 1, s + 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(0, s - 1));
              }
              if (e.key === "Enter" && results[sel]) {
                e.preventDefault();
                run(results[sel]);
              }
            }}
            placeholder="Search pages and actions…"
            className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-muted"
          />
          <Kbd>Esc</Kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
          {results.length === 0 ? <li className="px-3 py-10 text-center text-[14px] text-ink-muted">No results for “{q}”</li> : null}
          {results.map((c, i) => {
            const head = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group ?? "";
            const Icon = c.icon;
            return (
              <li key={c.label + i}>
                {head ? <p className="px-3 pb-1 pt-2.5 text-[12px] font-medium text-ink-muted">{head}</p> : null}
                <button
                  type="button"
                  role="option"
                  aria-selected={sel === i}
                  onMouseMove={() => setSel(i)}
                  onClick={() => run(c)}
                  className={cn("flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-left text-[14px]", sel === i ? "bg-raised text-ink" : "text-ink-soft")}
                >
                  {Icon ? <Icon className="size-4 text-ink-muted" /> : <span className="size-4" />}
                  <span className="flex-1">{c.label}</span>
                  {c.hint ? <span className="font-mono text-[11.5px] text-ink-muted">{c.hint}</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-[12px] text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> to move
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd> to open
          </span>
          <span className="ml-auto hidden sm:inline">
            Tip: press <Kbd>G</Kbd> then a letter to jump
          </span>
        </div>
      </div>
    </dialog>
  );
}

/* ------------------------------------------------------------------ page header */

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 pb-6 pt-4 sm:flex-row sm:items-end sm:justify-between lg:pt-6", className)}>
      <div className="min-w-0">
        {eyebrow ? <div className="mb-2">{eyebrow}</div> : null}
        <h1 className="font-display text-[28px] font-medium leading-[1.1] tracking-[-0.035em] text-ink sm:text-[32px]">{title}</h1>
        {description ? <p className="mt-2 max-w-[68ch] text-[14.5px] text-ink-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/** Sets the top-bar breadcrumb's last part for detail pages. */
export function Crumb({ children }: { children: string }) {
  const shell = useShell();
  useEffect(() => {
    shell?.setCrumb(children);
    return () => shell?.setCrumb(null);
  }, [children, shell]);
  return null;
}

function FabEl({ href, onClick, label, className, children }: { href?: string; onClick?: () => void; label: string; className: string; children: ReactNode }) {
  if (href)
    return (
      <Link href={href} aria-label={label} className={className}>
        {children}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} aria-label={label} className={className}>
      {children}
    </button>
  );
}
