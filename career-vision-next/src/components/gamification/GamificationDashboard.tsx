'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Zap, Clock, Target, Award, Flame, Calendar,
  TrendingUp, Medal, Crown, Gem, Shield
} from 'lucide-react';
import { UserProgress, Badge, Achievement, DailyChallenge, WeeklyQuest } from '@/types/gamification';
import { GamificationService } from '@/services/gamification-service';

interface GamificationDashboardProps {
  userProgress: UserProgress;
  dailyChallenges: DailyChallenge[];
  weeklyQuest: WeeklyQuest;
  onChallengeComplete: (challengeId: string) => void;
  className?: string;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  userProgress,
  dailyChallenges,
  weeklyQuest,
  onChallengeComplete,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'achievements' | 'challenges'>('overview');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getBadgeRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const pointsToNextLevel = GamificationService.getPointsToNextLevel(userProgress.totalPoints);
  const currentLevelProgress = userProgress.nextLevel 
    ? ((userProgress.totalPoints - userProgress.currentLevel.minPoints) / 
       (userProgress.nextLevel.minPoints - userProgress.currentLevel.minPoints)) * 100
    : 100;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'challenges', label: 'Challenges', icon: Target }
  ];

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Your Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning journey and celebrate your achievements
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }
            `}
          >
            <tab.icon size={18} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Level Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <Crown size={24} />
                  <span className="text-sm opacity-80">Level</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{userProgress.currentLevel.level}</div>
                  <div className="text-sm opacity-90">{userProgress.currentLevel.title}</div>
                  {userProgress.nextLevel && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{Math.round(currentLevelProgress)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${currentLevelProgress}%` }}
                          className="bg-white h-2 rounded-full"
                          transition={{ duration: 1, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Points Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <Zap size={24} />
                  <span className="text-sm opacity-80">Points</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{userProgress.totalPoints.toLocaleString()}</div>
                  {pointsToNextLevel > 0 && (
                    <div className="text-sm opacity-90">
                      {pointsToNextLevel.toLocaleString()} to next level
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Streak Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <Flame size={24} />
                  <span className="text-sm opacity-80">Streak</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{userProgress.streak.currentStreak}</div>
                  <div className="text-sm opacity-90">
                    Best: {userProgress.streak.longestStreak} days
                  </div>
                </div>
              </motion.div>

              {/* Badges Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <Award size={24} />
                  <span className="text-sm opacity-80">Badges</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{userProgress.badges.length}</div>
                  <div className="text-sm opacity-90">collected</div>
                </div>
              </motion.div>
            </div>

            {/* Weekly Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Goals */}
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  Weekly Goals
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Stages Completed</span>
                      <span className="font-semibold">
                        {userProgress.weeklyGoals.current} / {userProgress.weeklyGoals.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.min(100, (userProgress.weeklyGoals.current / userProgress.weeklyGoals.target) * 100)}%` 
                        }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Monthly Goals</span>
                      <span className="font-semibold">
                        {userProgress.monthlyGoals.current} / {userProgress.monthlyGoals.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.min(100, (userProgress.monthlyGoals.current / userProgress.monthlyGoals.target) * 100)}%` 
                        }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <Trophy size={20} />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {userProgress.achievements
                    .filter(achievement => achievement.completed)
                    .slice(-3)
                    .map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 dark:text-gray-200">
                            {achievement.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            +{achievement.points} points
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userProgress.badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedBadge(badge)}
                  className={`
                    relative p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg cursor-pointer
                    border-2 ${getBadgeRarityBorder(badge.rarity)}
                  `}
                >
                  <div className={`
                    w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${getBadgeRarityColor(badge.rarity)}
                    flex items-center justify-center text-white text-2xl shadow-lg
                  `}>
                    {badge.icon}
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                      {badge.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                      {badge.rarity}
                    </div>
                  </div>
                  
                  {/* Rarity Glow Effect */}
                  <div className={`
                    absolute inset-0 rounded-2xl bg-gradient-to-br ${getBadgeRarityColor(badge.rarity)}
                    opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none
                  `} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {userProgress.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-l-4
                  ${achievement.completed 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-blue-500'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`
                      text-3xl p-3 rounded-full
                      ${achievement.completed 
                        ? 'bg-green-100 dark:bg-green-800' 
                        : 'bg-blue-100 dark:bg-blue-800'
                      }
                    `}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        {achievement.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {achievement.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-semibold">
                            {achievement.progress.current} / {achievement.progress.target}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${Math.min(100, (achievement.progress.current / achievement.progress.target) * 100)}%` 
                            }}
                            className={`
                              h-2 rounded-full
                              ${achievement.completed 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                                : 'bg-gradient-to-r from-blue-500 to-purple-600'
                              }
                            `}
                            transition={{ duration: 1, ease: "easeInOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Zap size={16} />
                      <span className="font-semibold">{achievement.points}</span>
                    </div>
                    {achievement.completed && (
                      <div className="flex items-center gap-1 text-green-500 text-sm">
                        <Medal size={14} />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'challenges' && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Weekly Quest */}
            <div className="p-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Crown size={24} />
                {weeklyQuest.title}
              </h3>
              <p className="text-purple-100 mb-4">{weeklyQuest.description}</p>
              
              <div className="space-y-3">
                {weeklyQuest.objectives.map((objective, index) => (
                  <div key={objective.id} className="flex items-center gap-3">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center border-2
                      ${objective.completed 
                        ? 'bg-green-500 border-green-400' 
                        : 'bg-transparent border-white/50'
                      }
                    `}>
                      {objective.completed && <span className="text-sm">✓</span>}
                    </div>
                    <span className={objective.completed ? 'line-through opacity-75' : ''}>
                      {objective.description}
                    </span>
                    <span className="ml-auto text-sm">+{objective.points}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(weeklyQuest.progress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${weeklyQuest.progress}%` }}
                    className="bg-white h-2 rounded-full"
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Daily Challenges */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Daily Challenges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dailyChallenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-200
                      ${challenge.completed
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                        : 'bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-800 dark:border-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`
                        p-2 rounded-lg
                        ${challenge.difficulty === 'easy' ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300' :
                          challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-300' :
                          'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300'
                        }
                      `}>
                        <Target size={16} />
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Zap size={14} />
                        <span className="text-sm font-semibold">{challenge.points}</span>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {challenge.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {challenge.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{challenge.timeEstimate}</span>
                      </div>
                      
                      {!challenge.completed ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onChallengeComplete(challenge.id)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Start
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-1 text-green-500 text-sm">
                          <Medal size={14} />
                          <span>Done</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className={`
                  w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${getBadgeRarityColor(selectedBadge.rarity)}
                  flex items-center justify-center text-white text-4xl shadow-xl
                `}>
                  {selectedBadge.icon}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {selectedBadge.name}
                </h2>
                
                <span className={`
                  inline-block px-3 py-1 text-sm font-semibold text-white rounded-full mb-4
                  bg-gradient-to-r ${getBadgeRarityColor(selectedBadge.rarity)}
                `}>
                  {selectedBadge.rarity}
                </span>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedBadge.description}
                </p>
                
                <div className="flex items-center justify-center gap-2 text-yellow-500 mb-6">
                  <Zap size={20} />
                  <span className="text-lg font-bold">{selectedBadge.points} points</span>
                </div>
                
                {selectedBadge.unlockedAt && (
                  <p className="text-sm text-gray-500">
                    Earned on {new Date(selectedBadge.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full mt-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamificationDashboard;