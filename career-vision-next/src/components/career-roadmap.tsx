"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, AlertCircle } from "lucide-react";
import GamifiedRoadmap from "./gamified-roadmap";

interface UserProfile {
  selectedDomain: string;
  skillLevel: string;
  educationLevel: string;
  experience: string;
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

      const response = await fetch('/api/generate-gamified-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile, assessmentResult }),
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <Brain className="w-16 h-16 text-blue-600 mx-auto" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating Your Gamified Career Roadmap</h2>
            <p className="text-gray-600 max-w-md mx-auto">Our AI is crafting a personalized, interactive learning journey tailored to your skills and goals...</p>
          </div>
          <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
            <motion.div className="bg-blue-600 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Roadmap Generation Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={generateGamifiedRoadmap} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center text-gray-600">No roadmap data available. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <GamifiedRoadmap roadmap={roadmap} onMilestoneComplete={handleMilestoneComplete} onUpdateProgress={handleUpdateProgress} />
    </div>
  );
}