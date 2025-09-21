'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Target,
  Trophy,
  Flame,
  Bell,
  Quote,
  Lightbulb,
  CheckCircle,
  TrendingUp,
  Award,
  Clock,
  Zap,
  Star,
  Gift,
  BarChart3,
  MessageCircle
} from 'lucide-react';

interface EngagementData {
  dailyMotivation: DailyMotivation;
  reminders: Reminder[];
  achievements: Achievement[];
  streakData: StreakData;
  progressInsights: ProgressInsight[];
}

interface DailyMotivation {
  quote: string;
  tip: string;
  challenge: string;
  goalReminder: string;
}

interface Reminder {
  id: string;
  type: 'goal' | 'milestone' | 'practice' | 'review';
  title: string;
  message: string;
  scheduledTime: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string;
  category: string;
  points: number;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  lastActivityDate: string;
}

interface ProgressInsight {
  metric: string;
  currentValue: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  insight: string;
}

interface EngagementSystemProps {
  userProfile: any;
  progressData?: any;
}

export default function EngagementSystem({ userProfile, progressData }: EngagementSystemProps) {
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'motivation' | 'reminders' | 'achievements' | 'insights'>('motivation');
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userProfile) {
      fetchEngagementData();
    }
  }, [userProfile]);

  const fetchEngagementData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/daily-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          progressData: progressData || {},
        }),
      });

      const data = await response.json();

      if (data.success && data.engagement) {
        setEngagementData(data.engagement);
      } else {
        throw new Error(data.error || 'Failed to fetch engagement data');
      }
    } catch (err) {
      console.error('Error fetching engagement data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load engagement data');
      
      // Set fallback engagement data
      setEngagementData({
        dailyMotivation: {
          quote: "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
          tip: "Spend 30 minutes today practicing a new skill in your field",
          challenge: "Complete one coding challenge or read one technical article",
          goalReminder: "Remember your goal to advance your career - consistency is key!"
        },
        reminders: [
          {
            id: 'r1',
            type: 'practice',
            title: 'Daily Practice',
            message: 'Time for your daily skill building session!',
            scheduledTime: '09:00',
            frequency: 'daily',
            isActive: true
          }
        ],
        achievements: [
          {
            id: 'a1',
            title: 'Getting Started',
            description: 'Accessed the engagement system for the first time',
            icon: '🎯',
            dateEarned: new Date().toISOString().split('T')[0],
            category: 'milestone',
            points: 10
          }
        ],
        streakData: {
          currentStreak: 1,
          longestStreak: 1,
          totalDays: 1,
          lastActivityDate: new Date().toISOString().split('T')[0]
        },
        progressInsights: [
          {
            metric: 'Daily Engagement',
            currentValue: 1,
            previousValue: 0,
            trend: 'up',
            insight: 'Great start on your learning journey!'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const markChallengeComplete = (challengeType: string) => {
    const newCompleted = new Set(completedChallenges);
    newCompleted.add(challengeType);
    setCompletedChallenges(newCompleted);
    
    // In a real app, this would update the backend
    console.log(`Challenge completed: ${challengeType}`);
  };

  const toggleReminder = (reminderId: string) => {
    if (!engagementData) return;
    
    const updatedReminders = engagementData.reminders.map(reminder =>
      reminder.id === reminderId 
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    );
    
    setEngagementData({
      ...engagementData,
      reminders: updatedReminders
    });
  };

  const getReminderIcon = (type: string) => {
    const icons = {
      goal: <Target className="w-5 h-5" />,
      milestone: <Trophy className="w-5 h-5" />,
      practice: <Zap className="w-5 h-5" />,
      review: <BarChart3 className="w-5 h-5" />
    };
    return icons[type as keyof typeof icons] || <Bell className="w-5 h-5" />;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <TrendingUp className="w-4 h-4 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your daily engagement...</p>
      </div>
    );
  }

  if (!engagementData) {
    return (
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-8 text-center">
        <p className="text-gray-600">No engagement data available</p>
        <button
          onClick={fetchEngagementData}
          className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Load Engagement Data
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🔥 Daily Engagement Hub
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay motivated and track your progress with personalized daily content, 
            reminders, achievements, and insights
          </p>
        </div>

        {/* Streak Display */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 mb-8 text-white text-center">
          <div className="flex items-center justify-center space-x-4">
            <Flame className="w-8 h-8" />
            <div>
              <div className="text-3xl font-bold">{engagementData.streakData.currentStreak}</div>
              <div className="text-sm opacity-90">Day Streak</div>
            </div>
            <div className="hidden md:block h-12 w-px bg-white opacity-30"></div>
            <div className="hidden md:block">
              <div className="text-xl font-semibold">{engagementData.streakData.longestStreak}</div>
              <div className="text-sm opacity-90">Longest Streak</div>
            </div>
            <div className="hidden md:block h-12 w-px bg-white opacity-30"></div>
            <div className="hidden md:block">
              <div className="text-xl font-semibold">{engagementData.streakData.totalDays}</div>
              <div className="text-sm opacity-90">Total Days</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg p-2 shadow-sm">
          {[
            { id: 'motivation', label: 'Daily Motivation', icon: <Quote className="w-4 h-4" /> },
            { id: 'reminders', label: 'Reminders', icon: <Bell className="w-4 h-4" /> },
            { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
            { id: 'insights', label: 'Progress Insights', icon: <BarChart3 className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'motivation' && (
              <div className="space-y-6">
                {/* Daily Quote */}
                <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
                  <div className="flex items-start space-x-4">
                    <Quote className="w-8 h-8 text-purple-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Daily Inspiration</h3>
                      <p className="text-gray-700 italic text-lg leading-relaxed">
                        "{engagementData.dailyMotivation.quote}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Daily Tip */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-start space-x-4">
                      <Lightbulb className="w-6 h-6 text-yellow-500" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Today's Tip</h3>
                        <p className="text-gray-700">{engagementData.dailyMotivation.tip}</p>
                      </div>
                    </div>
                  </div>

                  {/* Daily Challenge */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-start space-x-4">
                      <Target className="w-6 h-6 text-blue-500" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Daily Challenge</h3>
                        <p className="text-gray-700 mb-4">{engagementData.dailyMotivation.challenge}</p>
                        <button
                          onClick={() => markChallengeComplete('daily')}
                          disabled={completedChallenges.has('daily')}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            completedChallenges.has('daily')
                              ? 'bg-green-500 text-white cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          {completedChallenges.has('daily') ? (
                            <><CheckCircle className="w-4 h-4 inline mr-2" />Completed!</>
                          ) : (
                            'Mark Complete'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Goal Reminder */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center space-x-4">
                    <Star className="w-8 h-8" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Goal Reminder</h3>
                      <p className="text-lg">{engagementData.dailyMotivation.goalReminder}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reminders' && (
              <div className="space-y-4">
                {engagementData.reminders.map((reminder) => (
                  <div key={reminder.id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${reminder.isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                          {getReminderIcon(reminder.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{reminder.title}</h3>
                          <p className="text-gray-600">{reminder.message}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {reminder.scheduledTime}
                            </span>
                            <span className="capitalize">{reminder.frequency}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          reminder.isActive
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                        }`}
                      >
                        {reminder.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {engagementData.achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="capitalize bg-gray-100 px-2 py-1 rounded">{achievement.category}</span>
                      <span className="font-semibold text-purple-600">{achievement.points} pts</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">{achievement.dateEarned}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                {engagementData.progressInsights.map((insight, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{insight.metric}</h3>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(insight.trend)}
                        <span className={`text-sm font-medium ${
                          insight.trend === 'up' ? 'text-green-600' :
                          insight.trend === 'down' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {insight.currentValue} {insight.trend === 'up' ? '↑' : insight.trend === 'down' ? '↓' : '→'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-600">Previous: {insight.previousValue}</div>
                      <div className="text-sm text-gray-600">Current: {insight.currentValue}</div>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full ${
                          insight.trend === 'up' ? 'bg-green-500' :
                          insight.trend === 'down' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${Math.min((insight.currentValue / Math.max(insight.previousValue, insight.currentValue)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-700">{insight.insight}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-6">
            {error}
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={fetchEngagementData}
            disabled={loading}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center space-x-2 mx-auto"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Refresh Daily Content</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}