'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Lock, CheckCircle, PlayCircle, Clock, Users, 
  Award, Zap, Target, BookOpen, Lightbulb, ArrowRight 
} from 'lucide-react';
import { CareerRoadmap, RoadmapStage, UserProgress, Badge } from '@/types/gamification';
import { ProgressTrackingService } from '@/services/progress-tracking-service';
import { GamificationService } from '@/services/gamification-service';

interface InteractiveRoadmapProps {
  roadmap: CareerRoadmap;
  userProgress: UserProgress;
  onStageClick: (stage: RoadmapStage) => void;
  onProgressUpdate: (progress: UserProgress) => void;
  className?: string;
}

const InteractiveRoadmap: React.FC<InteractiveRoadmapProps> = ({
  roadmap,
  userProgress,
  onStageClick,
  onProgressUpdate,
  className = ''
}) => {
  const [selectedStage, setSelectedStage] = useState<RoadmapStage | null>(null);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [showingBadges, setShowingBadges] = useState<Badge[]>([]);

  // Calculate stage availability and progress
  const getStageStatus = (stage: RoadmapStage): 'completed' | 'available' | 'locked' => {
    if (userProgress.completedStages.includes(stage.id)) return 'completed';
    
    const prerequisitesMet = stage.prerequisites.every(prereq => 
      userProgress.completedStages.includes(prereq)
    );
    
    return prerequisitesMet ? 'available' : 'locked';
  };

  const getStageIcon = (stage: RoadmapStage) => {
    const status = getStageStatus(stage);
    const iconProps = { size: 24, className: "relative z-10" };

    switch (status) {
      case 'completed':
        return <CheckCircle {...iconProps} className="text-green-400" />;
      case 'available':
        return <PlayCircle {...iconProps} className="text-blue-400" />;
      case 'locked':
        return <Lock {...iconProps} className="text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-500 to-emerald-600';
      case 'intermediate': return 'from-yellow-500 to-orange-600';
      case 'advanced': return 'from-red-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleStageClick = (stage: RoadmapStage) => {
    const status = getStageStatus(stage);
    if (status === 'locked') return;
    
    setSelectedStage(stage);
    onStageClick(stage);
  };

  const completeStage = async (stage: RoadmapStage) => {
    if (getStageStatus(stage) !== 'available') return;

    const { progress: updatedProgress, newBadges } = ProgressTrackingService.updateProgress(
      userProgress,
      { type: 'stage_completed', stageId: stage.id },
      roadmap
    );

    onProgressUpdate(updatedProgress);

    if (newBadges.length > 0) {
      setShowingBadges(newBadges);
      setTimeout(() => setShowingBadges([]), 3000);
    }
  };

  // Group stages by category for better visualization
  const stagesByCategory = roadmap.stages.reduce((acc, stage) => {
    if (!acc[stage.category]) acc[stage.category] = [];
    acc[stage.category].push(stage);
    return acc;
  }, {} as { [category: string]: RoadmapStage[] });

  const categories = Object.keys(stagesByCategory);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{roadmap.title}</h1>
            <p className="text-indigo-100 mb-4">{roadmap.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{roadmap.estimatedDuration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target size={16} />
                <span>{roadmap.totalStages} stages</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy size={16} />
                <span>{userProgress.completedStages.length} completed</span>
              </div>
            </div>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{ 
                  strokeDashoffset: 2 * Math.PI * 40 * (1 - userProgress.completedStages.length / roadmap.totalStages)
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold">
                {Math.round((userProgress.completedStages.length / roadmap.totalStages) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Roadmap Visualization */}
      <div className="space-y-12">
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="relative"
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <BookOpen className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{category}</h2>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-800"></div>
            </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stagesByCategory[category]
                .sort((a, b) => a.order - b.order)
                .map((stage, stageIndex) => {
                  const status = getStageStatus(stage);
                  const isHovered = hoveredStage === stage.id;
                  
                  return (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (categoryIndex * 0.1) + (stageIndex * 0.05) }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onMouseEnter={() => setHoveredStage(stage.id)}
                      onMouseLeave={() => setHoveredStage(null)}
                      onClick={() => handleStageClick(stage)}
                      className={`
                        relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                        ${status === 'completed' 
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                          : status === 'available'
                          ? 'bg-white border-blue-200 hover:border-blue-300 dark:bg-gray-800 dark:border-gray-700 hover:dark:border-gray-600'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed dark:bg-gray-900 dark:border-gray-800'
                        }
                        ${isHovered && status !== 'locked' ? 'shadow-xl' : 'shadow-lg'}
                      `}
                    >
                      {/* Status Badge */}
                      <div className="absolute -top-2 -right-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800
                            ${status === 'completed' ? 'bg-green-500' : status === 'available' ? 'bg-blue-500' : 'bg-gray-400'}
                          `}
                        >
                          {getStageIcon(stage)}
                        </motion.div>
                      </div>

                      {/* Difficulty Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`
                          px-2 py-1 text-xs font-semibold text-white rounded-full
                          bg-gradient-to-r ${getDifficultyColor(stage.difficulty)}
                        `}>
                          {stage.difficulty}
                        </span>
                      </div>

                      {/* Stage Content */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 pr-16">
                          {stage.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {stage.description}
                        </p>

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{stage.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap size={12} />
                            <span>{stage.points} pts</span>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1">
                          {stage.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/30 dark:text-blue-300"
                            >
                              {skill}
                            </span>
                          ))}
                          {stage.skills.length > 3 && (
                            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full dark:bg-gray-800 dark:text-gray-400">
                              +{stage.skills.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Progress Bar for Available Stages */}
                        {status === 'available' && stage.progress > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Progress</span>
                              <span>{stage.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stage.progress}%` }}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                                transition={{ duration: 1, ease: "easeInOut" }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        {status === 'available' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              completeStage(stage);
                            }}
                            className="w-full mt-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            {stage.progress === 0 ? 'Start Learning' : 'Continue'}
                            <ArrowRight size={14} />
                          </motion.button>
                        )}
                      </div>

                      {/* Hover Effects */}
                      <AnimatePresence>
                        {isHovered && status !== 'locked' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl pointer-events-none"
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stage Detail Modal */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedStage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {selectedStage.title}
                  </h2>
                  <span className={`
                    px-3 py-1 text-sm font-semibold text-white rounded-full
                    bg-gradient-to-r ${getDifficultyColor(selectedStage.difficulty)}
                  `}>
                    {selectedStage.difficulty}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedStage(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {selectedStage.description}
              </p>

              {/* Resources */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Learning Resources
                </h3>
                
                {selectedStage.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {resource.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {resource.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={12} />
                          {resource.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap size={12} />
                          {resource.points} pts
                        </span>
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Start
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Notification */}
      <AnimatePresence>
        {showingBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.5 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3">
                <Award size={24} />
                <div>
                  <h3 className="font-bold">New Badge Earned!</h3>
                  <p className="text-sm">
                    {showingBadges.map(badge => badge.name).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveRoadmap;