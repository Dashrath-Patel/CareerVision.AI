"use client";

import Navigation from "@/components/navigation";
import SkillAnalyzer from "@/components/skill-analyzer";
import { useNavigation } from "@/components/navigation-context";
import { useEffect } from "react";

export default function SkillsPage() {
  const { setIsNavigating } = useNavigation();

  useEffect(() => {
    // Add a small delay to show the loader briefly, then hide it
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [setIsNavigating]);

  return (
    <div className="min-h-screen relative">
      <Navigation />
      <main className="pt-20 relative">
        <SkillAnalyzer />
      </main>
    </div>
  );
}