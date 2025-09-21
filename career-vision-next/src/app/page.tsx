"use client";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import AssessmentSpecialSection from "@/components/assessment-special-section";
import Navigation from "@/components/navigation";

import { Spotlight } from "@/components/ui/spotlight";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Spotlight - traverses from left to right recursively */}
      <Spotlight
        className="-top-60 left-0 h-[120vh] w-[60vw]"
        style={{
          animation: 'spotlightTraverse 4s ease-in-out infinite',
          animationFillMode: 'both'
        }}
        fill="white"
      />
      
      <Navigation />
      <main className="pt-20 relative z-10">
        <HeroSection />
        <AssessmentSpecialSection />
        <FeaturesSection />
      </main>
    </div>
  );
}
