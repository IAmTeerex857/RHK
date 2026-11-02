"use client";

/* The parent app teaser, with a Metal badge (metal-fx, MIT) and the app phone. */

import { LinkButton } from "@/components/site/link-button";
import { MetalBadge } from "metal-fx";
import { Check } from "lucide-react";
import { appFeatures } from "@/content/site";
import { RoadPoint } from "../route/road-point";
import { AppPhone } from "./app-phone";
import { ClientOnly } from "../util/client-only";

export function AppTeaser() {
  return (
    <section id="app" className="relative py-16 md:py-24">
      <div className="container-page">
        <div className="relative">
        <div className="theme-light relative overflow-hidden rounded-3xl border border-line bg-ink px-6 pt-12 text-cream shadow-float md:px-12 md:pt-16">
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            <div>
              <div className="flex items-center gap-3">
                <p className="font-display text-[13px] font-semibold text-cream/60">The Rush Hour Kids app</p>
                <ClientOnly
                  fallback={<span className="rounded-lg bg-cream/15 px-2.5 py-0.5 text-[12px] font-semibold">New</span>}
                >
                  <MetalBadge>New</MetalBadge>
                </ClientOnly>
              </div>
              <h2 className="mt-3 font-display text-[34px] font-semibold leading-[1.04] tracking-[-0.025em] md:text-[46px]">
                Know where the van is. Every minute
              </h2>
              <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-cream/70">
                Plan rides, follow the van live, get alerts and pay, all in one place. Approved families get a
                personal access code, so only our families and staff can get in.
              </p>
              <ul className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {appFeatures.map((f) => (
                  <li key={f.title} className="flex gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-bus-400 text-ink">
                      <Check className="size-3.5 stroke-[2.5]" />
                    </span>
                    <div>
                      <p className="font-display text-[16px] font-semibold">{f.title}</p>
                      <p className="mt-0.5 text-[14px] leading-relaxed text-cream/60">{f.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-9 lg:pb-16">
                <LinkButton href="/our-app" variant="primary" arrow>
                  See the app
                </LinkButton>
              </div>
            </div>
            {/* the phone rises from the panel's bottom edge */}
            <div className="relative mx-auto w-full max-w-[400px] self-end">
              <AppPhone />
            </div>
          </div>
        </div>
        </div>
      </div>
      {/* the road runs under this panel and comes out bottom-left */}
      <RoadPoint className="absolute hidden lg:block" style={{ left: "10%", bottom: "-40px" }} />
      <RoadPoint className="absolute lg:hidden" style={{ left: "-30%", bottom: "-30px" }} />
    </section>
  );
}
