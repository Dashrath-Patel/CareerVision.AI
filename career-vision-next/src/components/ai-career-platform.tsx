"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DomainSelection from "./domain-selection";
import AdaptiveAssessment from "./adaptive-assessment";
import CareerRoadmap from "./career-roadmap";

interface UserProfile {
  domain: string;
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

type FlowStage = 'domain-selection' | 'assessment' | 'roadmap';

export default function AICareerPlatform() {
  const [currentStage, setCurrentStage] = useState<FlowStage>('domain-selection');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const handleDomainSelected = (profile: any) => {
    // Add default name and email for assessment compatibility
    const completeProfile: UserProfile = {
      name: 'User',
      email: 'user@example.com',
      ...profile
    };
    setUserProfile(completeProfile);
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
    <div className="min-h-screen bg-black relative">
      {/* Ensure dark background consistency */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentStage === 'domain-selection' && (
            <motion.div
              key="domain-selection"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
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
            transition={{ duration: 0.3 }}
            className="min-h-screen flex items-center justify-center p-6"
          >
            <AdaptiveAssessment 
              userProfile={{
                selectedDomain: userProfile!.domain,
                domain: userProfile!.domain,
                skillLevel: userProfile!.skillLevel,
                educationLevel: userProfile!.educationLevel,
                experience: userProfile!.experience,
                interests: userProfile!.interests,
                goals: userProfile!.goals
              }} 
              onComplete={handleAssessmentComplete} 
            />
          </motion.div>
        )}          {currentStage === 'roadmap' && userProfile && assessmentResult && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <CareerRoadmap 
                userProfile={userProfile!} 
                assessmentResult={assessmentResult!}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}