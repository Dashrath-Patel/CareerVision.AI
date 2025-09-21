"use client";

import AICareerPlatform from "@/components/ai-career-platform";
import Navigation from "@/components/navigation";
import { DotBackground } from "@/components/ui/dot-background";
import { Spotlight } from "@/components/ui/spotlight";
import { useNavigation } from "@/components/navigation-context";
import { useEffect } from "react";

export default function PredictPage() {
  const { setIsNavigating } = useNavigation();

  useEffect(() => {
    // Add a small delay to show the loader briefly, then hide it
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [setIsNavigating]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Dot Background */}
      <DotBackground className="absolute inset-0" />
      
      {/* Spotlight Effect */}
      <Spotlight className="absolute -left-20 top-20 animate-traverse" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Content */}
      <div className="relative z-10 pt-20">
        <AICareerPlatform />
      </div>
    </div>
  );
}