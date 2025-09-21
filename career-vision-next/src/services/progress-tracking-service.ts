import { UserProgress, CareerRoadmap, RoadmapStage, Achievement, Badge } from '@/types/gamification';
import { GamificationService } from './gamification-service';

export interface ProgressUpdate {
  type: 'stage_completed' | 'stage_progress' | 'skill_practiced' | 'resource_completed' | 'daily_activity';
  stageId?: string;
  skillName?: string;
  resourceId?: string;
  progress?: number; // 0-100
  points?: number;
  metadata?: Record<string, any>;
}

export interface ProgressStats {
  totalTimeSpent: number; // in minutes
  completionRate: number; // 0-100
  averageSessionTime: number; // in minutes
  weeklyGoalProgress: number; // 0-100
  monthlyGoalProgress: number; // 0-100
  lastActivityDate: Date;
  activeDays: number;
  productiveHours: { hour: number; count: number }[];
  skillDistribution: { skill: string; percentage: number }[];
}

export interface MotivationalContent {
  message: string;
  type: 'encouragement' | 'milestone' | 'streak' | 'achievement' | 'challenge';
  emoji: string;
  actionText?: string;
  actionUrl?: string;
}

export class ProgressTrackingService {
  private static readonly STORAGE_KEY = 'career_vision_progress';
  private static readonly ACTIVITY_STORAGE_KEY = 'career_vision_activity';

  /**
   * Initialize user progress for a new user
   */
  static initializeUserProgress(domain: string): UserProgress {
    const initialProgress: UserProgress = {
      totalPoints: 0,
      currentLevel: GamificationService.calculateUserLevel(0),
      badges: [],
      achievements: this.getInitialAchievements(),
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date(),
        streakMilestones: [
          { days: 7, badge: { id: 'streak_7', name: 'Week Warrior', description: '7-day streak', icon: '🔥', category: 'streak', rarity: 'common', points: 100, requirements: { type: 'streak_days', value: 7 } }, unlocked: false },
          { days: 30, badge: { id: 'streak_30', name: 'Monthly Master', description: '30-day streak', icon: '🎖️', category: 'streak', rarity: 'rare', points: 500, requirements: { type: 'streak_days', value: 30 } }, unlocked: false },
          { days: 100, badge: { id: 'streak_100', name: 'Century Champion', description: '100-day streak', icon: '💎', category: 'streak', rarity: 'epic', points: 1500, requirements: { type: 'streak_days', value: 100 } }, unlocked: false }
        ]
      },
      completedStages: [],
      skillMasteries: [],
      weeklyGoals: {
        target: 5, // 5 stages per week for beginners
        current: 0,
        week: this.getCurrentWeek()
      },
      monthlyGoals: {
        target: 20, // 20 stages per month for beginners
        current: 0,
        month: this.getCurrentMonth()
      }
    };

    return initialProgress;
  }

  /**
   * Update user progress based on activity
   */
  static updateProgress(
    currentProgress: UserProgress, 
    update: ProgressUpdate,
    roadmap: CareerRoadmap
  ): { progress: UserProgress; newBadges: Badge[]; levelUp: boolean } {
    const updatedProgress = { ...currentProgress };
    let pointsEarned = 0;
    let levelUp = false;

    // Record activity for streak tracking
    this.recordActivity(update.type);

    switch (update.type) {
      case 'stage_completed':
        if (update.stageId && !updatedProgress.completedStages.includes(update.stageId)) {
          updatedProgress.completedStages.push(update.stageId);
          
          const stage = roadmap.stages.find(s => s.id === update.stageId);
          if (stage) {
            pointsEarned = GamificationService.calculateStagePoints(stage);
            
            // Update skill masteries
            stage.skills.forEach(skill => {
              const existing = updatedProgress.skillMasteries.find(sm => sm.skill === skill);
              if (existing) {
                existing.progress = Math.min(100, existing.progress + 20);
                // Level up skill if progress reaches thresholds
                if (existing.progress >= 100 && existing.level === 'expert') {
                  // Already at max
                } else if (existing.progress >= 80 && existing.level !== 'expert') {
                  existing.level = 'expert';
                } else if (existing.progress >= 60 && existing.level === 'beginner') {
                  existing.level = 'intermediate';
                } else if (existing.progress >= 40 && existing.level === 'beginner') {
                  existing.level = 'intermediate';
                }
              } else {
                updatedProgress.skillMasteries.push({
                  skill,
                  level: 'beginner',
                  progress: 20
                });
              }
            });
          }

          // Update weekly and monthly goals
          updatedProgress.weeklyGoals.current++;
          updatedProgress.monthlyGoals.current++;
        }
        break;

      case 'stage_progress':
        pointsEarned = Math.round((update.progress || 0) * 0.1); // Partial points for progress
        break;

      case 'skill_practiced':
        pointsEarned = 25; // Fixed points for skill practice
        if (update.skillName) {
          const existing = updatedProgress.skillMasteries.find(sm => sm.skill === update.skillName);
          if (existing) {
            existing.progress = Math.min(100, existing.progress + 5);
          } else {
            updatedProgress.skillMasteries.push({
              skill: update.skillName,
              level: 'beginner',
              progress: 5
            });
          }
        }
        break;

      case 'resource_completed':
        pointsEarned = update.points || 50;
        break;

      case 'daily_activity':
        pointsEarned = 10; // Small bonus for daily activity
        break;
    }

    // Update total points
    const previousLevel = updatedProgress.currentLevel.level;
    updatedProgress.totalPoints += pointsEarned;
    updatedProgress.currentLevel = GamificationService.calculateUserLevel(updatedProgress.totalPoints);
    updatedProgress.nextLevel = GamificationService.getNextLevel(updatedProgress.currentLevel.level);

    // Check for level up
    levelUp = updatedProgress.currentLevel.level > previousLevel;

    // Update streak
    updatedProgress.streak = GamificationService.updateStreak(updatedProgress.streak, new Date());

    // Check for new badges
    const newBadges = GamificationService.checkBadgeEligibility(updatedProgress);
    updatedProgress.badges.push(...newBadges);

    // Update achievements
    updatedProgress.achievements = GamificationService.updateAchievementProgress(
      updatedProgress.achievements, 
      updatedProgress
    );

    // Reset weekly/monthly goals if needed
    const currentWeek = this.getCurrentWeek();
    const currentMonth = this.getCurrentMonth();
    
    if (updatedProgress.weeklyGoals.week !== currentWeek) {
      updatedProgress.weeklyGoals = {
        target: this.calculateWeeklyGoal(updatedProgress.currentLevel.level),
        current: 0,
        week: currentWeek
      };
    }

    if (updatedProgress.monthlyGoals.month !== currentMonth) {
      updatedProgress.monthlyGoals = {
        target: this.calculateMonthlyGoal(updatedProgress.currentLevel.level),
        current: 0,
        month: currentMonth
      };
    }

    return { progress: updatedProgress, newBadges, levelUp };
  }

  /**
   * Calculate detailed progress statistics
   */
  static calculateProgressStats(progress: UserProgress, roadmap: CareerRoadmap): ProgressStats {
    const activities = this.getActivityHistory();
    const completedStages = progress.completedStages.length;
    const totalStages = roadmap.totalStages;
    
    // Calculate total time spent (placeholder - would come from actual tracking)
    const totalTimeSpent = completedStages * 30; // Assume 30 min per stage average
    
    // Calculate completion rate
    const completionRate = (completedStages / totalStages) * 100;
    
    // Calculate average session time
    const averageSessionTime = totalTimeSpent / Math.max(activities.length, 1);
    
    // Calculate weekly/monthly goal progress
    const weeklyGoalProgress = (progress.weeklyGoals.current / progress.weeklyGoals.target) * 100;
    const monthlyGoalProgress = (progress.monthlyGoals.current / progress.monthlyGoals.target) * 100;
    
    // Calculate active days
    const uniqueDays = new Set(activities.map(activity => 
      new Date(activity.timestamp).toDateString()
    )).size;
    
    // Calculate productive hours distribution
    const hourCounts: { [hour: number]: number } = {};
    activities.forEach(activity => {
      const hour = new Date(activity.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const productiveHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Calculate skill distribution
    const skillCounts: { [skill: string]: number } = {};
    progress.skillMasteries.forEach(mastery => {
      skillCounts[mastery.skill] = mastery.progress;
    });
    
    const totalSkillProgress = Object.values(skillCounts).reduce((sum, progress) => sum + progress, 0);
    const skillDistribution = Object.entries(skillCounts)
      .map(([skill, progress]) => ({
        skill,
        percentage: totalSkillProgress > 0 ? (progress / totalSkillProgress) * 100 : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return {
      totalTimeSpent,
      completionRate,
      averageSessionTime,
      weeklyGoalProgress,
      monthlyGoalProgress,
      lastActivityDate: activities.length > 0 ? new Date(activities[activities.length - 1].timestamp) : new Date(),
      activeDays: uniqueDays,
      productiveHours,
      skillDistribution
    };
  }

  /**
   * Generate motivational content based on user progress
   */
  static generateMotivationalContent(progress: UserProgress, stats: ProgressStats): MotivationalContent[] {
    const content: MotivationalContent[] = [];

    // Streak-based motivation
    if (progress.streak.currentStreak >= 7) {
      content.push({
        message: `Amazing! You're on a ${progress.streak.currentStreak}-day streak! 🔥`,
        type: 'streak',
        emoji: '🔥',
        actionText: 'Keep it going!',
        actionUrl: '/dashboard'
      });
    } else if (progress.streak.currentStreak === 0) {
      content.push({
        message: 'Start a new learning streak today! Every expert was once a beginner.',
        type: 'encouragement',
        emoji: '🌱',
        actionText: 'Begin learning',
        actionUrl: '/roadmap'
      });
    }

    // Level-based motivation
    if (progress.currentLevel.level >= 5) {
      content.push({
        message: `Congratulations on reaching ${progress.currentLevel.title}! You're in the top tier of learners.`,
        type: 'milestone',
        emoji: '👑',
        actionText: 'See your achievements',
        actionUrl: '/achievements'
      });
    }

    // Weekly goal motivation
    if (stats.weeklyGoalProgress >= 100) {
      content.push({
        message: 'You\'ve completed this week\'s learning goal! Time to set new challenges.',
        type: 'achievement',
        emoji: '🎯',
        actionText: 'Set new goals',
        actionUrl: '/goals'
      });
    } else if (stats.weeklyGoalProgress >= 80) {
      content.push({
        message: 'Almost there! You\'re just a few steps away from your weekly goal.',
        type: 'encouragement',
        emoji: '⚡',
        actionText: 'Complete goal',
        actionUrl: '/roadmap'
      });
    }

    // Challenge-based motivation
    const dailyChallenges = GamificationService.generateDailyChallenges(progress);
    const incompleteChallenges = dailyChallenges.filter(c => !c.completed);
    
    if (incompleteChallenges.length > 0) {
      content.push({
        message: `You have ${incompleteChallenges.length} daily challenges waiting for you!`,
        type: 'challenge',
        emoji: '🎮',
        actionText: 'View challenges',
        actionUrl: '/challenges'
      });
    }

    // Progress-based encouragement
    if (stats.completionRate < 10) {
      content.push({
        message: 'Every journey begins with a single step. You\'ve got this!',
        type: 'encouragement',
        emoji: '🚀',
        actionText: 'Continue learning',
        actionUrl: '/roadmap'
      });
    } else if (stats.completionRate >= 50) {
      content.push({
        message: 'Halfway there! Your dedication is paying off beautifully.',
        type: 'milestone',
        emoji: '🌟',
        actionText: 'See progress',
        actionUrl: '/progress'
      });
    }

    return content.slice(0, 3); // Return top 3 most relevant content
  }

  /**
   * Get personalized next action recommendations
   */
  static getNextActionRecommendations(
    progress: UserProgress, 
    roadmap: CareerRoadmap,
    limit: number = 3
  ): Array<{
    type: 'stage' | 'skill' | 'challenge' | 'goal';
    title: string;
    description: string;
    estimatedTime: string;
    points: number;
    priority: 'low' | 'medium' | 'high';
    actionUrl: string;
  }> {
    const recommendations = [];

    // Recommend next stage
    const nextStages = roadmap.stages
      .filter(stage => {
        const prerequisitesMet = stage.prerequisites.every(prereq => 
          progress.completedStages.includes(prereq)
        );
        return prerequisitesMet && !progress.completedStages.includes(stage.id);
      })
      .sort((a, b) => a.order - b.order)
      .slice(0, 2);

    nextStages.forEach(stage => {
      recommendations.push({
        type: 'stage' as const,
        title: `Continue: ${stage.title}`,
        description: stage.description,
        estimatedTime: stage.estimatedTime,
        points: stage.points,
        priority: 'high' as const,
        actionUrl: `/roadmap/stage/${stage.id}`
      });
    });

    // Recommend skill practice for low-progress skills
    const lowProgressSkills = progress.skillMasteries
      .filter(skill => skill.progress < 50)
      .sort((a, b) => a.progress - b.progress)
      .slice(0, 1);

    lowProgressSkills.forEach(skill => {
      recommendations.push({
        type: 'skill' as const,
        title: `Practice: ${skill.skill}`,
        description: `Improve your ${skill.skill} skills with targeted practice`,
        estimatedTime: '20-30 minutes',
        points: 50,
        priority: 'medium' as const,
        actionUrl: `/practice/${skill.skill.toLowerCase().replace(/\s+/g, '-')}`
      });
    });

    // Recommend daily challenges
    const dailyChallenges = GamificationService.generateDailyChallenges(progress);
    const availableChallenge = dailyChallenges.find(c => !c.completed);
    
    if (availableChallenge) {
      recommendations.push({
        type: 'challenge' as const,
        title: availableChallenge.title,
        description: availableChallenge.description,
        estimatedTime: availableChallenge.timeEstimate,
        points: availableChallenge.points,
        priority: 'medium' as const,
        actionUrl: `/challenges/${availableChallenge.id}`
      });
    }

    return recommendations.slice(0, limit);
  }

  // Private helper methods
  private static getCurrentWeek(): string {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week}`;
  }

  private static getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  private static calculateWeeklyGoal(level: number): number {
    return Math.min(3 + level, 10); // Scale with level, max 10
  }

  private static calculateMonthlyGoal(level: number): number {
    return Math.min(10 + (level * 3), 40); // Scale with level, max 40
  }

  private static getInitialAchievements(): Achievement[] {
    return [
      {
        id: 'first_stage',
        name: 'First Steps',
        description: 'Complete your first learning stage',
        icon: '🚀',
        type: 'milestone',
        points: 100,
        progress: { current: 0, target: 1 },
        completed: false,
        requirements: ['Complete any stage in your roadmap']
      },
      {
        id: 'week_streak',
        name: 'Consistent Learner',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        type: 'consistency',
        points: 200,
        progress: { current: 0, target: 7 },
        completed: false,
        requirements: ['Learn something every day for 7 consecutive days']
      },
      {
        id: 'skill_master',
        name: 'Skill Builder',
        description: 'Master 3 different skills',
        icon: '🎯',
        type: 'skill',
        points: 300,
        progress: { current: 0, target: 3 },
        completed: false,
        requirements: ['Reach intermediate level in 3 skills']
      }
    ];
  }

  private static recordActivity(type: string): void {
    const activities = this.getActivityHistory();
    activities.push({
      type,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 1000 activities
    if (activities.length > 1000) {
      activities.splice(0, activities.length - 1000);
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
    }
  }

  private static getActivityHistory(): Array<{ type: string; timestamp: string }> {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.ACTIVITY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}