"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, AlertCircle } from "lucide-react";
import GamifiedRoadmap from "./gamified-roadmap";

interface UserProfile {
  domain: string;
  selectedDomain?: string;
  educationLevel: string;
  experience: string;
  skillLevel: string;
  interests: string[];
  goals: string[];
}

interface AssessmentResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  skillBreakdown: Record<string, number>;
  recommendedLevel: string;
  strengthAreas: string[];
  improvementAreas: string[];
  detailedAnalysis: string;
}

interface CareerRoadmapProps {
  userProfile: UserProfile;
  assessmentResult: AssessmentResult;
}

export default function CareerRoadmap({ userProfile, assessmentResult }: CareerRoadmapProps) {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateGamifiedRoadmap();
  }, [userProfile, assessmentResult]);

  const generateGamifiedRoadmap = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Ensure selectedDomain is set
      const profileToSend = {
        ...userProfile,
        selectedDomain: userProfile.selectedDomain || userProfile.domain
      };

      const response = await fetch('/api/generate-gamified-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile: profileToSend, assessmentResult }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate roadmap');
      setRoadmap(data.roadmap);
    } catch (error: any) {
      console.error('Error generating roadmap:', error);
      setError(error.message || 'Failed to generate your career roadmap');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMilestoneComplete = (milestoneId: string) => {
    console.log('Milestone completed:', milestoneId);
  };

  const handleUpdateProgress = (progress: any) => {
    console.log('Progress updated:', progress);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <Brain className="w-16 h-16 text-blue-400 mx-auto" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Creating Your Gamified Career Roadmap</h2>
            <p className="text-gray-300 max-w-md mx-auto">Our AI is crafting a personalized, interactive learning journey tailored to your skills and goals...</p>
          </div>
          <div className="w-full max-w-md mx-auto bg-gray-700/50 rounded-full h-3">
            <motion.div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full" initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Roadmap Generation Error</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button onClick={generateGamifiedRoadmap} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-gray-300">No roadmap data available. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <GamifiedRoadmap roadmap={roadmap} onMilestoneComplete={handleMilestoneComplete} onUpdateProgress={handleUpdateProgress} />
    </div>
  );
}