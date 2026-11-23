"use client";

/* "Page not found" and "Something went wrong" for every app, in the sign-in frame. */

import { ArrowLeft, RotateCcw, SearchX, TriangleAlert } from "lucide-react";
import { Button } from "../components/button";
import { OFFICE_PHONE } from "../lib/apps";
import { AuthFrame } from "./auth";

export function NotFoundScreen({ app, homeLabel }: { app: string; homeLabel: string }) {
  return (
    <AuthFrame app={app} width={440}>
      <span className="mb-5 grid size-12 place-items-center rounded-2xl border border-line bg-card text-ink shadow-subtle">
        <SearchX className="size-5" />
      </span>
      <p className="font-mono text-[13px] text-ink-muted">Error 404</p>
      <h1 className="mt-1 font-display text-[28px] font-medium tracking-[-0.035em]">We can&apos;t find that page</h1>
      <p className="mt-2 text-[15px] text-ink-muted">The link may be old, or the page has moved. Everything you need is one tap from {homeLabel}.</p>
      <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
        <Button href="/" variant="ink" className="sm:flex-1" arrow>
          Go to {homeLabel}
        </Button>
        <Button variant="outline" className="sm:flex-1" icon={<ArrowLeft className="size-4" />} onClick={() => history.back()}>
          Go back
        </Button>
      </div>
    </AuthFrame>
  );
}

export function ErrorScreen({ app, reset, digest }: { app: string; reset: () => void; digest?: string }) {
  return (
    <AuthFrame
      app={app}
      width={440}
      footer={
        <>
          Still stuck? Call the office at{" "}
          <a href={OFFICE_PHONE.href} className="font-medium text-ink-soft underline-offset-4 hover:underline">
            {OFFICE_PHONE.label}
          </a>
          .
        </>
      }
    >
      <span className="mb-5 grid size-12 place-items-center rounded-2xl border border-[color-mix(in_oklab,var(--color-bad)_18%,transparent)] bg-coral-soft text-bad shadow-subtle">
        <TriangleAlert className="size-5" />
      </span>
      <h1 className="font-display text-[28px] font-medium tracking-[-0.035em]">Something went wrong</h1>
      <p className="mt-2 text-[15px] text-ink-muted">This screen didn&apos;t load properly. Try again. If it keeps happening, tell the office what you were doing.</p>
      {digest ? (
        <p className="mt-4 inline-flex rounded-lg border border-line bg-card px-2.5 py-1 font-mono text-[12px] text-ink-muted">Reference {digest}</p>
      ) : null}
      <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
        <Button variant="ink" className="sm:flex-1" icon={<RotateCcw className="size-4" />} onClick={reset}>
          Try again
        </Button>
        <Button href="/" variant="outline" className="sm:flex-1">
          Start over
        </Button>
      </div>
    </AuthFrame>
  );
}
