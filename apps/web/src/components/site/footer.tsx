import Link from "next/link";
import { areas, contact, nav, services } from "@/content/site";
import { LinkButton } from "./link-button";
import { Logo, LogoMark } from "./logo";

async function Year() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
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
