"use client";

import { LinkButton } from "@/components/site/link-button";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Accordion } from "@rhk/ui/components/accordion";
import { Button } from "@rhk/ui/components/button";
import { applicationFee, areas, contact, faqs } from "@/content/site";
import { BusSide } from "../illustrations/bus-side";
import { RoadPoint } from "../route/road-point";
import { AreasMap } from "./areas-map";
import { SectionHeading } from "./section-heading";

export function Areas() {
  return (
    <section id="areas" className="relative py-20 md:py-28">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="relative order-2 lg:order-1">
          {/* road runs under the map */}
          <RoadPoint className="absolute hidden lg:block" style={{ left: "40%", top: "50%" }} />
          <AreasMap />
        </div>
        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="Where we drive"
            title={
              <>
                Five areas across metro Atlanta
              </>
            }
            body="Not sure if you're on a route? Call us. We'll check your address and whether a van has space."
          />
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {areas.map((a) => (
              <li key={a.name} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-[14px] font-semibold shadow-subtle">
                <MapPin className="size-4 text-ink-muted" />
                {a.name}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <LinkButton href="/service-areas" variant="outline" arrow>
              Service areas
            </LinkButton>
          </div>
        </div>
      </div>
      <RoadPoint className="absolute hidden lg:block" style={{ left: "-12%", bottom: "-80px" }} />
      <RoadPoint className="absolute lg:hidden" style={{ left: "-30%", bottom: "-20px" }} />
    </section>
  );
}

export function FaqPreview() {
  return (
    <section id="faq" className="relative py-20 md:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="Questions"
            title={
              <>
                Parents ask us all the time
              </>
            }
            body="Can't find your answer? We're one call or text away."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/faq" variant="outline" arrow>
              All questions
            </LinkButton>
            <Button href={contact.smsHref} variant="ghost" icon={<MessageCircle className="size-[18px]" />}>
              Text us
            </Button>
          </div>
        </div>
        <Accordion items={faqs.slice(0, 5)} />
      </div>
      {/* stays off the left edge beside the heading, then swings into the final card */}
      <RoadPoint className="absolute" style={{ left: "-22%", bottom: "0px" }} />
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative pb-16 pt-6 md:pb-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-bus-400 px-6 pb-0 pt-12 shadow-float md:px-14 md:pt-16">
          <RoadPoint end className="absolute" style={{ left: "50%", top: "70%" }} />
          {/* a stretch of road along the bottom of the card for the bus to stand on */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[52px] border-t-[3px] border-ink bg-road">
            <div className="h-[7px] border-b-[3px] border-ink bg-sand" />
            <div className="absolute inset-x-0 top-[26px] h-[5px] [background:repeating-linear-gradient(90deg,var(--color-road-line)_0_30px,transparent_30px_56px)]" />
          </div>
          <div className="relative grid items-end gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="pb-24 md:pb-28">
              <h2 className="font-display text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-[58px]">
                Ready to ride? Save your child&rsquo;s seat
              </h2>
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink/80">
                Apply online in a few minutes. One application per child, with a ${applicationFee} application fee to hold
                the spot.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
<LinkButton href="/application" variant="ink" size="lg" arrow>
                  Start your application
                </LinkButton>
                <Button href={contact.phoneHref} variant="outline" size="lg" icon={<Phone className="size-[18px]" />}>
                  Call {contact.phone}
                </Button>
              </div>
            </div>
            <div className="relative mx-auto mb-[30px] w-full max-w-[440px] self-end">
              <svg viewBox="0 0 460 252" className="block w-full overflow-visible" aria-hidden>
                <circle cx="300" cy="110" r="96" fill="#ffeaa7" />
                {/* the bus, its wheels on the road below */}
                <BusSide x={40} y={36} width={380} height={230} />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
