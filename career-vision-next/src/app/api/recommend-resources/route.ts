import { NextRequest, NextResponse } from 'next/server';
import { geminiService, UserProfile, AssessmentResult } from '@/services/gemini-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, assessmentResult, specificSkills }: {
      userProfile: UserProfile;
      assessmentResult: AssessmentResult;
      specificSkills?: string[];
    } = body;

    // Validate required fields
    if (!userProfile || !assessmentResult) {
      return NextResponse.json(
        { error: 'Missing required fields: userProfile and assessmentResult' },
        { status: 400 }
      );
    }

    // Generate resource recommendations using Gemini AI
    const resources = await geminiService.generateResourceRecommendations(
      userProfile,
      assessmentResult,
      specificSkills
    );

    return NextResponse.json({
      success: true,
      resources: resources,
      metadata: {
        totalResources: resources.length,
        generatedAt: new Date().toISOString(),
        skillFocus: specificSkills || assessmentResult.improvementAreas,
        userLevel: userProfile.skillLevel
      }
    });

  } catch (error) {
    console.error('Resource recommendation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate resource recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Resource Recommendation API',
    endpoints: {
      POST: '/api/recommend-resources - Generate personalized learning resources'
    }
  });
}