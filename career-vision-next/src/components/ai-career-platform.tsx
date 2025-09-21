"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import DomainSelection from "./domain-selection";
import AdaptiveAssessment from "./adaptive-assessment";
import CareerRoadmap from "./career-roadmap";

interface UserProfile {
  selectedDomain: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
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
}

type FlowStage = 'domain-selection' | 'assessment' | 'roadmap';

export default function AICareerPlatform() {
  const [currentStage, setCurrentStage] = useState<FlowStage>('domain-selection');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const handleDomainSelected = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentStage('assessment');
  };

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setAssessmentResult(result);
    setCurrentStage('roadmap');
  };

  const handleRestart = () => {
    setCurrentStage('domain-selection');
    setUserProfile(null);
    setAssessmentResult(null);
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentStage === 'domain-selection' && (
          <motion.div
            key="domain-selection"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <DomainSelection onDomainSelected={handleDomainSelected} />
          </motion.div>
        )}

        {currentStage === 'assessment' && userProfile && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <AdaptiveAssessment 
              userProfile={userProfile}
              onComplete={handleAssessmentComplete}
            />
          </motion.div>
        )}

        {currentStage === 'roadmap' && userProfile && assessmentResult && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <CareerRoadmap 
              userProfile={userProfile}
              assessmentResult={assessmentResult}
            />
            
            {/* Restart Button */}
            <div className="fixed bottom-8 right-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                Start New Assessment
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}