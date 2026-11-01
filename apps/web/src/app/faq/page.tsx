import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { Accordion } from "@rhk/ui/components/accordion";
import { Button } from "@rhk/ui/components/button";
import { FinalCta } from "@/components/home/areas-faq-cta";
import { FaqArt } from "@/components/illustrations/hero-art";
import { PageHero } from "@/components/site/page-hero";
import { contact, faqs } from "@/content/site";

export const metadata: Metadata = {
  title: "Questions parents ask",
  description: "Answers about signing up, prices, service areas, the app, absences, medical needs, field trips and summer programs.",
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        art={<FaqArt />}
        eyebrow="FAQ"
        title={
          <>
            Questions parents ask us
          </>
        }
        body="Can't find your answer? Call or text us. We're happy to help."
      >
        <div className="flex flex-wrap gap-3">
          <Button href={contact.phoneHref} size="lg" icon={<Phone className="size-[18px]" />}>
            Call us
          </Button>
          <Button href={contact.smsHref} variant="outline" size="lg" icon={<MessageCircle className="size-[18px]" />}>
            Text us
          </Button>
        </div>
      </PageHero>

      <section className="relative z-[2] pb-20 md:pb-28">
        <div className="container-page max-w-[52rem]">
          <Accordion items={faqs} />
        </div>
      </section>

      <FinalCta />
    </>
  );
}
