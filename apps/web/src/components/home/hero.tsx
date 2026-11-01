"use client";

import { LinkButton } from "@/components/site/link-button";
import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Phone, ShieldCheck } from "lucide-react";
import { Button } from "@rhk/ui/components/button";
import { contact } from "@/content/site";
import { HeroScene } from "../hero/hero-scene";

const words = ["Safe", "rides", "to", "school", "and", "back,"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const rise = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { delay: 0.08 + i * 0.06, type: "spring" as const, stiffness: 220, damping: 26 },
        };

  return (
    <section ref={ref} className="relative overflow-hidden pt-[108px] md:pt-[120px]">
      {/* soft confetti in the background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="rhk-float absolute right-[10%] top-[9%] size-3 rounded-full bg-coral lg:right-auto lg:left-[6%] lg:top-[22%]" />
        <span className="rhk-float absolute right-[22%] top-[13%] size-2.5 lg:right-auto lg:left-[44%] lg:top-[16%] rotate-12 rounded-[3px] bg-sky [animation-delay:1.2s]" />
        <span className="rhk-float absolute left-[30%] top-[78%] hidden size-3 rounded-full bg-lilac md:block [animation-delay:0.6s]" />
      </div>

      <div className="container-page grid items-end gap-6 lg:grid-cols-[1fr_1.08fr] lg:gap-4">
        <div className="relative z-10 pb-2 lg:pb-28">
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2 text-[15px] font-medium text-ink-soft"
          >
            <ShieldCheck className="size-4 text-ink-muted" />
            20 years driving metro Atlanta kids
          </motion.p>

          <h1 className="mt-5 font-display text-[42px] font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-[56px] lg:text-[68px]">
            <span className="sr-only">Safe rides to school and back, every school day</span>
            <span aria-hidden>
              {words.map((w, i) => (
                <motion.span key={i} {...rise(i + 1)} className="mr-[0.22em] inline-block">
                  {w}
                </motion.span>
              ))}
              <motion.span {...rise(8)} className="relative inline-block">
                <span className="relative z-10">every school day</span>
                <motion.svg
                  viewBox="0 0 300 24"
                  className="absolute -bottom-2 left-0 z-0 h-[0.42em] w-full"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M4 16 C 60 4, 120 22, 180 10 S 270 8, 296 14"
                    fill="none"
                    stroke="var(--color-bus-400)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.75, duration: 0.7, ease: "easeOut" }}
                  />
                </motion.svg>
              </motion.span>
            </span>
          </h1>

          <motion.p {...rise(9)} className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-ink-soft md:text-[18px]">
            Before and after school pick-up and drop-off across Decatur, Stone Mountain, Douglas, Fulton and
            Gwinnett County. Every child is checked on and off, and you can follow the van live.
          </motion.p>

          <motion.div {...rise(10)} className="mt-8 flex flex-wrap items-center gap-3">
            <LinkButton href="/application" size="lg" arrow>
              Apply now
            </LinkButton>
            <Button href={contact.phoneHref} variant="outline" size="lg" icon={<Phone className="size-[18px]" />} aria-label={`Call ${contact.phone}`}>
              <span className="sm:hidden">Call us</span>
              <span className="hidden sm:inline">{contact.phone}</span>
            </Button>
          </motion.div>
        </div>

        <div className="relative -mx-5 sm:mx-0 lg:-mr-8">
          <HeroScene heroRef={ref} />
        </div>
      </div>
    </section>
  );
}
