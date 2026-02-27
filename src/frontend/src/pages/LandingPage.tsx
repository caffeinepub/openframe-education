import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { AboutSection } from "../components/landing/AboutSection";
import { CTASection } from "../components/landing/CTASection";
import { ClassesSection } from "../components/landing/ClassesSection";
import { DemoFormSection } from "../components/landing/DemoFormSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { HeroSection } from "../components/landing/HeroSection";
import { PricingSection } from "../components/landing/PricingSection";
import { TeachersSection } from "../components/landing/TeachersSection";
import { TestimonialsSection } from "../components/landing/TestimonialsSection";
import { WhyChooseSection } from "../components/landing/WhyChooseSection";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ClassesSection />
        <FeaturesSection />
        <WhyChooseSection />
        <DemoFormSection />
        <TestimonialsSection />
        <PricingSection />
        <TeachersSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
