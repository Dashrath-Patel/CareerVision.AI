import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/services/gemini-ai';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { resumeText, targetRole }: {
    resumeText: string;
    targetRole?: string;
  } = body;

  try {
    // Validate required fields
    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Resume text is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Validate resume text length (should be reasonable)
    if (resumeText.length < 100) {
      return NextResponse.json(
        { error: 'Resume text appears too short. Please provide a complete resume.' },
        { status: 400 }
      );
    }

    if (resumeText.length > 50000) {
      return NextResponse.json(
        { error: 'Resume text is too long. Please limit to 50,000 characters.' },
        { status: 400 }
      );
    }

    // Analyze resume using Gemini AI
    const analysis = await geminiService.analyzeResume(resumeText, targetRole);

    return NextResponse.json({
      success: true,
      analysis: analysis,
      metadata: {
        analyzedAt: new Date().toISOString(),
        targetRole: targetRole || 'General Analysis',
        textLength: resumeText.length,
        processingTime: Date.now()
      }
    });

  } catch (error) {
    console.error('Resume analysis error:', error);
    
    // Provide fallback analysis if AI fails
    const fallbackAnalysis = {
      overallScore: 70,
      skillsDetected: ['General skills detected from resume'],
      experienceLevel: 'intermediate',
      strengthAreas: ['Experience', 'Education'],
      improvementAreas: ['Skills section', 'Quantified achievements'],
      missingKeywords: ['Industry-specific keywords'],
      recommendations: [
        'Add more quantified achievements',
        'Include relevant technical skills',
        'Optimize for ATS systems'
      ],
      skillGaps: [],
      careerSuggestions: ['Consider adding more specific achievements'],
      atsScore: 65
    };

    return NextResponse.json({
      success: true,
      analysis: fallbackAnalysis,
      note: 'Analysis completed with fallback system due to AI service limitations',
      metadata: {
        analyzedAt: new Date().toISOString(),
        targetRole: targetRole || 'General Analysis',
        textLength: resumeText.length,
        fallbackUsed: true
      }
    });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Resume Analysis API',
    endpoints: {
      POST: '/api/analyze-resume - Analyze resume content for skills and improvements'
    },
    requirements: {
      resumeText: 'string (100-50000 characters)',
      targetRole: 'string (optional)'
    }
  });
}