import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { areas, contact, nav, services } from "@/content/site";
import { BusSide } from "../illustrations/bus-side";
import { LogoMark } from "./logo";

async function Year() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

/** Round stamp: the Road R inside the motto, set on a circle. */
function Stamp() {
  const motto = "Dedication · Education · Safety · Rush Hour Kids · ";
  return (
    <div className="relative size-[148px] md:size-[164px]">
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" aria-hidden>
        <circle cx="100" cy="100" r="96" fill="#2b2840" />
        <circle cx="100" cy="100" r="96" fill="none" stroke="#ffffff" strokeWidth="5" />
        <defs>
          <path id="rhk-stamp-ring" d="M100 100 m-72 0 a72 72 0 1 1 144 0 a72 72 0 1 1 -144 0" />
        </defs>
        <g className="rhk-stamp-spin" style={{ transformOrigin: "100px 100px" }}>
          <text fontSize="14.5" fontWeight="600" letterSpacing="2.6" fill="#ffffff" style={{ fontFamily: "var(--font-display)" }}>
            <textPath href="#rhk-stamp-ring">{motto.toUpperCase()}</textPath>
          </text>
        </g>
      </svg>
      <LogoMark className="absolute left-1/2 top-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

const linkCls = "text-[15px] text-cream/85 sm:text-[16px] transition-colors hover:text-bus-300 md:text-[17px]";

export function Footer() {
  const company = [{ label: "Home", href: "/" }, ...nav, { label: "Apply", href: "/application" }];
  return (
    <footer className="relative z-[2] mt-4 bg-ink text-cream">
      <div className="container-page">
        {/* heading */}
        <div className="relative flex flex-col gap-3 pb-10 pt-16 lg:flex-row lg:items-baseline lg:gap-5 md:pb-12 md:pt-24 xl:pr-[200px]">
          <h2 className="font-display text-[40px] font-semibold leading-[1] tracking-[-0.035em] sm:text-[52px] lg:whitespace-nowrap lg:text-[54px] xl:text-[56px]">
            Safe rides, every school day
          </h2>
          <p className="text-[16px] text-bus-300 md:text-[17px] lg:whitespace-nowrap">Talk to us about your child&rsquo;s ride</p>
          <BusSide className="rhk-float pointer-events-none absolute -bottom-6 right-0 hidden h-auto w-[170px] rotate-[-5deg] xl:block" />
        </div>

        {/* big contact row */}
        <div className="grid border-y border-cream/15 md:grid-cols-2">
          {[
            { label: "Call or text", value: contact.phone, href: contact.phoneHref },
            { label: "Email", value: contact.email, href: contact.emailHref },
          ].map((c, i) => (
            <a
              key={c.href}
              href={c.href}
              className={`group flex items-center justify-between gap-6 py-7 md:py-9 ${i === 0 ? "md:border-r md:border-cream/15 md:pr-10" : "border-t border-cream/15 md:border-t-0 md:pl-10"}`}
            >
              <span className="min-w-0">
                <span className="block text-[14px] text-cream/50">{c.label}</span>
                <span className="mt-1 block font-display text-[20px] font-semibold tracking-[-0.02em] text-cream transition-colors [overflow-wrap:anywhere] group-hover:text-bus-300 sm:text-[30px] lg:text-[28px] xl:text-[34px]">
                  {c.value}
                </span>
              </span>
              <ArrowRight className="size-7 shrink-0 text-bus-300 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          ))}
        </div>

        {/* columns, split by hairlines */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="col-span-2 flex items-start py-10 sm:col-span-1 lg:py-14 lg:pr-10">
            <Stamp />
          </div>
          <nav aria-label="Company" className="border-t border-cream/15 py-10 pr-4 sm:border-l sm:border-t-0 sm:pl-8 lg:py-14">
            <h2 className="text-[14px] font-medium text-cream/50">Company</h2>
            <ul className="mt-6 space-y-3.5">
              {company.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={linkCls}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Services" className="border-l border-t border-cream/15 py-10 pl-5 sm:border-l-0 sm:pl-0 lg:border-l lg:border-t-0 lg:pl-8 lg:py-14">
            <h2 className="text-[14px] font-medium text-cream/50">Services</h2>
            <ul className="mt-6 space-y-3.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className={linkCls}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Service areas" className="col-span-2 border-t border-cream/15 py-10 sm:col-span-1 sm:border-l sm:pl-8 lg:border-t-0 lg:py-14">
            <h2 className="text-[14px] font-medium text-cream/50">Where we drive</h2>
            <ul className="mt-6 space-y-3.5">
              {areas.map((a) => (
                <li key={a.name}>
                  <Link href="/service-areas" className={linkCls}>
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[14px] text-cream/50">{contact.region}</p>
          </nav>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="container-page flex flex-col gap-2 py-6 text-[13px] text-cream/50 md:flex-row md:items-center md:justify-between">
          <p>
            © <Year /> Rush Hour Kids Transportation. All rights reserved.
          </p>
          <p>Before and after school rides across metro Atlanta</p>
        </div>
      </div>
    </footer>
  );
}
