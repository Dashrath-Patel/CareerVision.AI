import { NextRequest, NextResponse } from 'next/server';
import { geminiService, UserProfile } from '@/services/gemini-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, numberOfQuestions = 20 } = body;

    // Validate required fields
    if (!userProfile || !userProfile.selectedDomain) {
      return NextResponse.json(
        { error: 'User profile with selected domain is required' },
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

    console.log('Generating questions for:', userProfile.selectedDomain);

    // Generate AI-powered questions
    const questions = await geminiService.generateAssessmentQuestions(
      userProfile as UserProfile,
      numberOfQuestions
    );

    return NextResponse.json({
      success: true,
      questions,
      totalQuestions: questions.length,
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Question generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate assessment questions',
        details: error.message,
        fallback: 'Please try again or contact support if the issue persists.'
      },
      { status: 500 }
    );
  }
}