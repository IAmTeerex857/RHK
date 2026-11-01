import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@rhk/ui/components/button";
import { AreasMap } from "@/components/home/areas-map";
import { SectionHeading } from "@/components/home/section-heading";
import { PageHero } from "@/components/site/page-hero";
import { areas, contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Service areas",
  description: "Rush Hour Kids drives children across Decatur, Stone Mountain, Douglas County, Fulton County and Gwinnett County.",
};


export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        route
        eyebrow="Service areas"
        title={
          <>
            Five areas across metro Atlanta
          </>
        }
        body="Our four vans run routes across these areas. Not sure if we reach your home or school? Call us and we'll check your address and whether a van has space."
      >
        <Button href={contact.phoneHref} size="lg" icon={<Phone className="size-[18px]" />}>
          Check my address
        </Button>
      </PageHero>

      <section className="relative z-[2] pb-20 pt-4 md:pb-28 md:pt-6">
        <div className="container-page grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
          <AreasMap />
          <ul className="grid gap-3">
            {areas.map((a) => (
              <li key={a.name} className={`flex items-center gap-4 rounded-2xl border border-line p-4 bg-white shadow-subtle`}>
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-raised text-ink-soft">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <p className="font-display text-[18px] font-semibold">{a.name}</p>
                  <p className="text-[14px] text-ink-muted">{a.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-page">
          <div className="grid gap-8 rounded-3xl border border-line bg-white p-6 shadow-float md:grid-cols-[1fr_1.2fr] md:p-12">
            <SectionHeading
              eyebrow="Satellite stops"
              title={
                <>
                  School outside your district? Meet the van
                </>
              }
            />
            <div className="space-y-4 text-[17px] leading-relaxed text-ink-soft">
              <p>
                Satellite stops let you meet our drivers at a set location near you. It&rsquo;s the easiest way for your child
                to attend a school in your preferred district, even if it&rsquo;s outside your home area.
              </p>
              <p>Call us to find the satellite stop closest to you</p>
              <a href={contact.phoneHref} className="inline-flex items-center gap-2 font-display text-[18px] font-semibold text-ink hover:text-coral">
                <Phone className="size-4" /> {contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
