import type { Metadata } from "next";
import { LinkButton } from "@/components/site/link-button";
import { CalendarCheck, KeyRound, Smartphone } from "lucide-react";
import { RideTracker } from "@/components/home/ride-tracker";
import { SectionHeading } from "@/components/home/section-heading";
import { FeaturesBento } from "@/components/app/features-bento";
import { AppHero } from "@/components/app/app-hero";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Our app",
  description: "Follow the van live, get an alert when your child boards and arrives, see your bills and message the office, all in the Rush Hour Kids app.",
};


const rideDay = [
  { driver: "Starts the route", parent: "“Driver is 8 min away” as the van gets close", office: "The van on the live map" },
  { driver: "Checks Ava on", parent: "“Ava boarded safely”", office: "Who is on board" },
  { driver: "Taps “Running late”", parent: "“Delay: 6 minutes”", office: "The delay on the map" },
  { driver: "Checks Ava off", parent: "“Arrived at drop-off”", office: "Drop-off confirmed" },
];

const getIt = [
  { icon: KeyRound, title: "Set your password", body: "Once the office approves your application, we email you a link to set your password." },
  { icon: Smartphone, title: "Add it to your home screen", body: "Open the app on your phone and add it to your home screen. Each sign-in also asks for a code we email you." },
  { icon: CalendarCheck, title: "Set up your family", body: "Add your children's photos and the adults allowed to receive them, and check your addresses." },
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
        body="Follow the van live, get alerts, see your bills and message the office, all in one place. Only families the office approves can sign in, with a password and a code we email each time."
        art={<AppHero />}
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
            <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-card shadow-card">
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
              <li key={title} className="relative rounded-2xl border border-line bg-card p-6 shadow-card">
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
    </>
  );
}
