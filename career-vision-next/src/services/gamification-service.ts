import { 
  Badge, 
  UserLevel, 
  Achievement, 
  UserProgress, 
  StreakTracker,
  DailyChallenge,
  WeeklyQuest,
  RoadmapStage 
} from '@/types/gamification';

export class GamificationService {
  // User Levels Configuration
  private static readonly USER_LEVELS: UserLevel[] = [
    { level: 1, title: "Career Explorer", minPoints: 0, maxPoints: 499, benefits: ["Basic roadmap access", "Daily challenges"] },
    { level: 2, title: "Skill Seeker", minPoints: 500, maxPoints: 1499, benefits: ["Weekly quests", "Progress tracking", "Basic badges"] },
    { level: 3, title: "Knowledge Warrior", minPoints: 1500, maxPoints: 3499, benefits: ["Advanced resources", "Skill mastery tracking", "Achievement system"] },
    { level: 4, title: "Growth Hacker", minPoints: 3500, maxPoints: 7499, benefits: ["Personalized recommendations", "Priority support", "Exclusive content"] },
    { level: 5, title: "Career Ninja", minPoints: 7500, maxPoints: 14999, benefits: ["Mentor matching", "Advanced analytics", "Custom roadmaps"] },
    { level: 6, title: "Industry Expert", minPoints: 15000, maxPoints: 29999, benefits: ["Leadership challenges", "Community features", "Beta access"] },
    { level: 7, title: "Career Master", minPoints: 30000, maxPoints: 59999, benefits: ["Mentorship opportunities", "Industry insights", "VIP support"] },
    { level: 8, title: "Domain Legend", minPoints: 60000, maxPoints: 99999, benefits: ["Thought leadership", "Speaking opportunities", "Premium networking"] },
    { level: 9, title: "Career Architect", minPoints: 100000, maxPoints: 199999, benefits: ["Industry partnerships", "Executive coaching", "Global recognition"] },
    { level: 10, title: "Visionary Leader", minPoints: 200000, maxPoints: Infinity, benefits: ["Lifetime access", "Advisory board", "Legacy features"] }
  ];

  // Badge Templates
  private static readonly BADGE_TEMPLATES: Omit<Badge, 'id' | 'unlockedAt'>[] = [
    // Progress Badges
    { name: "First Steps", description: "Complete your first roadmap stage", icon: "🚀", category: "progress", rarity: "common", points: 50, requirements: { type: "complete_stages", value: 1 } },
    { name: "Momentum Builder", description: "Complete 5 roadmap stages", icon: "⚡", category: "progress", rarity: "common", points: 200, requirements: { type: "complete_stages", value: 5 } },
    { name: "Progress Pioneer", description: "Complete 10 roadmap stages", icon: "🎯", category: "progress", rarity: "rare", points: 500, requirements: { type: "complete_stages", value: 10 } },
    { name: "Stage Master", description: "Complete 25 roadmap stages", icon: "👑", category: "progress", rarity: "epic", points: 1000, requirements: { type: "complete_stages", value: 25 } },
    { name: "Completion Legend", description: "Complete 50 roadmap stages", icon: "🏆", category: "progress", rarity: "legendary", points: 2500, requirements: { type: "complete_stages", value: 50 } },

    // Streak Badges
    { name: "Consistent Learner", description: "Maintain a 7-day learning streak", icon: "🔥", category: "streak", rarity: "common", points: 100, requirements: { type: "streak_days", value: 7 } },
    { name: "Dedication Medal", description: "Maintain a 30-day learning streak", icon: "🎖️", category: "streak", rarity: "rare", points: 500, requirements: { type: "streak_days", value: 30 } },
    { name: "Unstoppable Force", description: "Maintain a 100-day learning streak", icon: "💎", category: "streak", rarity: "epic", points: 1500, requirements: { type: "streak_days", value: 100 } },
    { name: "Eternal Flame", description: "Maintain a 365-day learning streak", icon: "🔥💎", category: "streak", rarity: "legendary", points: 5000, requirements: { type: "streak_days", value: 365 } },

    // Skill Badges
    { name: "Skill Sampler", description: "Practice 5 different skills", icon: "🎨", category: "skill", rarity: "common", points: 150, requirements: { type: "skill_mastery", value: 5 } },
    { name: "Versatile Learner", description: "Achieve intermediate level in 3 skills", icon: "🌟", category: "skill", rarity: "rare", points: 750, requirements: { type: "skill_mastery", value: 3, details: "intermediate" } },
    { name: "Expert Builder", description: "Master an advanced skill", icon: "🚀", category: "skill", rarity: "epic", points: 1250, requirements: { type: "skill_mastery", value: 1, details: "advanced" } },
    { name: "Domain Expert", description: "Become expert in 2 skills", icon: "🧠", category: "skill", rarity: "legendary", points: 3000, requirements: { type: "skill_mastery", value: 2, details: "expert" } },

    // Achievement Badges
    { name: "High Achiever", description: "Score 80%+ on 5 assessments", icon: "📊", category: "achievement", rarity: "rare", points: 600, requirements: { type: "assessment_score", value: 80 } },
    { name: "Perfect Score", description: "Score 100% on an assessment", icon: "💯", category: "achievement", rarity: "epic", points: 1000, requirements: { type: "assessment_score", value: 100 } },
    { name: "Point Collector", description: "Earn 10,000 total points", icon: "💰", category: "milestone", rarity: "rare", points: 0, requirements: { type: "total_points", value: 10000 } },
    { name: "Point Magnate", description: "Earn 50,000 total points", icon: "💎", category: "milestone", rarity: "epic", points: 0, requirements: { type: "total_points", value: 50000 } },
    { name: "Point Emperor", description: "Earn 100,000 total points", icon: "👑", category: "milestone", rarity: "legendary", points: 0, requirements: { type: "total_points", value: 100000 } }
  ];

  /**
   * Calculate user level based on total points
   */
  static calculateUserLevel(totalPoints: number): UserLevel {
    for (let i = this.USER_LEVELS.length - 1; i >= 0; i--) {
      const level = this.USER_LEVELS[i];
      if (totalPoints >= level.minPoints) {
        return level;
      }
    }
    return this.USER_LEVELS[0];
  }

  /**
   * Get next level for progression tracking
   */
  static getNextLevel(currentLevel: number): UserLevel | null {
    const nextLevelIndex = this.USER_LEVELS.findIndex(level => level.level === currentLevel + 1);
    return nextLevelIndex !== -1 ? this.USER_LEVELS[nextLevelIndex] : null;
  }

  /**
   * Calculate points to next level
   */
  static getPointsToNextLevel(totalPoints: number): number {
    const currentLevel = this.calculateUserLevel(totalPoints);
    const nextLevel = this.getNextLevel(currentLevel.level);
    
    if (!nextLevel) return 0;
    return nextLevel.minPoints - totalPoints;
  }

  /**
   * Check and award badges based on user progress
   */
  static checkBadgeEligibility(userProgress: UserProgress): Badge[] {
    const newBadges: Badge[] = [];
    const unlockedBadgeIds = userProgress.badges.map(badge => badge.id);

    this.BADGE_TEMPLATES.forEach((template, index) => {
      const badgeId = `badge_${index}`;
      
      // Skip if already unlocked
      if (unlockedBadgeIds.includes(badgeId)) return;

      let eligible = false;

      switch (template.requirements.type) {
        case 'complete_stages':
          eligible = userProgress.completedStages.length >= template.requirements.value;
          break;
        case 'streak_days':
          eligible = userProgress.streak.currentStreak >= template.requirements.value;
          break;
        case 'total_points':
          eligible = userProgress.totalPoints >= template.requirements.value;
          break;
        case 'skill_mastery':
          if (template.requirements.details) {
            const masteryLevel = template.requirements.details as 'intermediate' | 'advanced' | 'expert';
            const masteredSkills = userProgress.skillMasteries.filter(skill => 
              skill.level === masteryLevel || 
              (masteryLevel === 'intermediate' && (skill.level === 'advanced' || skill.level === 'expert')) ||
              (masteryLevel === 'advanced' && skill.level === 'expert')
            );
            eligible = masteredSkills.length >= template.requirements.value;
          } else {
            eligible = userProgress.skillMasteries.length >= template.requirements.value;
          }
          break;
        case 'assessment_score':
          // This would need assessment data - placeholder for now
          eligible = false;
          break;
      }

      if (eligible) {
        newBadges.push({
          ...template,
          id: badgeId,
          unlockedAt: new Date()
        });
      }
    });

    return newBadges;
  }

  /**
   * Calculate points for completing a stage
   */
  static calculateStagePoints(stage: RoadmapStage): number {
    const basePoints = stage.points;
    const difficultyMultiplier = {
      'beginner': 1,
      'intermediate': 1.5,
      'advanced': 2
    };
    
    return Math.round(basePoints * difficultyMultiplier[stage.difficulty]);
  }

  /**
   * Update streak based on activity
   */
  static updateStreak(streak: StreakTracker, activityDate: Date): StreakTracker {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastActivityDate = new Date(streak.lastActivityDate);
    const isToday = activityDate.toDateString() === today.toDateString();
    const isYesterday = lastActivityDate.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      // Activity today - maintain streak if last activity was yesterday
      if (isYesterday || lastActivityDate.toDateString() === today.toDateString()) {
        return {
          ...streak,
          currentStreak: streak.currentStreak + (lastActivityDate.toDateString() === today.toDateString() ? 0 : 1),
          longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
          lastActivityDate: activityDate
        };
      } else {
        // Gap in activity - reset streak
        return {
          ...streak,
          currentStreak: 1,
          lastActivityDate: activityDate
        };
      }
    }
    
    return streak;
  }

  /**
   * Generate daily challenges based on user progress
   */
  static generateDailyChallenges(userProgress: UserProgress): DailyChallenge[] {
    const challenges: DailyChallenge[] = [];
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Easy challenge
    challenges.push({
      id: `daily_easy_${today.toISOString().split('T')[0]}`,
      title: "Quick Skill Review",
      description: "Spend 15 minutes reviewing a skill you've learned recently",
      type: "skill_practice",
      difficulty: "easy",
      points: 25,
      timeEstimate: "15 minutes",
      category: "practice",
      expiresAt: tomorrow,
      completed: false
    });

    // Medium challenge
    challenges.push({
      id: `daily_medium_${today.toISOString().split('T')[0]}`,
      title: "Learning Session",
      description: "Complete a tutorial or watch an educational video in your domain",
      type: "learning",
      difficulty: "medium",
      points: 50,
      timeEstimate: "30 minutes",
      category: "education",
      expiresAt: tomorrow,
      completed: false
    });

    // Hard challenge (only for intermediate+ users)
    if (userProgress.currentLevel.level >= 3) {
      challenges.push({
        id: `daily_hard_${today.toISOString().split('T')[0]}`,
        title: "Project Challenge",
        description: "Work on a personal project or complete a coding challenge",
        type: "project",
        difficulty: "hard",
        points: 100,
        timeEstimate: "1 hour",
        category: "application",
        expiresAt: tomorrow,
        completed: false
      });
    }

    return challenges;
  }

  /**
   * Generate weekly quest based on user level and progress
   */
  static generateWeeklyQuest(userProgress: UserProgress): WeeklyQuest {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const objectives = [
      {
        id: 'complete_stages',
        description: 'Complete 3 roadmap stages',
        completed: false,
        points: 150
      },
      {
        id: 'daily_streak',
        description: 'Maintain daily learning streak',
        completed: false,
        points: 100
      },
      {
        id: 'skill_practice',
        description: 'Practice 2 different skills',
        completed: false,
        points: 75
      }
    ];

    // Add advanced objectives for higher-level users
    if (userProgress.currentLevel.level >= 4) {
      objectives.push({
        id: 'mentor_interaction',
        description: 'Engage with community or mentorship',
        completed: false,
        points: 125
      });
    }

    return {
      id: `weekly_${startOfWeek.toISOString().split('T')[0]}`,
      title: "Weekly Learning Quest",
      description: "Complete your weekly learning objectives to earn bonus rewards",
      objectives,
      totalPoints: objectives.reduce((sum, obj) => sum + obj.points, 0),
      progress: 0,
      startsAt: startOfWeek,
      endsAt: endOfWeek,
      completed: false,
      reward: {
        points: 200,
        badge: userProgress.currentLevel.level >= 5 ? {
          id: 'weekly_champion',
          name: 'Weekly Champion',
          description: 'Completed a weekly quest',
          icon: '🏅',
          category: 'achievement',
          rarity: 'rare',
          points: 100,
          requirements: { type: 'complete_stages', value: 1 }
        } : undefined,
        unlocks: userProgress.currentLevel.level >= 6 ? ['Advanced Analytics Dashboard'] : undefined
      }
    };
  }

  /**
   * Calculate achievement progress
   */
  static updateAchievementProgress(
    achievements: Achievement[], 
    userProgress: UserProgress
  ): Achievement[] {
    return achievements.map(achievement => {
      let current = 0;

      switch (achievement.type) {
        case 'milestone':
          if (achievement.name.includes('stages')) {
            current = userProgress.completedStages.length;
          } else if (achievement.name.includes('points')) {
            current = userProgress.totalPoints;
          }
          break;
        case 'skill':
          current = userProgress.skillMasteries.length;
          break;
        case 'consistency':
          current = userProgress.streak.currentStreak;
          break;
      }

      const completed = current >= achievement.progress.target;

      return {
        ...achievement,
        progress: { ...achievement.progress, current },
        completed,
        completedAt: completed && !achievement.completed ? new Date() : achievement.completedAt
      };
    });
  }

  /**
   * Get motivational message based on user progress
   */
  static getMotivationalMessage(userProgress: UserProgress): string {
    const messages = {
      streak: [
        `🔥 Amazing! You're on a ${userProgress.streak.currentStreak}-day streak! Keep the momentum going!`,
        `💪 Consistency is key! Your ${userProgress.streak.currentStreak}-day streak shows your dedication!`,
        `🌟 ${userProgress.streak.currentStreak} days of learning! You're building an incredible habit!`
      ],
      level: [
        `🚀 Welcome to ${userProgress.currentLevel.title}! You're making fantastic progress!`,
        `👑 As a ${userProgress.currentLevel.title}, you're unlocking new opportunities!`,
        `⚡ Your journey as a ${userProgress.currentLevel.title} is just getting started!`
      ],
      general: [
        `🎯 Every step forward is progress! Keep up the great work!`,
        `💡 Learning is a journey, not a destination. You're doing amazingly!`,
        `🌱 Growth happens one step at a time. You're on the right path!`,
        `🏆 Your dedication to learning is inspiring! Keep pushing forward!`
      ]
    };

    if (userProgress.streak.currentStreak >= 7) {
      return messages.streak[Math.floor(Math.random() * messages.streak.length)];
    } else if (userProgress.currentLevel.level >= 3) {
      return messages.level[Math.floor(Math.random() * messages.level.length)];
    } else {
      return messages.general[Math.floor(Math.random() * messages.general.length)];
    }
  }
}