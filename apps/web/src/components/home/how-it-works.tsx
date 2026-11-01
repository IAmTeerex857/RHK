"use client";

/* How it works: four stops on the route, each with a Blobatar buddy (blobatar, MIT). */

import { Blobatar } from "@blobatar/react";
import { happy, idle, love, thinking, wink } from "blobatar/expression";
import "blobatar/motion.css";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@rhk/ui/lib/cn";
import { steps } from "@/content/site";
import { RoadPoint } from "../route/road-point";
import { SectionHeading } from "./section-heading";

const expressions = { thinking, happy, wink, love } as const;

const palettes = [
  { head: "#ffc629", eye: "#1d1a2f" },
  { head: "#4fb3f6", eye: "#1d1a2f" },
  { head: "#3fc48a", eye: "#1d1a2f" },
  { head: "#ff6a4d", eye: "#1d1a2f" },
];

function Step({ i }: { i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const s = steps[i];
  const p = palettes[i];
  const left = i % 2 === 0;
  return (
    <div className={cn("relative lg:grid lg:grid-cols-[1fr_200px_1fr] lg:items-center")}>
      {/* road stop: centre column on desktop, gap between cards on phones */}
      <RoadPoint stop={i + 1} className="absolute hidden lg:block" style={{ left: "50%", top: "50%" }} />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30, rotate: left ? -1.5 : 1.5 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ type: "spring", stiffness: 160, damping: 22 }}
        className={cn(
          "relative flex items-center gap-5 rounded-2xl border border-line bg-white p-5 shadow-card md:p-6",
          left ? "lg:col-start-1" : "lg:col-start-3",
        )}
      >
        <div className={cn("grid size-[92px] shrink-0 place-items-center rounded-2xl bg-raised md:size-[108px]")}>
          <Blobatar
            name={`rhk-step-${i}`}
            size={76}
            animate="always"
            traits={{ shape: s.blob.shape }}
            palette={{ head: p.head, eye: p.eye }}
            expression={inView ? expressions[s.blob.expression] : idle}
            title={s.title}
          />
        </div>
        <div>
          <p className="font-display text-[13px] font-semibold text-ink-muted">Stop {i + 1}</p>
          <h3 className="mt-1 font-display text-[21px] font-semibold leading-tight tracking-[-0.02em] md:text-[23px]">{s.title}</h3>
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
            <div key={i} className="relative">
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
