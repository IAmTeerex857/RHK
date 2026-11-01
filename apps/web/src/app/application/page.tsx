import type { Metadata } from "next";
import { Clock, FileCheck2, Phone, Users } from "lucide-react";
import { ApplicationForm } from "@/components/apply/application-form";
import { ClientOnly } from "@/components/util/client-only";
import { ApplicationArt } from "@/components/illustrations/hero-art";
import { PageHero } from "@/components/site/page-hero";
import { applicationFee, contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Before & after school application",
  description: `Apply online for Rush Hour Kids before and after school transportation. One application per child, $${applicationFee} application fee.`,
};

const facts = [
  { icon: Clock, text: "About 5 minutes" },
  { icon: Users, text: "One application per child" },
  { icon: FileCheck2, text: `$${applicationFee} application fee` },
];

export default function ApplicationPage() {
  return (
    <>
      <PageHero
        art={<ApplicationArt fee={applicationFee} />}
        className="pb-16 md:pb-20"
        eyebrow="Before & after school application"
        title={
          <>
            Save your child&rsquo;s seat on the bus
          </>
        }
        body="Tell us about your child and the days you need, sign, and pay the application fee. Our office reviews every application and gets back to you."
      >
        <ul className="flex flex-wrap gap-2.5">
          {facts.map(({ icon: Icon, text }) => (
            <li key={text} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2 text-[14px] font-semibold shadow-subtle">
              <Icon className="size-4 text-ink-muted" />
              {text}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="relative z-[2] pb-20 md:pb-28">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_300px]">
          <ClientOnly fallback={<div className="h-[640px] rounded-3xl border border-line bg-white shadow-float" aria-busy="true" />}>
            <ApplicationForm />
          </ClientOnly>
          <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl bg-raised p-5">
              <h2 className="font-display text-[18px] font-semibold">What happens next</h2>
              <ol className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-soft">
                <li><strong className="text-ink">1.</strong> Our office reviews your application and checks there&rsquo;s space on a van in your area.</li>
                <li><strong className="text-ink">2.</strong> If approved, you get a welcome text and email with the app link and your access code.</li>
                <li><strong className="text-ink">3.</strong> You plan your first week in the app.</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <h2 className="font-display text-[18px] font-semibold">Rather talk it through?</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">Call or text and we&rsquo;ll help you fill it in.</p>
              <a href={contact.phoneHref} className="mt-4 inline-flex items-center gap-2 font-display text-[17px] font-semibold text-ink hover:text-coral">
                <Phone className="size-4" /> {contact.phone}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
