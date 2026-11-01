import type { CSSProperties } from "react";

/**
 * An invisible marker the page route passes through. Position it with classes or styles inside
 * any section (use responsive classes like `hidden md:block` to change the route per screen size).
 * The route visits markers in document order.
 */
export function RoadPoint({
  className,
  style,
  start,
  end,
  stop,
  id,
}: {
  className?: string;
  style?: CSSProperties;
  /** First point; its width sets the road width. */
  start?: boolean;
  /** Last point. */
  end?: boolean;
  /** Draws a numbered bus-stop marker beside the road here. */
  stop?: number;
  id?: string;
}) {
  return (
    <span
      aria-hidden
      id={id}
      data-road-point=""
      data-road-start={start ? "" : undefined}
      data-road-end={end ? "" : undefined}
      data-road-stop={stop}
      className={`pointer-events-none h-0 ${className ?? "absolute"}`}
      style={style}
    />
  );
}
