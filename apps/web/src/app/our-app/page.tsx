import type { Metadata } from "next";
import { LinkButton } from "@/components/site/link-button";
import { CalendarCheck, KeyRound, Smartphone } from "lucide-react";
import { FinalCta } from "@/components/home/areas-faq-cta";
import { RideTracker } from "@/components/home/ride-tracker";
import { SectionHeading } from "@/components/home/section-heading";
import { FeaturesBento } from "@/components/app/features-bento";
import { AppArt } from "@/components/illustrations/hero-art";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Our app",
  description: "Follow the van live, get an alert when your child boards and arrives, plan rides and pay, all in the Rush Hour Kids app.",
};


const rideDay = [
  { driver: "Starts the route", parent: "“Driver is 8 min away” as the van gets close", office: "The van on the live map" },
  { driver: "Checks Ava on", parent: "“Ava boarded safely”", office: "Who is on board" },
  { driver: "Taps “Running late”", parent: "“Delay: 6 minutes”", office: "The delay on the map" },
  { driver: "Checks Ava off", parent: "“Arrived at drop-off”", office: "Drop-off confirmed" },
];

const getIt = [
  { icon: KeyRound, title: "Get your access code", body: "Once your application is approved, we text and email you a download link and your personal access code." },
  { icon: Smartphone, title: "Install and sign in", body: "Install the app from the private link, enter your code and set a password." },
  { icon: CalendarCheck, title: "Plan your first week", body: "Pick a plan, confirm pick-up and drop-off addresses, and choose your days." },
];

export default function OurAppPage() {
  return (
    <>
      <PageHero
        eyebrow="The Rush Hour Kids app"
        title={
          <>
            Know where the van is. Every minute
          </>
        }
        body="Plan rides, follow the van live, get alerts and pay, all in one place. Only approved families and staff can get in, with a personal access code."
        art={<AppArt />}
      >
        <LinkButton href="/application" size="lg" arrow>
          Apply to get access
        </LinkButton>
      </PageHero>

      <section className="relative z-[2] pb-20 md:pb-28">
        <div className="container-page">
          <FeaturesBento />
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-page grid items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="A ride day"
              title={
                <>
                  Every tap the driver makes reaches you
                </>
              }
              body="Nobody has to text anyone. Here's what you see, and what our office sees, as the driver works the route."
            />
            <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
              <div className="grid grid-cols-3 border-b border-line bg-raised font-display text-[13px] font-semibold">
                <span className="p-3 md:p-4">The driver</span>
                <span className="border-l border-line p-3 md:p-4">You see</span>
                <span className="border-l border-line p-3 md:p-4">Office sees</span>
              </div>
              {rideDay.map((r) => (
                <div key={r.driver} className="grid grid-cols-3 border-b border-line text-[14px] leading-snug last:border-0 md:text-[15px]">
                  <span className="p-3 font-semibold md:p-4">{r.driver}</span>
                  <span className="border-l border-line p-3 md:p-4">{r.parent}</span>
                  <span className="border-l border-line p-3 text-ink-soft md:p-4">{r.office}</span>
                </div>
              ))}
            </div>
          </div>
          <RideTracker />
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-page">
          <SectionHeading eyebrow="Getting the app" title="Three steps after you're approved" align="center" />
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {getIt.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="relative rounded-2xl border border-line bg-white p-6 shadow-card">
                <span className="absolute -top-4 left-6 grid size-9 place-items-center rounded-full bg-bus-400 font-display text-[15px] font-semibold">
                  {i + 1}
                </span>
                <Icon className="mt-3 size-7 text-ink" strokeWidth={2.2} />
                <h3 className="mt-4 font-display text-[19px] font-semibold">{title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{body}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-8 max-w-xl text-center text-[15px] text-ink-muted">
            Children don&rsquo;t need a phone. The driver checks them on and off, and the alerts come to you.
          </p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
