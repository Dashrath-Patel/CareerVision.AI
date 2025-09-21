import { NextRequest, NextResponse } from 'next/server';
import { geminiService, UserProfile, EngagementData } from '@/services/gemini-ai';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userProfile, progressData, previousEngagement }: {
    userProfile: UserProfile;
    progressData: any;
    previousEngagement?: EngagementData;
  } = body;

  try {
    // Validate required fields
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile is required' },
        { status: 400 }
      );
    }

    // Generate daily engagement content using Gemini AI
    const engagementData = await geminiService.generateDailyEngagement(
      userProfile,
      progressData || {},
      previousEngagement
    );

    return NextResponse.json({
      success: true,
      engagement: engagementData,
      metadata: {
        generatedAt: new Date().toISOString(),
        userDomain: userProfile.selectedDomain,
        userLevel: userProfile.skillLevel,
        hasProgressData: !!progressData,
        hasPreviousData: !!previousEngagement
      }
    });

  } catch (error) {
    console.error('Daily engagement generation error:', error);
    
    // Provide fallback engagement data
    const fallbackEngagement: EngagementData = {
      dailyMotivation: {
        quote: "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
        tip: `Spend 30 minutes today practicing your ${userProfile?.selectedDomain || 'skills'}`,
        challenge: "Complete one learning task from your roadmap today",
        goalReminder: "Every step forward is progress toward your career goals!"
      },
      reminders: [
        {
          id: `reminder-${Date.now()}`,
          type: "practice",
          title: "Daily Learning",
          message: "Time for your daily skill building session!",
          scheduledTime: "09:00",
          frequency: "daily",
          isActive: true
        }
      ],
      achievements: [
        {
          id: `achievement-${Date.now()}`,
          title: "Daily Engagement",
          description: "Accessed your daily motivation and goals",
          icon: "🎯",
          dateEarned: new Date().toISOString().split('T')[0],
          category: "engagement",
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
          metric: "Daily Engagement",
          currentValue: 1,
          previousValue: 0,
          trend: "up",
          insight: "Great job staying engaged with your learning goals!"
        }
      ]
    };

    return NextResponse.json({
      success: true,
      engagement: fallbackEngagement,
      note: 'Engagement data generated with fallback system',
      metadata: {
        generatedAt: new Date().toISOString(),
        userDomain: userProfile?.selectedDomain || 'unknown',
        userLevel: userProfile?.skillLevel || 'unknown',
        fallbackUsed: true
      }
    });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Daily Engagement API',
    endpoints: {
      POST: '/api/daily-engagement - Generate daily motivation, reminders, and insights'
    },
    requirements: {
      userProfile: 'UserProfile object',
      progressData: 'any (optional)',
      previousEngagement: 'EngagementData (optional)'
    }
  });
}