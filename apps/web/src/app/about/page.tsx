import type { Metadata } from "next";
import { GraduationCap, HeartHandshake, ShieldCheck } from "lucide-react";
import { School } from "@/components/illustrations/scene-parts";
import { SectionHeading } from "@/components/home/section-heading";
import { StatsBand } from "@/components/home/stats-band";
import { AboutArt } from "@/components/illustrations/hero-art";
import { PageHero } from "@/components/site/page-hero";
import { safety } from "@/content/site";

export const metadata: Metadata = {
  title: "About us",
  description: "Rush Hour Kids Transportation has driven metro Atlanta children to school and back for 20 years.",
};

// CONFIRM: About copy is a draft built from the PRD. Clara to review and add her own story.
const [dedication, education, safetyValue] = [
  {
    icon: HeartHandshake,
    title: "Dedication",
    body: "We know every child on our vans by name. Small routes of 10 to 12 children mean nobody is just a number.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    body: "We help families reach the school that's right for their child, even when it's outside their home district.",
  },
  {
    icon: ShieldCheck,
    title: "Safety",
    body: "Every child is checked on and off, and every van is checked empty at the end of every route.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            Twenty years of safe rides for Atlanta kids
          </>
        }
        body="Rush Hour Kids Transportation started with one simple job: getting children to school and home again safely, so their parents can get on with their day. Twenty years later, that's still the job."
        art={<AboutArt />}
      />

      <StatsBand />

      <section className="py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <SectionHeading
            eyebrow="Our story"
            title={
              <>
                A family business, driving families
              </>
            }
          />
          <div className="space-y-5 text-[17px] leading-relaxed text-ink-soft">
            <p>
              For two decades we&rsquo;ve driven children across Decatur, Stone Mountain, Douglas, Fulton and Gwinnett
              County. Many of our families sign up so their child can attend a school outside their home district, and we
              make that daily trip possible.
            </p>
            <p>
              Today we run four vans, each with its own route and about 10 to 12 children. Beyond the school run we cover
              daily trips, satellite stops, field trips and summer programs.
            </p>
            <p>
              Now we&rsquo;re bringing parents, drivers and our office together in one app, so you can follow the van live,
              get an alert when your child boards and arrives, and pay in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-page">
          <SectionHeading eyebrow="What we stand for" title="Dedication, education, safety" align="center" />
          {/* three tiles, three kinds: a statement on ink, an object on white, an icon on yellow */}
          <div className="mt-12 grid gap-4 md:grid-cols-[1.25fr_1fr] lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-5">
            <div className="flex flex-col justify-between rounded-2xl border border-ink bg-ink p-7 text-cream shadow-card md:row-span-2 lg:row-span-1 md:p-9">
              <p className="font-display text-[15px] font-medium text-cream/60">{dedication.title}</p>
              <p className="mt-10 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[42px]">
                Every child known by name
              </p>
              <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-cream/70">{dedication.body}</p>
            </div>
            <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card">
              <div className="grid h-[150px] place-items-end bg-mint-soft px-6">
                <svg viewBox="-160 -150 320 160" className="h-[130px] w-auto" aria-hidden>
                  <School x={0} y={0} s={0.9} />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="font-display text-[22px] font-semibold tracking-[-0.02em]">{education.title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{education.body}</p>
              </div>
            </div>
            <div className="flex flex-col rounded-2xl border border-bus-500 bg-bus-400 p-6 shadow-card">
              <span className="grid size-14 place-items-center rounded-2xl bg-white/60">
                <ShieldCheck className="size-7" />
              </span>
              <h3 className="mt-auto pt-10 font-display text-[22px] font-semibold tracking-[-0.02em]">{safetyValue.title}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-ink/75">{safetyValue.body}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-page">
          <div className="rounded-3xl border border-line bg-raised p-6 shadow-float md:p-12">
            <SectionHeading eyebrow="Our promise" title="Here's how we keep every ride safe" />
            {/* one panel ruled into four, no gaps */}
            <div className="mt-10 grid overflow-hidden rounded-2xl border border-line bg-white sm:grid-cols-2">
              {safety.map((s, i) => (
                <div
                  key={s.title}
                  className="flex gap-4 border-line p-6 max-sm:[&:not(:last-child)]:border-b sm:odd:border-r sm:[&:nth-child(-n+2)]:border-b md:p-7"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-bus-400 font-display text-[15px] font-semibold tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-[18px] font-semibold">{s.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
