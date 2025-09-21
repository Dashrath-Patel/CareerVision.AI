'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';
import { Calendar, TrendingUp, Clock, Target, Zap, Award } from 'lucide-react';
import { ProgressStats, UserProgress } from '@/services/progress-tracking-service';

interface ProgressVisualizationProps {
  stats: ProgressStats;
  userProgress: UserProgress;
  className?: string;
}

const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({
  stats,
  userProgress,
  className = ''
}) => {
  // Sample data for charts - in real implementation, this would come from actual tracking
  const weeklyProgressData = [
    { week: 'Week 1', stages: 2, hours: 8 },
    { week: 'Week 2', stages: 3, hours: 12 },
    { week: 'Week 3', stages: 1, hours: 6 },
    { week: 'Week 4', stages: 4, hours: 15 },
    { week: 'Week 5', stages: 3, hours: 11 },
    { week: 'Week 6', stages: 5, hours: 18 },
  ];

  const skillProgressData = stats.skillDistribution.map(skill => ({
    name: skill.skill,
    progress: skill.percentage,
    level: userProgress.skillMasteries.find(s => s.skill === skill.skill)?.level || 'beginner'
  }));

  const timeDistributionData = stats.productiveHours.map(hour => ({
    hour: hour.hour,
    sessions: hour.count,
    label: `${hour.hour}:00`
  }));

  const levelProgressData = [
    {
      name: 'Current Level',
      value: userProgress.currentLevel.level,
      fill: '#8884d8'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-gray-200">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Progress Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Detailed insights into your learning journey</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Last 30 days</span>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-blue-500" size={20} />
            <span className="text-xs text-gray-500 dark:text-gray-400">Time Spent</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {stats.totalTimeSpent}h
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Avg: {Math.round(stats.averageSessionTime)}h per session
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-green-500" size={20} />
            <span className="text-xs text-gray-500 dark:text-gray-400">Completion Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {Math.round(stats.completionRate)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {userProgress.completedStages.length} stages completed
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="text-purple-500" size={20} />
            <span className="text-xs text-gray-500 dark:text-gray-400">Weekly Goal</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {Math.round(stats.weeklyGoalProgress)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {userProgress.weeklyGoals.current}/{userProgress.weeklyGoals.target} this week
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar className="text-orange-500" size={20} />
            <span className="text-xs text-gray-500 dark:text-gray-400">Active Days</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {stats.activeDays}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Current streak: {userProgress.streak.currentStreak}
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Weekly Progress
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="week" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="stages" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skill Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Skill Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={skillProgressData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="progress"
              >
                {skillProgressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Learning Time Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Most Productive Hours
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="label" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="sessions" 
                stroke="#10B981" 
                fill="url(#colorSessions)" 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Level Progress Radial Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Level Progress
          </h3>
          <div className="flex items-center justify-center h-[300px]">
            <div className="relative">
              <ResponsiveContainer width={200} height={200}>
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="60%" 
                  outerRadius="90%" 
                  data={[{
                    name: 'Progress',
                    value: (userProgress.totalPoints - userProgress.currentLevel.minPoints) / 
                           ((userProgress.nextLevel?.minPoints || userProgress.currentLevel.maxPoints) - userProgress.currentLevel.minPoints) * 100,
                    fill: '#8884d8'
                  }]}
                >
                  <RadialBar dataKey="value" cornerRadius={10} fill="#3B82F6" />
                </RadialBarChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                  {userProgress.currentLevel.level}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {userProgress.currentLevel.title}
                </div>
                {userProgress.nextLevel && (
                  <div className="text-xs text-gray-500 mt-1">
                    Next: Level {userProgress.nextLevel.level}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Current Points</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {userProgress.totalPoints.toLocaleString()}
              </span>
            </div>
            {userProgress.nextLevel && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Points to Next Level</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {(userProgress.nextLevel.minPoints - userProgress.totalPoints).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Skill Mastery Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Skill Mastery Progress
        </h3>
        <div className="space-y-4">
          {userProgress.skillMasteries.slice(0, 8).map((skill, index) => (
            <motion.div
              key={skill.skill}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + (index * 0.1) }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {skill.skill}
                  </span>
                  <span className={`
                    px-2 py-0.5 text-xs rounded-full font-medium
                    ${skill.level === 'expert' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                      skill.level === 'advanced' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      skill.level === 'intermediate' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    }
                  `}>
                    {skill.level}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {skill.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.progress}%` }}
                  transition={{ duration: 1, delay: 0.9 + (index * 0.1), ease: "easeInOut" }}
                  className={`
                    h-2 rounded-full
                    ${skill.level === 'expert' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                      skill.level === 'advanced' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      skill.level === 'intermediate' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      'bg-gradient-to-r from-gray-500 to-gray-600'
                    }
                  `}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressVisualization;