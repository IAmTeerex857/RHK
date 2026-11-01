import type { ReactNode } from "react";
import { cn } from "@rhk/ui/lib/cn";
import { RoadPoint } from "../route/road-point";
import { ScrollRoute } from "../route/scroll-route";

/**
 * Header for inner pages: text on the left, an illustration on the right (under the text on
 * phones and tablets). With `route`, a stretch of road comes in from the right edge below the
 * site header, sweeps through the empty right side and leaves off the bottom-left, and the bus
 * drives it as the visitor scrolls. Only Service areas uses the road.
 */
export function PageHero({
  eyebrow,
  title,
  body,
  art,
  route = false,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  art?: ReactNode;
  route?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const section = (
    <section className={cn("relative pb-16 pt-[120px] md:pb-20 md:pt-[148px]", route && "pb-40 md:pb-44", className)}>
      {route ? (
        <>
          {/* desktop: in from the right edge, through the right column, out bottom-left */}
          <RoadPoint start className="absolute hidden w-[78px] lg:block" style={{ left: "112%", top: "22%" }} />
          <RoadPoint className="absolute hidden lg:block" style={{ left: "80%", top: "52%" }} />
          {/* phones and tablets: stays in the space under the text */}
          <RoadPoint start className="absolute w-[54px] lg:hidden" style={{ left: "118%", bottom: "120px" }} />
          <RoadPoint className="absolute" style={{ left: "58%", bottom: "84px" }} />
          <RoadPoint end className="absolute" style={{ left: "-30%", bottom: "64px" }} />
        </>
      ) : null}

      <div className="container-page relative grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <div className="relative max-w-[42rem]">
          <p className="font-display text-[14px] font-medium text-ink-muted">{eyebrow}</p>
          <h1 className="mt-4 font-display text-[40px] font-semibold leading-[1] tracking-[-0.03em] sm:text-[52px] lg:text-[62px]">
            {title}
          </h1>
          {body ? <p className="mt-5 max-w-[36rem] text-[17px] leading-relaxed text-ink-soft md:text-[18px]">{body}</p> : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
        {art ? <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[480px]">{art}</div> : null}
      </div>
    </section>
  );

  return route ? <ScrollRoute pace={0.6}>{section}</ScrollRoute> : section;
}
