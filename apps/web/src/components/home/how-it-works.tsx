"use client";

/* How it works: four stops on the route, each card led by its moment in the product. */

import { motion } from "motion/react";
import { cn } from "@rhk/ui/lib/cn";
import { steps } from "@/content/site";
import { RoadPoint } from "../route/road-point";
import { SectionHeading } from "./section-heading";
import { stepPictures } from "./step-pictures";

function Step({ i }: { i: number }) {
  const s = steps[i];
  const left = i % 2 === 0;
  const Picture = stepPictures[i];
  return (
    <div className={cn("relative lg:grid lg:grid-cols-[1fr_200px_1fr] lg:items-center")}>
      {/* road stop: centre column on desktop, gap between cards on phones */}
      <RoadPoint stop={i + 1} className="absolute hidden lg:block" style={{ left: "50%", top: "50%" }} />
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: left ? -1.5 : 1.5 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: "spring", stiffness: 160, damping: 22 }}
        className={cn(
          "relative flex flex-col gap-5 rounded-2xl border border-line bg-card p-4 shadow-card md:p-5",
          left ? "lg:col-start-1" : "lg:col-start-3",
        )}
      >
        <Picture />
        <div className="px-1 pb-1">
          <p className="font-display text-[13px] font-semibold text-ink-muted">Stop {i + 1}</p>
          <h3 className="mt-2 font-display text-[21px] font-semibold leading-tight tracking-[-0.02em] md:text-[23px]">{s.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
        </div>
      </motion.div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative pb-20 pt-48 md:pb-28 lg:pt-28">
      <div className="container-page relative">
        <SectionHeading
          className="pr-14 lg:pr-0"
          eyebrow="How it works"
          title={
            <>
              From application to first ride, without the paperwork
            </>
          }
          body="Four stops and you're on the route. Follow the bus."
        />
        {/* phones: road leaves to the right of the heading, then weaves between the cards */}
        <RoadPoint className="absolute lg:hidden" style={{ left: "130%", top: "120px" }} />

        <div className="relative mt-14 flex flex-col gap-16 md:mt-16 lg:gap-10">
          <RoadPoint className="absolute lg:hidden" style={{ left: "96%", top: "-34px" }} />
          {steps.map((_, i) => (
            <div key={i} className={cn("relative", i > 0 && "lg:-mt-48")}>
              <Step i={i} />
              {i < steps.length - 1 ? (
                <RoadPoint className="absolute lg:hidden" style={{ left: i % 2 === 0 ? "10%" : "90%", bottom: "-32px" }} />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
