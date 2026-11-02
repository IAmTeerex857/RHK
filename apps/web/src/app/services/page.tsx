import type { Metadata } from "next";
import { LinkButton } from "@/components/site/link-button";
import { Check, Phone } from "lucide-react";
import { Button } from "@rhk/ui/components/button";
import { cn } from "@rhk/ui/lib/cn";
import { contact, services } from "@/content/site";
import { ServiceIcon } from "@/components/home/service-icon";
import { ServicesArt } from "@/components/illustrations/hero-art";
import { ServicePicture } from "@/components/services/service-picture";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Our services",
  description:
    "Before and after school pick-up and drop-off, daily trips, satellite stops, one-way and round trips, monthly plans, field trips and summer programs across metro Atlanta.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title={
          <>
            Every kind of ride, one friendly crew
          </>
        }
        body="Whatever your week looks like, there's a ride for it. Prices depend on the days and trips you need, so call us for a quote."
        art={<ServicesArt />}
      >
        <div className="flex flex-wrap gap-3">
          <Button href={contact.phoneHref} size="lg" icon={<Phone className="size-[18px]" />}>
            Call for a quote
          </Button>
          <LinkButton href="/application" variant="outline" size="lg" arrow>
            Apply now
          </LinkButton>
        </div>
      </PageHero>

      <nav aria-label="Services on this page" className="container-page relative z-[2] -mt-6 mb-6">
        <ul className="flex flex-wrap gap-2">
          {services.map((s) => (
            <li key={s.slug}>
              <a
                href={`#${s.slug}`}
                className="inline-flex rounded-lg border border-line bg-card px-3.5 py-1.5 text-[14px] font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-page relative z-[2] flex flex-col gap-6 pb-16 md:gap-8 md:pb-24">
        {services.map((s, i) => (
          <article
            key={s.slug}
            id={s.slug}
            className={cn(
              "relative grid scroll-mt-28 gap-8 overflow-hidden rounded-3xl border border-line p-6 shadow-card md:grid-cols-[1.4fr_1fr] md:p-10",
              "bg-card",
            )}
          >
            <div>
              <div className="flex items-center gap-4">
                <ServiceIcon icon={s.icon} className="size-14 rounded-2xl" />
                <span className="font-display text-[13px] font-semibold text-ink-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="mt-5 font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.025em] md:text-[38px]">{s.title}</h2>
              <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-soft">{s.body}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={contact.phoneHref} variant="ink" size="sm" icon={<Phone className="size-4" />}>
                  Get a quote
                </Button>
                <LinkButton href="/application" variant="outline" size="sm" arrow>
                  Apply
                </LinkButton>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <ServicePicture slug={s.slug} />
              <ul className="flex flex-col gap-2.5 px-1">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[15px] font-medium">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mint">
                      <Check className="size-3 stroke-[2.75]" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
