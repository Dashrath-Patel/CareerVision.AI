"use client";

import Navigation from "@/components/navigation";
import RoadmapGallery from "@/components/roadmap-gallery";
import { useNavigation } from "@/components/navigation-context";
import { useEffect } from "react";

export default function RoadmapsPage() {
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
        <RoadmapGallery />
      </main>
    </div>
  );
}