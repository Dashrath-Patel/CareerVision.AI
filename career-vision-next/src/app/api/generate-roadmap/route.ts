import { NextRequest, NextResponse } from 'next/server';
import { geminiService, UserProfile, AssessmentResult } from '@/services/gemini-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, assessmentResult } = body;

    // Validate required fields
    if (!userProfile || !assessmentResult) {
      return NextResponse.json(
        { error: 'User profile and assessment result are required' },
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

    console.log('Generating roadmap for:', userProfile.selectedDomain);

    // Generate AI-powered career roadmap
    const roadmap = await geminiService.generateCareerRoadmap(
      userProfile as UserProfile,
      assessmentResult as AssessmentResult
    );

    return NextResponse.json({
      success: true,
      roadmap,
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Roadmap generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate career roadmap',
        details: error.message,
        fallback: 'Please try again or contact support if the issue persists.'
      },
      { status: 500 }
    );
  }
}