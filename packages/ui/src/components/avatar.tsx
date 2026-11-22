/*
 * People. A photo when we have one, otherwise a blobatar (deterministic geometric avatar,
 * MIT, github.com/Alain00/blobatar) generated from a stable id so a person always looks the same.
 */

import { Blobatar } from "@blobatar/react";
import { cn } from "../lib/cn";

export type AvatarProps = {
  /** Stable seed: an id or email. The same seed always draws the same blobatar. */
  seed: string;
  name: string;
  photo?: string;
  size?: number;
  className?: string;
  /** Presence dot (bottom-right). */
  status?: "online" | "busy" | "off";
  ring?: boolean;
};

const statusTone = { online: "bg-good", busy: "bg-warn", off: "bg-ink-muted" } as const;

export function Avatar({ seed, name, photo, size = 36, className, status, ring }: AvatarProps) {
  return (
    <span
      className={cn("relative inline-grid shrink-0 place-items-center rounded-full bg-raised", ring && "ring-2 ring-card", className)}
      style={{ width: size, height: size }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={name} width={size} height={size} className="size-full rounded-full object-cover" draggable={false} />
      ) : (
        <span className="size-full overflow-hidden rounded-full">
          <Blobatar name={seed} size={size} title={name} />
        </span>
      )}
      {status ? (
        <span
          className={cn("absolute -bottom-0.5 -right-0.5 rounded-full ring-2 ring-card", statusTone[status])}
          style={{ width: Math.max(8, size * 0.26), height: Math.max(8, size * 0.26) }}
          aria-label={status}
        />
      ) : null}
    </span>
  );
}

export function AvatarStack({
  people,
  size = 28,
  max = 3,
  className,
}: {
  people: { seed: string; name: string; photo?: string }[];
  size?: number;
  max?: number;
  className?: string;
}) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span className={cn("inline-flex items-center", className)}>
      {shown.map((p, i) => (
        <Avatar key={p.seed} {...p} size={size} ring className={i ? "-ml-2" : undefined} />
      ))}
      {extra > 0 ? <span className="ml-1.5 text-[13px] font-medium text-ink-muted tabular">+{extra}</span> : null}
    </span>
  );
}
