"use client";

import { LinkButton } from "@/components/site/link-button";
import { MapPin, MessageCircle } from "lucide-react";
import { Accordion } from "@rhk/ui/components/accordion";
import { Button } from "@rhk/ui/components/button";
import { areas, contact, faqs } from "@/content/site";
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
      {/* the road leaves off the left edge beside the heading: the end of the route */}
      <RoadPoint end className="absolute" style={{ left: "-22%", bottom: "0px" }} />
    </section>
  );
}
