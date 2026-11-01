import { AppTeaser } from "@/components/home/app-teaser";
import { Areas, FaqPreview, FinalCta } from "@/components/home/areas-faq-cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Safety } from "@/components/home/safety";
import { ServicesGrid } from "@/components/home/services-grid";
import { StatsBand } from "@/components/home/stats-band";
import { ScrollRoute } from "@/components/route/scroll-route";

export default function HomePage() {
  return (
    <ScrollRoute>
      <Hero />
      <StatsBand />
      <HowItWorks />
      <ServicesGrid />
      <Safety />
      <AppTeaser />
      <Areas />
      <FaqPreview />
      <FinalCta />
    </ScrollRoute>
  );
}
