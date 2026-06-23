import { LandingNav } from "@/components/landing/nav";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { BeforeAfterSection } from "@/components/landing/before-after-section";
import { LiveDemoSection } from "@/components/landing/live-demo-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { IndustriesSection } from "@/components/landing/industries-section";
import { DashboardPreviewSection } from "@/components/landing/dashboard-preview-section";
import { RoiCalculatorSection } from "@/components/landing/roi-calculator-section";
import { TrustSection } from "@/components/landing/trust-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <LandingNav />

      <main className="relative">
        <HeroSection />
        <ProblemSection />
        <BeforeAfterSection />
        <LiveDemoSection />
        <HowItWorksSection />
        <FeaturesSection />
        <IndustriesSection />
        <DashboardPreviewSection />
        <RoiCalculatorSection />
        <TrustSection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>

      <LandingFooter />
    </div>
  );
}
