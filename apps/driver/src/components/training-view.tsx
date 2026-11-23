"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, CheckCircle2, Clock3, GraduationCap, PlayCircle, X } from "lucide-react";
import { courses } from "@rhk/fixtures";
import { Badge } from "@rhk/ui/components/badge";
import { Steps } from "@rhk/ui/components/blocks";
import { Card, CardHeader } from "@rhk/ui/components/card";
import { Ring } from "@rhk/ui/components/charts";
import { Crumb, PageHeader } from "@rhk/ui/shell/app-shell";
import { cn } from "@rhk/ui/lib/cn";
import { me } from "./run-store";

/** Drivers only see courses the owner has approved. Drafts stay in the office. */
export const live = courses.filter((c) => c.status === "approved");

export const lessons: Record<string, { titles: string[]; quiz: { q: string; options: string[]; answer: number; why: string } }> = {
  "co-1": {
    titles: ["Why every tap matters", "Checking on at school", "Checking off at a stop", "When a child isn't there", "The empty-van walk"],
    quiz: {
      q: "The last child is home. What has to happen before the route closes?",
      options: ["Clock out from the driver's seat", "Walk the van front to back and check every seat", "Message the office"],
      answer: 1,
      why: "The route can't close until every row is checked. Small children fall asleep and slide down out of sight.",
    },
  },
  "co-2": {
    titles: ["Who's on the list", "Asking for ID", "Waiting five minutes", "Nobody's there: alert the office"],
    quiz: {
      q: "You've waited five minutes and no approved adult is home. What do you do?",
      options: ["Call the parent yourself", "Leave the child with a neighbor you recognize", "Tap “No approved adult” so the office calls the family, and keep the child on the van"],
      answer: 2,
      why: "Drivers don't call families. The office calls the parent and approved adults and tells you where to bring the child.",
    },
  },
  "co-3": {
    titles: ["Reading a medical note", "Allergies and EpiPens", "Asthma and inhalers", "Seizures", "When to call 911 first", "After an emergency"],
    quiz: {
      q: "A child with a peanut allergy has a swollen face and is struggling to breathe. First step?",
      options: ["Use the EpiPen and call 911", "Call the office", "Drive to the nearest school"],
      answer: 0,
      why: "Breathing trouble is a 911 call. Give the EpiPen from the child's backpack, call 911, then tell the office.",
    },
  },
  "co-4": {
    titles: ["Breakdowns", "Crashes and near misses", "Behavior on the van", "Reporting in four taps", "What the office does next"],
    quiz: {
      q: "Two children are fighting on the van. What comes first?",
      options: ["Pull over where it's safe, then separate them", "Keep driving and shout", "Report it at the end of the day"],
      answer: 0,
      why: "Stop safely first. Then report it from the app so the office can talk to both families.",
    },
  },
};

const doneFor = (i: number) => i < me.trainingDone;

export function TrainingView() {
  const done = live.filter((_, i) => doneFor(i)).length;
  return (
    <>
      <PageHeader title="Training" description="Short courses from the office. Required courses have to be done before you drive a route on your own." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="flex items-center gap-5 lg:col-span-4">
          <Ring value={done / live.length} size={84} stroke={7} tone={done === live.length ? "good" : "warn"}>
            <span className="font-display text-[20px] font-medium tabular">
              {done}/{live.length}
            </span>
          </Ring>
          <div>
            <p className="text-[16px] font-medium">{done === live.length ? "All required done" : "Keep going"}</p>
            <p className="mt-0.5 text-[14px] text-ink-muted">Refreshers come up once a year. The office adds new ones as needed.</p>
          </div>
        </Card>
        <Card flush className="lg:col-span-8">
          <ul>
            {live.map((c, i) => (
              <li key={c.id} className="border-b border-line last:border-0">
                <Link href={`/training/${c.id}`} className="flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-raised/60">
                  {doneFor(i) ? <CheckCircle2 className="size-6 shrink-0 text-good" /> : <PlayCircle className="size-6 shrink-0 text-ink" />}
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium">{c.title}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[13px] text-ink-muted">
                      <Clock3 className="size-3.5" /> {c.minutes} min · {c.lessons} lessons{c.required ? " · required" : ""}
                    </span>
                  </span>
                  {doneFor(i) ? <Badge tone="good">Done</Badge> : <Badge tone="warn">To do</Badge>}
                  <ArrowRight className="size-4 text-ink-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

export function CourseView({ id }: { id: string }) {
  const i = live.findIndex((c) => c.id === id);
  const c = live[i];
  const l = lessons[id];
  const [pick, setPick] = useState<number | null>(null);
  const done = doneFor(i);
  return (
    <>
      <Crumb>{c.title}</Crumb>
      <PageHeader
        eyebrow={
          <span className="flex items-center gap-2">
            <Badge tone={done ? "good" : "warn"}>{done ? "Done" : "To do"}</Badge>
            <span className="text-[13px] text-ink-muted">
              {c.minutes} min · {c.lessons} lessons
            </span>
          </span>
        }
        title={c.title}
        description={c.summary}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader title="Lessons" icon={<GraduationCap className="size-4" />} />
          <Steps
            className="mt-5"
            steps={l.titles.map((t, n) => ({
              title: t,
              meta: `${Math.max(2, Math.round(c.minutes / c.lessons))} min`,
              state: done ? "done" : n === 0 ? "current" : "todo",
            }))}
          />
        </Card>
        <Card className="lg:col-span-5">
          <CardHeader title="Quick check" subtitle="One question from this course" />
          <p className="mt-4 text-[15px] font-medium">{l.quiz.q}</p>
          <ul className="mt-4 flex flex-col gap-2">
            {l.quiz.options.map((o, n) => {
              const chosen = pick === n;
              const right = n === l.quiz.answer;
              return (
                <li key={o}>
                  <button
                    type="button"
                    disabled={pick !== null}
                    onClick={() => setPick(n)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left text-[14px] transition-colors",
                      pick === null && "border-line hover:border-line-strong",
                      pick !== null && right && "border-[color-mix(in_oklab,var(--color-good)_45%,transparent)] bg-mint-soft",
                      pick !== null && chosen && !right && "border-[color-mix(in_oklab,var(--color-bad)_40%,transparent)] bg-coral-soft",
                      pick !== null && !chosen && !right && "border-line opacity-60",
                    )}
                  >
                    <span className="grid size-5 shrink-0 place-items-center">
                      {pick !== null && right ? <Check className="size-4 stroke-[3] text-good" /> : pick !== null && chosen ? <X className="size-4 stroke-[3] text-bad" /> : <span className="size-4 rounded-full border border-line-strong" />}
                    </span>
                    {o}
                  </button>
                </li>
              );
            })}
          </ul>
          {pick !== null ? (
            <p className="mt-4 rounded-2xl bg-raised p-4 text-[14px] text-ink-soft">
              <span className="font-medium text-ink">{pick === l.quiz.answer ? "Right. " : "Not quite. "}</span>
              {l.quiz.why}
            </p>
          ) : null}
        </Card>
      </div>
    </>
  );
}
