export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'skill' | 'progress' | 'streak' | 'achievement' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirements: {
    type: 'complete_stages' | 'streak_days' | 'total_points' | 'skill_mastery' | 'assessment_score';
    value: number;
    details?: string;
  };
  unlockedAt?: Date;
}

export interface UserLevel {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  badge?: Badge;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'milestone' | 'challenge' | 'skill' | 'consistency';
  points: number;
  progress: {
    current: number;
    target: number;
  };
  completed: boolean;
  completedAt?: Date;
  requirements: string[];
}

export interface StreakTracker {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakMilestones: {
    days: number;
    badge: Badge;
    unlocked: boolean;
  }[];
}

export interface UserProgress {
  totalPoints: number;
  currentLevel: UserLevel;
  nextLevel?: UserLevel;
  badges: Badge[];
  achievements: Achievement[];
  streak: StreakTracker;
  completedStages: string[];
  skillMasteries: {
    skill: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    progress: number;
  }[];
  weeklyGoals: {
    target: number;
    current: number;
    week: string;
  };
  monthlyGoals: {
    target: number;
    current: number;
    month: string;
  };
}

export interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  points: number;
  prerequisites: string[];
  skills: string[];
  resources: LearningResource[];
  completed: boolean;
  completedAt?: Date;
  progress: number; // 0-100
  order: number;
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'tutorial' | 'project' | 'article' | 'video' | 'book' | 'practice';
  provider: string;
  url: string;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  tags: string[];
  isPremium: boolean;
  points: number;
  completed?: boolean;
}

export interface CareerRoadmap {
  id: string;
  domain: string;
  title: string;
  description: string;
  totalStages: number;
  estimatedDuration: string;
  stages: RoadmapStage[];
  skills: string[];
  careerPaths: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  jobDemand: 'low' | 'medium' | 'high' | 'very-high';
  prerequisites: string[];
}

export interface PersonalizedRecommendation {
  id: string;
  type: 'skill_gap' | 'next_step' | 'resource' | 'challenge' | 'career_path';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
  actionable_steps: string[];
  resources: LearningResource[];
  estimatedImpact: 'low' | 'medium' | 'high';
  category: string;
}

export interface SkillGapAnalysis {
  currentSkills: {
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    confidence: number;
    yearsOfExperience?: number;
  }[];
  requiredSkills: {
    name: string;
    importance: 'nice-to-have' | 'important' | 'critical';
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }[];
  gaps: {
    skill: string;
    currentLevel: string;
    requiredLevel: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    recommendations: PersonalizedRecommendation[];
  }[];
  strengths: string[];
  overallReadiness: number; // 0-100
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'skill_practice' | 'learning' | 'project' | 'assessment';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeEstimate: string;
  category: string;
  expiresAt: Date;
  completed: boolean;
  completedAt?: Date;
}

export interface WeeklyQuest {
  id: string;
  title: string;
  description: string;
  objectives: {
    id: string;
    description: string;
    completed: boolean;
    points: number;
  }[];
  totalPoints: number;
  progress: number; // 0-100
  startsAt: Date;
  endsAt: Date;
  completed: boolean;
  reward: {
    points: number;
    badge?: Badge;
    unlocks?: string[];
  };
}