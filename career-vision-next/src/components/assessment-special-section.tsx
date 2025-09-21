"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { LoaderTwo } from "@/components/ui/loader";
import { Brain, Gamepad2, Map, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/components/navigation-context";

export default function AssessmentSpecialSection() {
  const router = useRouter();
  const { setIsNavigating, setNavigationText } = useNavigation();
  const [isAssessmentLoading, setIsAssessmentLoading] = useState(false);
  const [isLearnMoreLoading, setIsLearnMoreLoading] = useState(false);

  const handleStartAssessment = () => {
    setIsAssessmentLoading(true);
    setIsNavigating(true);
    setNavigationText("Starting your career assessment...");
    
    // Add a small delay to ensure the loader is visible
    setTimeout(() => {
      router.push('/predict');
    }, 800);
  };

  const handleLearnMore = () => {
    setIsLearnMoreLoading(true);
    setIsNavigating(true);
    setNavigationText("Loading skill analyzer...");
    
    // Add a small delay to ensure the loader is visible
    setTimeout(() => {
      router.push('/skills');
    }, 800);
  };

  const assessmentFeatures = [
    {
      quote: "🎯 Advanced AI analyzes your responses with 95% accuracy • Machine learning models understand your thinking patterns • Predicts perfect career matches tailored to your unique profile",
      name: "AI-Powered Analysis",
      title: "🧠 Smart Career Matching"
    },
    {
      quote: "🎮 Transform assessment into an adventure • Interactive questions that adapt to you • Feel like playing a game, not taking a test • Keep you engaged from start to finish",
      name: "Gamified Experience", 
      title: "� Interactive & Fun Assessment"
    },
    {
      quote: "🗺️ Custom learning paths built just for you • Detailed skill roadmaps with timelines • Step-by-step guidance from where you are to where you want to be",
      name: "Personalized Roadmaps",
      title: "� Your Custom Career Journey"
    },
    {
      quote: "📈 Real-time salary data & job growth projections • Industry demand analytics • Market insights across locations • Stay ahead of hiring trends",
      name: "Market Insights",
      title: "� Data-Driven Career Decisions"
    },
    {
      quote: "⚡ Questions adapt in real-time to your responses • Difficulty adjusts to your skill level • Perfectly captures your capabilities • Revolutionary smart technology",
      name: "Adaptive Technology",
      title: "🔥 Dynamic Smart Questions"
    },
    {
      quote: "🎯 360° analysis covering all dimensions • Technical skills + Soft skills + Personality • Learning style + Work preferences • Complete career profiling",
      name: "Holistic Assessment",
      title: "� Complete Career Analysis"
    },
    {
      quote: "🌐 8+ diverse career domains available • Software Development • Data Science • Design & UX • Business • Marketing • Healthcare • Finance • Consulting",
      name: "Multi-Domain Coverage",
      title: "� Diverse Career Paths"
    },
    {
      quote: "🏆 XP points & achievement levels • Learning streaks & milestone rewards • Unlock badges & new content • Compete with yourself & track progress",
      name: "Progress Tracking",
      title: "�️ Gamified Achievement System"
    },
    {
      quote: "📚 Curated resources from top platforms • Coursera • Udemy • Certification programs • Hands-on projects matched to your goals",
      name: "Curated Resources",
      title: "� Premium Learning Materials"
    },
    {
      quote: "Get insights into top companies hiring in your field, including Google, Microsoft, Amazon, Apple, and emerging startups. Learn about company cultures, hiring requirements, interview processes, and employee experiences to make informed decisions about your career path.",
      name: "Company Insights",
      title: "� Industry Leaders"
    },
    {
      quote: "Our platform continuously learns from user interactions and outcomes to improve recommendations. Regular updates incorporate the latest industry trends, job market changes, and user feedback to ensure our advice remains current and valuable.",
      name: "Continuous Learning",
      title: "🔄 Always Improving"
    },
    {
      quote: "Enjoy a seamless experience across all devices with our responsive design. Whether you're on desktop, tablet, or mobile, the assessment adapts perfectly to your screen size while maintaining full functionality and beautiful visuals throughout your journey.",
      name: "Mobile Optimized",
      title: "📱 Any Device, Anywhere"
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-medium">Interactive Assessment</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Makes Our Assessment{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Special?
            </span>
          </h2>
          
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Take our fun, game-like assessment to unlock personalized career recommendations and 
            roadmaps tailored just for you. No boring forms - just engaging questions!
          </p>
        </div>

        {/* Infinite Moving Cards */}
        <div className="relative">
          <InfiniteMovingCards
            items={assessmentFeatures}
            direction="right"
            speed="slow"
            pauseOnHover={true}
            className="py-8"
          />
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className={`${isAssessmentLoading ? 'opacity-50 pointer-events-none' : ''}`}>
              <HoverBorderGradient
                containerClassName="rounded-full cursor-pointer"
                as="button"
                className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 cursor-pointer"
                onClick={handleStartAssessment}
              >
                {isAssessmentLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoaderTwo />
                    <span>Starting...</span>
                  </div>
                ) : (
                  <span>Start Your Assessment</span>
                )}
              </HoverBorderGradient>
            </div>
            
            <button 
              className="px-8 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleLearnMore}
              disabled={isLearnMoreLoading}
            >
              {isLearnMoreLoading ? (
                <div className="flex items-center space-x-2">
                  <LoaderTwo />
                  <span>Loading...</span>
                </div>
              ) : (
                "Learn More"
              )}
            </button>
          </div>
          
          <p className="text-sm text-neutral-500 mt-4">
            ✨ Takes only 5-10 minutes • Get instant results • 100% Free
          </p>
        </div>
      </div>
    </section>
  );
}