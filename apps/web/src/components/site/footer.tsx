import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { contact, nav, services } from "@/content/site";
import { Logo } from "./logo";

async function Year() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="relative z-[2] px-3 pb-3 md:px-5 md:pb-5">
      <div className="mx-auto max-w-[76rem] overflow-hidden rounded-3xl border border-line bg-ink text-cream">
        <div className="grid gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:px-10 md:py-14">
          <div>
            <Logo tone="dark" />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-cream/70">
              Safe, friendly rides to school and back for metro Atlanta families, for 20 years.
            </p>
            <p className="mt-4 font-display text-[13px] font-semibold text-bus-300">
              Dedication, education, safety
            </p>
          </div>

          <div>
            <h2 className="font-display text-[13px] font-semibold text-cream/50">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {[{ label: "Home", href: "/" }, ...nav, { label: "Apply", href: "/application" }].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-[15px] text-cream/85 hover:text-bus-300">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-[13px] font-semibold text-cream/50">Services</h2>
            <ul className="mt-4 space-y-2.5">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className="text-[15px] text-cream/85 hover:text-bus-300">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-[13px] font-semibold text-cream/50">Talk to us</h2>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li>
                <a href={contact.phoneHref} className="inline-flex items-center gap-2.5 text-cream hover:text-bus-300">
                  <Phone className="size-4 text-bus-300" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={contact.emailHref} className="inline-flex items-center gap-2.5 break-all text-cream hover:text-bus-300">
                  <Mail className="size-4 shrink-0 text-bus-300" />
                  {contact.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5 text-cream/85">
                <MapPin className="size-4 text-bus-300" />
                {contact.region}
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-cream/10 px-6 py-5 text-[13px] text-cream/50 md:flex-row md:items-center md:justify-between md:px-10">
          <p>© <Year /> Rush Hour Kids Transportation. All rights reserved.</p>
          <p>Before & after school rides across metro Atlanta</p>
        </div>
      </div>
    </footer>
  );
}
