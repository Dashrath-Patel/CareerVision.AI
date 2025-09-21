import { NextRequest, NextResponse } from 'next/server';
import { geminiService, UserProfile, AssessmentQuestion } from '@/services/gemini-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, questions, answers } = body;

    // Validate required fields
    if (!userProfile || !questions || !answers) {
      return NextResponse.json(
        { error: 'User profile, questions, and answers are required' },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please contact administrator.' },
        { status: 500 }
      );
    }

    console.log('Analyzing assessment for:', userProfile.selectedDomain);

    // Analyze assessment results with AI
    const analysisResult = await geminiService.analyzeAssessmentResults(
      userProfile as UserProfile,
      questions as AssessmentQuestion[],
      answers
    );

    return NextResponse.json({
      success: true,
      result: analysisResult,
      analyzedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Assessment analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze assessment results',
        details: error.message,
        fallback: 'Please try again or contact support if the issue persists.'
      },
      { status: 500 }
    );
  }
}