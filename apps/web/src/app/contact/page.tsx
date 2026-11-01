import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactArt } from "@/components/illustrations/hero-art";
import { PageHero } from "@/components/site/page-hero";
import { areas, contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Call or text Rush Hour Kids Transportation on ${contact.phone}, or email ${contact.email}.`,
};

const [call, text, email] = [
  { icon: Phone, title: "Call us", value: contact.phone, href: contact.phoneHref, note: "Quotes, questions and sign-ups" },
  { icon: MessageCircle, title: "Text us", value: contact.phone, href: contact.smsHref, note: "Quick questions" },
  { icon: Mail, title: "Email us", value: contact.email, href: contact.emailHref, note: "We'll reply as soon as we can" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        art={<ContactArt />}
        eyebrow="Contact"
        title={
          <>
            We&rsquo;re one call or text away
          </>
        }
        body="Ask for a quote, check whether we drive to your school, or get help with an application."
      />

      <section className="relative z-[2] pb-20 md:pb-28">
        <div className="container-page">
          {/* one tall lead tile (call) and two beside it (text, email) */}
          <div className="grid gap-4 md:grid-cols-[1.15fr_1fr] lg:gap-5">
            <a
              href={call.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-bus-500 bg-bus-400 p-7 shadow-card transition-shadow hover:shadow-float md:row-span-2 md:p-9"
            >
              <span className="grid size-14 place-items-center rounded-2xl bg-white/60">
                <Phone className="size-6" />
              </span>
              <p className="mt-10 font-display text-[16px] font-medium text-ink/70">{call.title}</p>
              <p className="mt-1 whitespace-nowrap font-display text-[34px] font-semibold tabular-nums tracking-[-0.03em] sm:text-[44px] lg:text-[52px]">
                {call.value}
              </p>
              <p className="mt-2 text-[16px] text-ink/75">{call.note}</p>
              <span className="mt-8 inline-flex items-center gap-2 self-start rounded-xl bg-ink px-5 py-3 text-[15px] font-medium text-cream md:mt-auto">
                Call now
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>

            <a
              href={text.href}
              className="group flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-card transition-shadow hover:shadow-float sm:flex-row sm:items-center"
            >
              <div className="flex shrink-0 flex-col gap-1.5 sm:w-[46%]">
                <span className="self-start rounded-2xl rounded-bl-md bg-raised px-3.5 py-2.5 text-[14px]">Hi, quick question</span>
                <span className="flex flex-col gap-1.5 self-end rounded-2xl rounded-br-md bg-bus-400 px-3.5 py-3">
                  <span className="h-2 w-24 rounded-full bg-ink/25" />
                  <span className="h-2 w-16 rounded-full bg-ink/25" />
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-[20px] font-semibold">{text.title}</h2>
                <p className="mt-1 font-display text-[17px] font-semibold tabular-nums">{text.value}</p>
                <p className="mt-1 text-[14px] text-ink-muted">{text.note}</p>
              </div>
            </a>

            <a
              href={email.href}
              className="group flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-card transition-shadow hover:shadow-float sm:flex-row sm:items-center"
            >
              <div className="grid shrink-0 place-items-center sm:w-[46%]">
                <svg viewBox="0 0 128 88" className="h-[72px] w-auto" aria-hidden>
                  <g transform="rotate(-6 64 44)">
                    <rect x="2" y="2" width="124" height="84" rx="10" fill="#fff" stroke="#1d1a2f" strokeWidth="3" />
                    <path d="M8 78 L52 42 M120 78 L76 42" stroke="#1d1a2f" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M4 12 Q4 4 14 4 H114 Q124 4 124 12 L64 54 Z" fill="#ff6a4d" stroke="#1d1a2f" strokeWidth="3" strokeLinejoin="round" />
                    <circle cx="64" cy="42" r="8" fill="#ffd45f" stroke="#1d1a2f" strokeWidth="2.5" />
                  </g>
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-[20px] font-semibold">{email.title}</h2>
                <p className="mt-1 break-all font-display text-[17px] font-semibold">{email.value}</p>
                <p className="mt-1 text-[14px] text-ink-muted">{email.note}</p>
              </div>
            </a>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <ContactForm />
            <aside className="flex flex-col gap-4">
              <div className="rounded-2xl border border-line bg-lilac-soft p-6 shadow-card">
                <h2 className="font-display text-[19px] font-semibold">Where we drive</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {areas.map((a) => (
                    <li key={a.name} className="rounded-lg border border-line bg-white px-3 py-1.5 text-[14px] font-semibold">
                      {a.name}
                    </li>
                  ))}
                </ul>
                <Link href="/service-areas" className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
                  See service areas <ArrowUpRight className="size-4" />
                </Link>
              </div>
              <div className="rounded-2xl border border-line bg-bus-100 p-6 shadow-card">
                <h2 className="font-display text-[19px] font-semibold">Ready to sign up?</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">The online application takes about five minutes.</p>
                <Link href="/application" className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
                  Start an application <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
