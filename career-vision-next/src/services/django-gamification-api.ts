// Django API integration service for gamification
import { 
  UserProfile, 
  UserProgress, 
  RoadmapStage, 
  Badge, 
  Achievement,
  DailyChallenge,
  WeeklyQuest,
  ProgressStats,
  LeaderboardEntry,
  ProgressUpdateResponse
} from '@/types/gamification';

class DjangoGamificationAPI {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') {
    this.baseUrl = `${baseUrl}/api/gamification`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // User Profile Management
  async getUserProfile(userId: string): Promise<UserProfile> {
    return this.request<UserProfile>(`/profile/${userId}/`);
  }

  async createOrUpdateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    return this.request<UserProfile>(`/profile/${userId}/`, {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  // Roadmap and Stages
  async getRoadmapStages(domain: string): Promise<RoadmapStage[]> {
    return this.request<RoadmapStage[]>(`/roadmap/${domain}/stages/`);
  }

  // User Progress
  async getUserProgress(userId: string): Promise<UserProgress> {
    return this.request<UserProgress>(`/progress/${userId}/`);
  }

  async updateProgress(userId: string, progressData: {
    type: 'stage_completed' | 'skill_practiced' | 'resource_completed' | 'daily_activity';
    stage_id?: string;
    skill_name?: string;
    resource_id?: string;
    points?: number;
    completion_time?: number;
    notes?: string;
    activity_details?: Record<string, any>;
  }): Promise<ProgressUpdateResponse> {
    return this.request<ProgressUpdateResponse>(`/progress/${userId}/update/`, {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  // Daily Challenges
  async getDailyChallenges(userId: string): Promise<DailyChallenge[]> {
    return this.request<DailyChallenge[]>(`/challenges/${userId}/`);
  }

  async completeChallenge(userId: string, challengeId: number): Promise<{
    message: string;
    points_earned: number;
    total_points: number;
  }> {
    return this.request(`/challenges/${userId}/${challengeId}/complete/`, {
      method: 'POST',
    });
  }

  // Weekly Quests
  async getWeeklyQuest(userId: string): Promise<WeeklyQuest | null> {
    try {
      return await this.request<WeeklyQuest>(`/quest/${userId}/`);
    } catch (error) {
      // Return null if no active quest
      return null;
    }
  }

  // Badges
  async getUserBadges(userId: string): Promise<Badge[]> {
    return this.request<Badge[]>(`/badges/${userId}/`);
  }

  // Leaderboard
  async getLeaderboard(domain?: string): Promise<LeaderboardEntry[]> {
    const endpoint = domain ? `/leaderboard/${domain}/` : '/leaderboard/';
    return this.request<LeaderboardEntry[]>(endpoint);
  }

  // Progress Statistics
  async getProgressStats(userId: string): Promise<ProgressStats> {
    return this.request<ProgressStats>(`/stats/${userId}/`);
  }

  // Utility methods for frontend integration
  async initializeUserForGamification(userId: string, domain: string): Promise<UserProfile> {
    try {
      // Try to get existing profile
      return await this.getUserProfile(userId);
    } catch (error) {
      // Create new profile if doesn't exist
      return this.createOrUpdateUserProfile(userId, {
        user_id: userId,
        domain,
        total_points: 0,
        current_level: 1,
        current_streak: 0,
        longest_streak: 0,
      });
    }
  }

  async syncProgressWithBackend(userId: string, frontendProgress: any): Promise<void> {
    // Sync any frontend-only progress with backend
    for (const stageId of frontendProgress.completedStages || []) {
      try {
        await this.updateProgress(userId, {
          type: 'stage_completed',
          stage_id: stageId,
        });
      } catch (error) {
        console.warn(`Failed to sync stage ${stageId}:`, error);
      }
    }
  }

  // Batch operations for better performance
  async batchUpdateProgress(userId: string, progressUpdates: Array<{
    type: 'stage_completed' | 'skill_practiced' | 'resource_completed';
    [key: string]: any;
  }>): Promise<ProgressUpdateResponse[]> {
    const results = [];
    
    for (const update of progressUpdates) {
      try {
        const result = await this.updateProgress(userId, update);
        results.push(result);
      } catch (error) {
        console.error('Batch update failed for:', update, error);
        results.push({ error: error.message });
      }
    }
    
    return results;
  }

  // Real-time progress tracking
  async trackLearningSession(userId: string, sessionData: {
    duration: number; // in minutes
    activitiesCompleted: string[];
    skillsPracticed: string[];
    resourcesUsed: string[];
  }): Promise<ProgressUpdateResponse> {
    // Log daily activity
    const dailyActivityResult = await this.updateProgress(userId, {
      type: 'daily_activity',
      activity_details: {
        duration: sessionData.duration,
        activities: sessionData.activitiesCompleted,
        timestamp: new Date().toISOString(),
      },
    });

    // Track individual skills practiced
    for (const skill of sessionData.skillsPracticed) {
      await this.updateProgress(userId, {
        type: 'skill_practiced',
        skill_name: skill,
      });
    }

    // Track resources completed
    for (const resource of sessionData.resourcesUsed) {
      await this.updateProgress(userId, {
        type: 'resource_completed',
        resource_id: resource,
        points: 25, // Default points for resource completion
      });
    }

    return dailyActivityResult;
  }

  // Achievement progress checking
  async checkAchievementProgress(userId: string): Promise<Achievement[]> {
    const progress = await this.getUserProgress(userId);
    return progress.achievements || [];
  }

  // Performance analytics
  async getWeeklyAnalytics(userId: string): Promise<{
    weeklyProgress: number;
    dailyActivity: Array<{ date: string; points: number; activities: number }>;
    skillGrowth: Array<{ skill: string; improvement: number }>;
    streakData: { current: number; best: number; weeklyActive: number };
  }> {
    const stats = await this.getProgressStats(userId);
    const progress = await this.getUserProgress(userId);
    
    // Transform backend data for analytics
    return {
      weeklyProgress: stats.weekly_goal_progress || 0,
      dailyActivity: [], // Would need to be calculated from activity logs
      skillGrowth: stats.skill_distribution?.map(skill => ({
        skill: skill.skill,
        improvement: skill.progress,
      })) || [],
      streakData: {
        current: progress.streak?.current_streak || 0,
        best: progress.streak?.longest_streak || 0,
        weeklyActive: 7, // Placeholder - would calculate from activity logs
      },
    };
  }

  // Error handling and retry logic
  private async withRetry<T>(
    operation: () => Promise<T>, 
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
        }
      }
    }
    
    throw lastError;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseUrl.replace('/api/gamification', '')}/health/`);
      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Singleton instance for use throughout the application
export const djangoGamificationAPI = new DjangoGamificationAPI();

// Hook for React components
export function useDjangoGamificationAPI() {
  return djangoGamificationAPI;
}

// Error boundary helper
export class GamificationAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'GamificationAPIError';
  }
}

export default DjangoGamificationAPI;