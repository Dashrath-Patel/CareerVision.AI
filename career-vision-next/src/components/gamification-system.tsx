"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy, Star, Zap, Target, Award, BookOpen, Users, Calendar } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserProgress {
  level: number;
  xp: number;
  xpToNext: number;
  streakDays: number;
  assessmentsCompleted: number;
  skillsLearned: number;
  achievements: Achievement[];
}

export default function GamificationSystem() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    xp: 250,
    xpToNext: 1000,
    streakDays: 5,
    assessmentsCompleted: 3,
    skillsLearned: 8,
    achievements: [
      {
        id: 'first-assessment',
        title: 'First Steps',
        description: 'Complete your first assessment',
        icon: Target,
        unlocked: true,
        progress: 1,
        maxProgress: 1,
        rarity: 'common'
      },
      {
        id: 'streak-3',
        title: 'Consistent Learner',
        description: 'Maintain a 3-day learning streak',
        icon: Calendar,
        unlocked: true,
        progress: 3,
        maxProgress: 3,
        rarity: 'rare'
      },
      {
        id: 'skill-explorer',
        title: 'Skill Explorer',
        description: 'Learn skills from 5 different categories',
        icon: BookOpen,
        unlocked: false,
        progress: 3,
        maxProgress: 5,
        rarity: 'epic'
      },
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Score 100% on an assessment',
        icon: Star,
        unlocked: false,
        progress: 0,
        maxProgress: 1,
        rarity: 'legendary'
      }
    ]
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Overview */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800 mb-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Level & XP */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">L{userProgress.level}</span>
            </div>
            <div className="font-semibold text-neutral-800 dark:text-white">Level {userProgress.level}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {userProgress.xp} / {userProgress.xpToNext} XP
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mt-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(userProgress.xp / userProgress.xpToNext) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="font-semibold text-neutral-800 dark:text-white">{userProgress.streakDays} Days</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Learning Streak</div>
          </div>

          {/* Assessments */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="font-semibold text-neutral-800 dark:text-white">{userProgress.assessmentsCompleted}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Assessments</div>
          </div>

          {/* Skills */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="font-semibold text-neutral-800 dark:text-white">{userProgress.skillsLearned}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Skills Learned</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">Achievements</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {userProgress.achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  achievement.unlocked
                    ? `${getRarityBorder(achievement.rarity)} bg-gradient-to-r ${getRarityColor(achievement.rarity)} bg-opacity-10`
                    : 'border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    achievement.unlocked
                      ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}`
                      : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`font-semibold ${
                        achievement.unlocked
                          ? 'text-neutral-800 dark:text-white'
                          : 'text-neutral-500 dark:text-neutral-400'
                      }`}>
                        {achievement.title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                        achievement.rarity === 'common' ? 'bg-gray-100 text-gray-700' :
                        achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                        achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {achievement.rarity}
                      </span>
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      achievement.unlocked
                        ? 'text-neutral-600 dark:text-neutral-400'
                        : 'text-neutral-500 dark:text-neutral-500'
                    }`}>
                      {achievement.description}
                    </p>
                    
                    {!achievement.unlocked && achievement.maxProgress > 1 && (
                      <div>
                        <div className="flex justify-between text-xs text-neutral-500 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {achievement.unlocked && (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                        <Star className="w-4 h-4" />
                        Unlocked!
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">Daily Challenges</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'Quick Learner',
              description: 'Complete a 10-minute skill module',
              reward: '50 XP',
              progress: 80,
              completed: false
            },
            {
              title: 'Knowledge Seeker',
              description: 'Read 3 career articles',
              reward: '30 XP',
              progress: 100,
              completed: true
            },
            {
              title: 'Practice Makes Perfect',
              description: 'Complete 5 practice questions',
              reward: '40 XP',
              progress: 40,
              completed: false
            }
          ].map((challenge, index) => (
            <div key={index} className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
              <h3 className="font-semibold text-neutral-800 dark:text-white mb-2">{challenge.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{challenge.description}</p>
              
              <div className="flex justify-between text-xs text-neutral-500 mb-2">
                <span>Progress</span>
                <span>{challenge.progress}%</span>
              </div>
              
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-3">
                <motion.div
                  className={`h-2 rounded-full ${
                    challenge.completed
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${challenge.progress}%` }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{challenge.reward}</span>
                {challenge.completed && (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                    <Star className="w-4 h-4" />
                    Complete!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}