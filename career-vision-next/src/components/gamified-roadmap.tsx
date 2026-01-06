'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Target, Clock, Star, CheckCircle, Circle, 
  Book, Play, Award, TrendingUp, Calendar, Zap,
  ChevronRight, ChevronDown, ExternalLink, User, BookOpen
} from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'skill' | 'achievement';
  requirements: string;
  points: number;
}

interface Resource {
  title: string;
  type: 'course' | 'book' | 'certification' | 'project' | 'tutorial';
  url?: string;
  description: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  category: string;
  skillArea: string;
  estimatedHours: number;
  estimatedDays: number;
  difficulty: 'easy' | 'medium' | 'hard';
  prerequisites: string[];
  completionCriteria: string[];
  resources: Resource[];
  badges: Badge[];
  isCompleted: boolean;
  completedDate?: string;
  userNotes?: string;
}

interface GamifiedRoadmap {
  domain: string;
  currentLevel: string;
  targetLevel: string;
  totalEstimatedHours: number;
  totalEstimatedWeeks: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  milestones: Milestone[];
  allBadges: Badge[];
  skillProgression: SkillProgression[];
  motivationalQuotes: string[];
  dailyGoals: DailyGoal[];
  weeklyGoals: WeeklyGoal[];
  personalizedTips: string[];
  careerProjections: CareerProjection[];
}

interface SkillProgression {
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  progressPercentage: number;
  relatedMilestones: string[];
  importanceScore: number;
}

interface DailyGoal {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  category: 'learning' | 'practice' | 'reading' | 'project';
  relatedMilestone: string;
  priority: 'high' | 'medium' | 'low';
}

interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  milestones: string[];
  estimatedHours: number;
  targetCompletionDate: string;
}

interface CareerProjection {
  jobTitle: string;
  industry: string;
  averageSalary: string;
  requiredSkills: string[];
  timeToAchieve: string;
  probability: number;
  description: string;
}

interface GamifiedRoadmapProps {
  roadmap: GamifiedRoadmap;
  onMilestoneComplete: (milestoneId: string) => void;
  onUpdateProgress: (progress: any) => void;
}

export default function GamifiedRoadmap({ roadmap, onMilestoneComplete, onUpdateProgress }: GamifiedRoadmapProps) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'skills' | 'goals' | 'careers'>('roadmap');
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set());
  const [currentQuote, setCurrentQuote] = useState(0);

  // Rotate motivational quotes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % roadmap.motivationalQuotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [roadmap.motivationalQuotes.length]);

  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId);
  };

  const completeMilestone = (milestoneId: string) => {
    setCompletedMilestones(prev => new Set([...prev, milestoneId]));
    onMilestoneComplete(milestoneId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course': return <Play className="w-4 h-4" />;
      case 'book': return <Book className="w-4 h-4" />;
      case 'certification': return <Award className="w-4 h-4" />;
      case 'project': return <Target className="w-4 h-4" />;
      case 'tutorial': return <Zap className="w-4 h-4" />;
      default: return <Book className="w-4 h-4" />;
    }
  };

  const calculateOverallProgress = () => {
    const totalMilestones = roadmap.milestones.length;
    const completedCount = completedMilestones.size;
    return Math.round((completedCount / totalMilestones) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <CardSpotlight className="p-8 text-white" color="#8b5cf6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your {roadmap.domain} Journey</h1>
            <p className="text-purple-200 text-lg">
              {roadmap.currentLevel} → {roadmap.targetLevel} • {roadmap.totalEstimatedWeeks} weeks
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">{calculateOverallProgress()}%</div>
            <div className="text-purple-200">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6 bg-purple-900/50 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-full h-3"
            initial={{ width: 0 }}
            animate={{ width: `${calculateOverallProgress()}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Motivational Quote */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-center italic text-purple-200"
          >
            "{roadmap.motivationalQuotes[currentQuote]}"
          </motion.div>
        </AnimatePresence>
      </CardSpotlight>

      {/* Navigation Tabs */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-2 border border-gray-700">
        <div className="flex space-x-2">
          {[
            { id: 'roadmap', label: 'Roadmap', icon: <Target className="w-4 h-4" /> },
            { id: 'skills', label: 'Skills', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'goals', label: 'Goals', icon: <Calendar className="w-4 h-4" /> },
            { id: 'careers', label: 'Careers', icon: <User className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {roadmap.milestones.map((milestone, index) => {
            const isCompleted = completedMilestones.has(milestone.id);
            const isExpanded = expandedMilestone === milestone.id;
            
            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CardSpotlight 
                  className={`border-l-4 ${
                    isCompleted ? 'border-green-500' : 'border-blue-500'
                  } hover:border-purple-500 transition-colors duration-300`}
                  color={isCompleted ? "#10b981" : "#3b82f6"}
                >
                  <div 
                    className="cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors duration-300"
                    onClick={() => toggleMilestone(milestone.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                        } shadow-lg`}>
                          {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{milestone.title}</h3>
                          <p className="text-gray-300">{milestone.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(milestone.difficulty)}`}>
                              {milestone.difficulty}
                            </span>
                            <span className="text-sm text-gray-400 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {milestone.estimatedHours}h • {milestone.estimatedDays} days
                            </span>
                            {milestone.resources.length > 0 && (
                              <span className="text-sm text-purple-400 flex items-center">
                                <BookOpen className="w-4 h-4 mr-1" />
                                {milestone.resources.length} resource{milestone.resources.length !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {milestone.badges.map((badge) => (
                          <div key={badge.id} className="text-2xl" title={badge.name}>
                            {badge.icon}
                          </div>
                        ))}
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`} />
                      </div>
                    </div>
                  </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-700 bg-black/20"
                    >
                      <div className="p-6 space-y-6">
                        {/* Completion Criteria */}
                        <div>
                          <h4 className="font-semibold text-white mb-3">Completion Criteria</h4>
                          <ul className="space-y-2">
                            {milestone.completionCriteria.map((criteria, idx) => (
                              <li key={idx} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-gray-300">{criteria}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Resources */}
                        <div>
                          <h4 className="font-semibold text-white mb-3">Resources</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {milestone.resources.map((resource, idx) => (
                              <div 
                                key={idx} 
                                className={`border border-gray-600 rounded-lg p-4 transition-all duration-300 bg-black/30 ${
                                  resource.url 
                                    ? 'hover:border-purple-500 hover:bg-purple-500/10 cursor-pointer transform hover:scale-105' 
                                    : 'opacity-70'
                                }`}
                                onClick={() => {
                                  if (resource.url) {
                                    window.open(resource.url, '_blank', 'noopener,noreferrer');
                                  }
                                }}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="text-blue-400 mt-1">
                                    {getResourceIcon(resource.type)}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-medium text-white group-hover:text-purple-300">{resource.title}</h5>
                                    <p className="text-sm text-gray-300 mt-1">{resource.description}</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-xs text-gray-400">{resource.estimatedTime}</span>
                                      {resource.url ? (
                                        <div className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                                          <span className="mr-1">Click to open</span>
                                          <ExternalLink className="w-3 h-3" />
                                        </div>
                                      ) : (
                                        <span className="text-gray-500 text-xs">No link available</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Button */}
                        {!isCompleted && (
                          <div className="flex justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                completeMilestone(milestone.id);
                              }}
                              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Mark Complete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </CardSpotlight>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <CardSpotlight className="p-6" color="#3b82f6">
          <h2 className="text-2xl font-bold text-white mb-6">Skill Progression</h2>
          <div className="space-y-6">
            {roadmap.skillProgression.map((skill, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-4 bg-black/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{skill.skillName}</h3>
                  <span className="text-sm text-gray-300">{skill.progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progressPercentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Level {skill.currentLevel}</span>
                  <span>Target: Level {skill.targetLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </CardSpotlight>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Goals */}
          <CardSpotlight className="p-6" color="#10b981">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-400" />
              Daily Goals
            </h2>
            <div className="space-y-3">
              {roadmap.dailyGoals.map((goal, index) => (
                <div key={goal.id} className="border border-gray-600 rounded-lg p-4 bg-black/20">
                  <h3 className="font-medium text-white">{goal.title}</h3>
                  <p className="text-sm text-gray-300 mt-1">{goal.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{goal.estimatedMinutes} min</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      goal.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {goal.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardSpotlight>

          {/* Weekly Goals */}
          <CardSpotlight className="p-6" color="#8b5cf6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-400" />
              Weekly Goals
            </h2>
            <div className="space-y-3">
              {roadmap.weeklyGoals.map((goal, index) => (
                <div key={goal.id} className="border border-gray-600 rounded-lg p-4 bg-black/20">
                  <h3 className="font-medium text-white">{goal.title}</h3>
                  <p className="text-sm text-gray-300 mt-1">{goal.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{goal.estimatedHours}h estimated</span>
                    <span className="text-xs text-gray-400">{goal.targetCompletionDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardSpotlight>
        </div>
      )}

      {/* Careers Tab */}
      {activeTab === 'careers' && (
        <CardSpotlight className="p-6" color="#f59e0b">
          <h2 className="text-2xl font-bold text-white mb-6">Career Projections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmap.careerProjections.map((career, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-6 hover:border-orange-500 transition-colors bg-black/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{career.jobTitle}</h3>
                  <span className="text-2xl font-bold text-orange-400">{career.probability}%</span>
                </div>
                <p className="text-gray-300 mb-4">{career.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Industry:</span>
                    <span className="text-sm font-medium text-white">{career.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Salary:</span>
                    <span className="text-sm font-medium text-white">{career.averageSalary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Timeline:</span>
                    <span className="text-sm font-medium text-white">{career.timeToAchieve}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-white mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {career.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardSpotlight>
      )}

      {/* Personalized Tips */}
      <CardSpotlight className="p-6 text-white" color="#10b981">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-green-400" />
          Personalized Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmap.personalizedTips.map((tip, index) => (
            <div key={index} className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
              <p className="text-sm text-gray-200">{tip}</p>
            </div>
          ))}
        </div>
      </CardSpotlight>
    </div>
  );
}