import Link from "next/link";
import { Activity, ChevronDown, ChevronRight, Route } from "lucide-react";
import { areas, contact, nav, services } from "@/content/site";
import { LinkButton } from "./link-button";
import { Logo, LogoMark } from "./logo";

async function Year() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

/* -------------------------------------------------------------------------------------------- */
/* The office view: routes on the left, today's ride log on the right, tilted and fading out.    */
/* -------------------------------------------------------------------------------------------- */

const TREE: { label: string; depth: number; open?: boolean; on?: boolean; leaf?: boolean }[] = [
  { label: "Van 2 · Stone Mountain", depth: 0, open: true, on: true },
  { label: "Morning run", depth: 1, open: true },
  { label: "Pick-up stops", depth: 2, leaf: true },
  { label: "School drop-off", depth: 2, leaf: true },
  { label: "Afternoon run", depth: 1 },
  { label: "Van 1 · Decatur", depth: 0 },
  { label: "Van 3 · Gwinnett", depth: 0 },
  { label: "Van 4 · Fulton", depth: 0 },
];

const LOG: { t: string; text: string; tone: string }[] = [
  { t: "07:02", text: "Driver is on the way", tone: "text-bus-300" },
  { t: "07:09", text: "Driver is close", tone: "text-bus-300" },
  { t: "07:13", text: "Ava checked on", tone: "text-mint" },
  { t: "07:18", text: "Leo checked on", tone: "text-mint" },
  { t: "07:26", text: "Maya checked on", tone: "text-mint" },
  { t: "07:41", text: "Arrived at school", tone: "text-sky" },
  { t: "07:41", text: "Ava, Leo, Maya checked off", tone: "text-mint" },
  { t: "07:44", text: "Van walked, empty", tone: "text-lilac" },
  { t: "07:45", text: "Morning run closed", tone: "text-lilac" },
];

function OfficeView() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-[-18%] top-20 hidden w-[820px] select-none lg:block xl:right-[-10%]"
      style={{
        transform: "perspective(1600px) rotateX(34deg) rotateY(-20deg) rotateZ(10deg)",
        transformOrigin: "left top",
        maskImage: "linear-gradient(180deg, #000 25%, transparent 88%), linear-gradient(90deg, transparent, #000 18%)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <div className="grid grid-cols-[1fr_1.35fr] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,198,41,0.08)]">
        {/* routes */}
        <div className="border-r border-white/10">
          <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4 text-[18px] text-cream/80">
            <Route className="size-5" />
            Routes
          </div>
          <ul className="space-y-3.5 px-5 py-5 text-[15px]">
            {TREE.map((n) => (
              <li
                key={n.label}
                className={`flex items-center gap-2 ${n.on ? "text-bus-300" : "text-cream/60"}`}
                style={{ paddingLeft: n.depth * 22 }}
              >
                {n.leaf ? (
                  <span className="size-4" />
                ) : n.open ? (
                  <ChevronDown className="size-4 opacity-70" />
                ) : (
                  <ChevronRight className="size-4 opacity-70" />
                )}
                <span className={`size-2 rounded-full ${n.depth === 0 ? "bg-current" : "border border-current"}`} />
                {n.label}
              </li>
            ))}
          </ul>
        </div>
        {/* today's log */}
        <div>
          <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4 text-[18px] text-cream/80">
            <Activity className="size-5" />
            Today
          </div>
          <ol className="space-y-2.5 px-5 py-5 font-mono text-[14px]">
            {LOG.map((l, i) => (
              <li key={i} className="flex gap-4 whitespace-nowrap">
                <span className="w-5 text-right text-cream/25">{i + 1}</span>
                <span className="text-cream/45">{l.t}</span>
                <span className={l.tone}>{l.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------- */

const colHead = "font-display text-[16px] font-semibold text-cream";
const colLink = "text-[15px] text-cream/55 transition-colors hover:text-cream";

export function Footer() {
  const company = [{ label: "Home", href: "/" }, ...nav, { label: "Apply", href: "/application" }];
  return (
    <footer className="relative z-[2] overflow-hidden bg-ink text-cream">
      {/* call to action */}
      <div className="relative">
        <OfficeView />
        <div className="container-page relative pb-20 pt-24 md:pb-28 md:pt-32">
          <div className="max-w-[36rem]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-[14px] text-cream/85">
              <LogoMark className="size-6" />
              Before and after school rides
            </span>
            <h2 className="mt-6 font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[64px]">
              Ready to ride? Save your child&rsquo;s seat
            </h2>
            <p className="mt-6 max-w-[32rem] text-[17px] leading-relaxed text-cream/65 md:text-[18px]">
              Apply online in a few minutes, or call us and we&rsquo;ll check whether a van has space on your route.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <LinkButton href="/application" size="lg" arrow>
                Start your application
              </LinkButton>
              <a href={contact.phoneHref} className="text-[15px] text-cream/70 underline-offset-4 transition-colors hover:text-cream hover:underline">
                or call {contact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* links */}
      <div className="container-page relative grid grid-cols-2 gap-x-6 gap-y-12 pb-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8">
        <div className="col-span-2 lg:col-span-1">
          <Logo tone="dark" />
          <p className="mt-5 max-w-[22rem] text-[15px] leading-relaxed text-cream/55">
            Safe, friendly rides to school and back for metro Atlanta families, for 20 years.
          </p>
          <a href={contact.emailHref} className="mt-5 inline-block text-[15px] text-cream/70 transition-colors hover:text-cream">
            {contact.email}
          </a>
        </div>
        <nav aria-label="Company">
          <h2 className={colHead}>Company</h2>
          <ul className="mt-5 space-y-3">
            {company.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={colLink}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Services">
          <h2 className={colHead}>Services</h2>
          <ul className="mt-5 space-y-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`} className={colLink}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Where we drive" className="col-span-2 sm:col-span-1">
          <h2 className={colHead}>Where we drive</h2>
          <ul className="mt-5 space-y-3">
            {areas.map((a) => (
              <li key={a.name}>
                <Link href="/service-areas" className={colLink}>
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* copyright and the big wordmark */}
      <div className="relative pt-6">
        <p className="relative z-[1] text-center text-[15px] leading-[1.7] text-cream/50">
          © <Year />
          <br />
          Rush Hour Kids Transportation
          <br />
          Safe rides, every school day
        </p>
        <div aria-hidden className="relative mt-4 h-[11vw] max-h-[170px] overflow-hidden">
          <p className="absolute inset-x-0 top-0 whitespace-nowrap text-center font-display text-[13vw] font-normal leading-[0.85] tracking-[-0.045em] text-white/[0.07] xl:text-[200px]">
            Rush Hour Kids
          </p>
        </div>
      </div>
    </footer>
  );
}
