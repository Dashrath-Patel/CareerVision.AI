'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Target, Clock, Star, CheckCircle, Circle, 
  Book, Play, Award, TrendingUp, Calendar, Zap,
  ChevronRight, ChevronDown, ExternalLink, User
} from 'lucide-react';

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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your {roadmap.domain} Journey</h1>
            <p className="text-blue-100 text-lg">
              {roadmap.currentLevel} → {roadmap.targetLevel} • {roadmap.totalEstimatedWeeks} weeks
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">{calculateOverallProgress()}%</div>
            <div className="text-blue-100">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6 bg-blue-500 rounded-full h-3">
          <motion.div 
            className="bg-white rounded-full h-3"
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
            className="mt-4 text-center italic text-blue-100"
          >
            "{roadmap.motivationalQuotes[currentQuote]}"
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-2">
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
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
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
                className={`bg-white rounded-xl shadow-lg border-l-4 ${
                  isCompleted ? 'border-green-500' : 'border-blue-500'
                }`}
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleMilestone(milestone.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(milestone.difficulty)}`}>
                            {milestone.difficulty}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {milestone.estimatedHours}h • {milestone.estimatedDays} days
                          </span>
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
                      className="border-t bg-gray-50"
                    >
                      <div className="p-6 space-y-6">
                        {/* Completion Criteria */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Completion Criteria</h4>
                          <ul className="space-y-2">
                            {milestone.completionCriteria.map((criteria, idx) => (
                              <li key={idx} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-gray-700">{criteria}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Resources */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {milestone.resources.map((resource, idx) => (
                              <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start space-x-3">
                                  <div className="text-blue-600 mt-1">
                                    {getResourceIcon(resource.type)}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">{resource.title}</h5>
                                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-xs text-gray-500">{resource.estimatedTime}</span>
                                      {resource.url && (
                                        <a 
                                          href={resource.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                        >
                                          Open <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
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
                              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
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
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Skill Progression</h2>
          <div className="space-y-6">
            {roadmap.skillProgression.map((skill, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{skill.skillName}</h3>
                  <span className="text-sm text-gray-600">{skill.progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <motion.div 
                    className="bg-blue-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progressPercentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Level {skill.currentLevel}</span>
                  <span>Target: Level {skill.targetLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Goals */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Daily Goals
            </h2>
            <div className="space-y-3">
              {roadmap.dailyGoals.map((goal, index) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{goal.estimatedMinutes} min</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      goal.priority === 'high' ? 'bg-red-100 text-red-600' :
                      goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {goal.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Goals */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Weekly Goals
            </h2>
            <div className="space-y-3">
              {roadmap.weeklyGoals.map((goal, index) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{goal.estimatedHours}h estimated</span>
                    <span className="text-xs text-gray-500">{goal.targetCompletionDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Careers Tab */}
      {activeTab === 'careers' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Projections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmap.careerProjections.map((career, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{career.jobTitle}</h3>
                  <span className="text-2xl font-bold text-blue-600">{career.probability}%</span>
                </div>
                <p className="text-gray-600 mb-4">{career.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Industry:</span>
                    <span className="text-sm font-medium">{career.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Salary:</span>
                    <span className="text-sm font-medium">{career.averageSalary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Timeline:</span>
                    <span className="text-sm font-medium">{career.timeToAchieve}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {career.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Tips */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2" />
          Personalized Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmap.personalizedTips.map((tip, index) => (
            <div key={index} className="bg-white bg-opacity-20 rounded-lg p-4">
              <p className="text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}