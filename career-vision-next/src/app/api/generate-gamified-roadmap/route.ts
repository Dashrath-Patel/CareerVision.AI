import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/services/gemini-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, assessmentResult } = body;

    // Validate required fields
    if (!userProfile || !assessmentResult) {
      return NextResponse.json(
        { error: 'Missing required fields: userProfile and assessmentResult' },
        { status: 400 }
      );
    }

    // Validate userProfile structure
    if (!userProfile.selectedDomain || !userProfile.skillLevel) {
      return NextResponse.json(
        { error: 'Invalid userProfile: missing selectedDomain or skillLevel' },
        { status: 400 }
      );
    }

    // Validate assessmentResult structure
    if (assessmentResult.percentage === undefined || !assessmentResult.strengthAreas || !assessmentResult.improvementAreas) {
      return NextResponse.json(
        { error: 'Invalid assessmentResult: missing required assessment data' },
        { status: 400 }
      );
    }

    console.log('Generating gamified roadmap for:', {
      domain: userProfile.selectedDomain,
      level: userProfile.skillLevel,
      score: assessmentResult.percentage
    });

    // Generate the gamified roadmap using Gemini AI
    const roadmap = await geminiService.generateGamifiedRoadmap(userProfile, assessmentResult);

    return NextResponse.json({
      success: true,
      roadmap,
      message: 'Gamified roadmap generated successfully'
    });

  } catch (error: any) {
    console.error('Error in generate-gamified-roadmap API:', error);
    
    // Provide a fallback gamified roadmap structure
    const fallbackRoadmap = {
      domain: 'General Technology',
      currentLevel: 'beginner',
      targetLevel: 'intermediate',
      totalEstimatedHours: 120,
      totalEstimatedWeeks: 12,
      difficultyLevel: 'beginner',
      milestones: [
        {
          id: 'm1',
          title: 'Foundation Building',
          description: 'Master the fundamental concepts and tools',
          category: 'fundamentals',
          skillArea: 'Core Knowledge',
          estimatedHours: 30,
          estimatedDays: 14,
          difficulty: 'easy',
          prerequisites: [],
          completionCriteria: ['Complete basic tutorials', 'Build first project'],
          resources: [
            {
              title: 'Getting Started Guide',
              type: 'tutorial',
              description: 'Comprehensive introduction to core concepts',
              estimatedTime: '3 hours',
              difficulty: 'beginner'
            }
          ],
          badges: [
            {
              id: 'b1',
              name: 'Foundation Master',
              description: 'Completed fundamental concepts',
              icon: '🏗️',
              category: 'milestone',
              requirements: 'Complete first milestone',
              points: 100
            }
          ],
          isCompleted: false
        }
      ],
      allBadges: [],
      skillProgression: [
        {
          skillName: 'Problem Solving',
          currentLevel: 3,
          targetLevel: 7,
          progressPercentage: 43,
          relatedMilestones: ['m1'],
          importanceScore: 90
        }
      ],
      motivationalQuotes: [
        "Every expert was once a beginner. Keep learning and growing!",
        "Progress, not perfection, is the goal."
      ],
      dailyGoals: [
        {
          id: 'd1',
          title: 'Study Core Concepts',
          description: 'Spend 30 minutes learning fundamental concepts',
          estimatedMinutes: 30,
          category: 'learning',
          relatedMilestone: 'm1',
          priority: 'high'
        }
      ],
      weeklyGoals: [
        {
          id: 'w1',
          title: 'Complete Foundation Module',
          description: 'Finish the fundamental concepts section',
          milestones: ['m1'],
          estimatedHours: 8,
          targetCompletionDate: '2025-10-01'
        }
      ],
      personalizedTips: [
        'Set aside consistent daily study time',
        'Practice what you learn immediately',
        'Join online communities for support'
      ],
      careerProjections: [
        {
          jobTitle: 'Junior Developer',
          industry: 'Technology',
          averageSalary: '$45,000 - $65,000',
          requiredSkills: ['Programming basics', 'Problem solving'],
          timeToAchieve: '6-12 months',
          probability: 75,
          description: 'Entry-level position perfect for new developers'
        }
      ]
    };

    return NextResponse.json({
      success: false,
      roadmap: fallbackRoadmap,
      error: 'AI service unavailable, using fallback roadmap',
      message: 'Generated fallback roadmap due to service limitations'
    }, { status: 200 });
  }
}