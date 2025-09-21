import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Get the generative model
const model = genAI.getGenerativeModel({ 
  model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' 
});

// Utility function to clean and parse JSON from AI responses
function cleanAndParseJSON(response: string): any {
  let jsonString = response.trim();
  
  // Remove any surrounding text/explanations
  const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonString = jsonMatch[0];
  }
  
  // Extract from code blocks if present
  const codeBlockMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    jsonString = codeBlockMatch[1];
  }
  
  // Clean up common JSON formatting issues
  jsonString = jsonString
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
    .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":') // Add quotes to unquoted keys
    .replace(/:\s*'([^']*)'/g, ': "$1"') // Convert single quotes to double quotes
    .trim();
  
  return JSON.parse(jsonString);
}

export interface UserProfile {
  selectedDomain: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  educationLevel: string;
  experience: string;
  interests: string[];
  goals: string[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'scale' | 'open-ended';
  options?: string[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  skillArea: string;
}

export interface AssessmentResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  skillBreakdown: Record<string, number>;
  recommendedLevel: string;
  strengthAreas: string[];
  improvementAreas: string[];
  detailedAnalysis: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'skill' | 'achievement';
  requirements: string;
  points: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: string;
  skillArea: string;
  estimatedHours: number;
  estimatedDays: number;
  difficulty: 'easy' | 'medium' | 'hard';
  prerequisites: string[];
  completionCriteria: string[];
  resources: Resource[];
  badges: Badge[];
  isCompleted: boolean;
  completedDate?: string;
  userNotes?: string;
}

export interface GamifiedRoadmap {
  domain: string;
  currentLevel: string;
  targetLevel: string;
  totalEstimatedHours: number;
  totalEstimatedWeeks: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  milestones: Milestone[];
  allBadges: Badge[];
  skillProgression: SkillProgression[];
  motivationalQuotes: string[];
  dailyGoals: DailyGoal[];
  weeklyGoals: WeeklyGoal[];
  personalizedTips: string[];
  careerProjections: CareerProjection[];
}

export interface SkillProgression {
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  progressPercentage: number;
  relatedMilestones: string[];
  importanceScore: number;
}

export interface DailyGoal {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  category: 'learning' | 'practice' | 'reading' | 'project';
  relatedMilestone: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  milestones: string[];
  estimatedHours: number;
  targetCompletionDate: string;
}

export interface CareerProjection {
  jobTitle: string;
  industry: string;
  averageSalary: string;
  requiredSkills: string[];
  timeToAchieve: string;
  probability: number;
  description: string;
}

// New interfaces for additional features
export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'course' | 'tutorial' | 'book' | 'certification' | 'project' | 'practice';
  provider: string;
  url: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  rating: number;
  price: 'free' | 'paid' | 'freemium';
  relevanceScore: number;
  category: string;
}

export interface ResumeAnalysis {
  overallScore: number;
  skillsDetected: string[];
  experienceLevel: string;
  strengthAreas: string[];
  improvementAreas: string[];
  missingKeywords: string[];
  recommendations: string[];
  skillGaps: SkillGap[];
  careerSuggestions: string[];
  atsScore: number;
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: 'high' | 'medium' | 'low';
  learningPath: string[];
}

export interface EngagementData {
  dailyMotivation: DailyMotivation;
  reminders: Reminder[];
  achievements: Achievement[];
  streakData: StreakData;
  progressInsights: ProgressInsight[];
}

export interface DailyMotivation {
  quote: string;
  tip: string;
  challenge: string;
  goalReminder: string;
}

export interface Reminder {
  id: string;
  type: 'goal' | 'milestone' | 'practice' | 'review';
  title: string;
  message: string;
  scheduledTime: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string;
  category: string;
  points: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  lastActivityDate: string;
}

export interface ProgressInsight {
  metric: string;
  currentValue: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  insight: string;
}

export interface CareerRoadmap {
  domain: string;
  currentLevel: string;
  targetLevel: string;
  timeline: string;
  phases: RoadmapPhase[];
  resources: Resource[];
  skillGaps: string[];
  jobOpportunities: JobOpportunity[];
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  skills: string[];
  milestones: string[];
  resources: string[];
}

export interface Resource {
  title: string;
  type: 'course' | 'book' | 'certification' | 'project' | 'tutorial';
  url?: string;
  description: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface JobOpportunity {
  title: string;
  company?: string;
  salaryRange: string;
  requiredSkills: string[];
  description: string;
  growth: string;
}

class GeminiAIService {
  private async callGemini(prompt: string): Promise<string> {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini AI Error:', error);
      throw new Error('Failed to generate AI content. Please try again.');
    }
  }

  async generateAssessmentQuestions(
    userProfile: UserProfile,
    numberOfQuestions: number = 10
  ): Promise<AssessmentQuestion[]> {
    const prompt = `
You are an expert career assessment designer. Generate ${numberOfQuestions} personalized assessment questions for a user with the following profile:

Domain: ${userProfile.selectedDomain}
Skill Level: ${userProfile.skillLevel}
Education: ${userProfile.educationLevel}
Experience: ${userProfile.experience}
Interests: ${userProfile.interests.join(', ')}
Goals: ${userProfile.goals.join(', ')}

Create a diverse mix of question types:
- 60% Multiple choice questions (4 options each)
- 25% Scale questions (1-5 rating)
- 15% Open-ended questions

Questions should cover these areas:
1. Technical skills specific to ${userProfile.selectedDomain}
2. Problem-solving and analytical thinking
3. Communication and teamwork
4. Leadership and project management
5. Industry knowledge and trends
6. Career goals and motivation

Make questions adaptive to their ${userProfile.skillLevel} level. Include varying difficulty levels.

Return ONLY a valid JSON array in this exact format:
[
  {
    "id": "q1",
    "question": "Question text here",
    "type": "multiple-choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "category": "Technical Skills",
    "difficulty": "medium",
    "explanation": "Brief explanation of why this question is relevant",
    "skillArea": "Specific skill being tested"
  }
]

Ensure all questions are professional, unbiased, and relevant to ${userProfile.selectedDomain}.
`;

    try {
      const response = await this.callGemini(prompt);
      
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }
      
      const questions = JSON.parse(jsonMatch[0]);
      return questions.map((q: any, index: number) => ({
        ...q,
        id: q.id || `q${index + 1}`
      }));
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error('Failed to generate assessment questions');
    }
  }

  async analyzeAssessmentResults(
    userProfile: UserProfile,
    questions: AssessmentQuestion[],
    answers: Record<string, any>
  ): Promise<AssessmentResult> {
    const prompt = `
You are an expert career analyst. Analyze the assessment results for a user with this profile:

Domain: ${userProfile.selectedDomain}
Skill Level: ${userProfile.skillLevel}
Education: ${userProfile.educationLevel}
Experience: ${userProfile.experience}

Questions and Answers:
${questions.map((q, i) => `
Question ${i + 1} (${q.category} - ${q.difficulty}): ${q.question}
Answer: ${answers[q.id] || 'Not answered'}
Skill Area: ${q.skillArea}
`).join('\n')}

Provide a comprehensive analysis including:
1. Overall performance score (0-100)
2. Skill breakdown by category
3. Strength areas
4. Areas for improvement
5. Recommended skill level progression
6. Detailed analysis narrative

Return ONLY valid JSON in this format:
{
  "totalScore": 85,
  "maxScore": 100,
  "percentage": 85,
  "skillBreakdown": {
    "Technical Skills": 90,
    "Problem Solving": 80,
    "Communication": 75,
    "Leadership": 70,
    "Industry Knowledge": 85
  },
  "recommendedLevel": "intermediate",
  "strengthAreas": ["List of strengths"],
  "improvementAreas": ["List of areas to improve"],
  "detailedAnalysis": "Comprehensive analysis paragraph explaining the results, strengths, weaknesses, and recommendations for career development."
}
`;

    try {
      const response = await this.callGemini(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid analysis response format');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error analyzing results:', error);
      throw new Error('Failed to analyze assessment results');
    }
  }

  async generateCareerRoadmap(
    userProfile: UserProfile,
    assessmentResult: AssessmentResult
  ): Promise<CareerRoadmap> {
    const prompt = `
You are an expert career counselor. Create a personalized career roadmap for:

User Profile:
- Domain: ${userProfile.selectedDomain}
- Current Level: ${assessmentResult.recommendedLevel}
- Education: ${userProfile.educationLevel}
- Experience: ${userProfile.experience}
- Goals: ${userProfile.goals.join(', ')}

Assessment Results:
- Overall Score: ${assessmentResult.percentage}%
- Strengths: ${assessmentResult.strengthAreas.join(', ')}
- Improvement Areas: ${assessmentResult.improvementAreas.join(', ')}
- Skill Breakdown: ${JSON.stringify(assessmentResult.skillBreakdown)}

Create a comprehensive 12-month roadmap with:
1. 3-4 learning phases (3 months each)
2. Specific skills to develop
3. Recommended resources
4. Job opportunities to target
5. Personalized advice

Return ONLY valid JSON in this format:
{
  "domain": "${userProfile.selectedDomain}",
  "currentLevel": "${assessmentResult.recommendedLevel}",
  "targetLevel": "advanced",
  "timeline": "12 months",
  "phases": [
    {
      "phase": "Foundation Building",
      "duration": "3 months",
      "skills": ["Skill 1", "Skill 2"],
      "milestones": ["Milestone 1", "Milestone 2"],
      "resources": ["Resource 1", "Resource 2"]
    }
  ],
  "resources": [
    {
      "title": "Resource Title",
      "type": "course",
      "url": "optional",
      "description": "Description",
      "estimatedTime": "4 weeks",
      "difficulty": "beginner"
    }
  ],
  "skillGaps": ["Skills to develop"],
  "jobOpportunities": [
    {
      "title": "Job Title",
      "company": "Optional",
      "salaryRange": "$XX,XXX - $XX,XXX",
      "requiredSkills": ["Skill 1", "Skill 2"],
      "description": "Job description",
      "growth": "High/Medium/Low"
    }
  ],
  "personalizedAdvice": "Detailed personalized advice paragraph based on their profile and assessment results."
}
`;

    try {
      const response = await this.callGemini(prompt);
      return cleanAndParseJSON(response);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      throw new Error('Failed to generate career roadmap');
    }
  }

  async generateGamifiedRoadmap(
    userProfile: UserProfile,
    assessmentResult: AssessmentResult
  ): Promise<GamifiedRoadmap> {
    const prompt = `
You are an expert career strategist and gamification designer. Create a comprehensive, gamified career roadmap.

CRITICAL INSTRUCTIONS:
1. Return ONLY valid JSON - no comments, no explanations, no extra text
2. Do not include // comments or /* */ comments in the JSON
3. Use proper JSON syntax with double quotes for all strings
4. Do not include trailing commas
5. The response must start with { and end with }

User Profile:
- Domain: ${userProfile.selectedDomain}
- Current Level: ${userProfile.skillLevel}
- Education: ${userProfile.educationLevel}
- Experience: ${userProfile.experience}
- Goals: ${userProfile.goals.join(', ')}
- Interests: ${userProfile.interests.join(', ')}

Assessment Results:
- Score: ${assessmentResult.percentage}%
- Strengths: ${assessmentResult.strengthAreas.join(', ')}
- Areas for Improvement: ${assessmentResult.improvementAreas.join(', ')}
- Detailed Analysis: ${assessmentResult.detailedAnalysis}

Create a gamified roadmap that includes:
1. 8-12 progressive milestones with specific learning objectives
2. Achievement badges for motivation
3. Daily and weekly goals
4. Skill progression tracking
5. Career projections and opportunities
6. Curated resources for each milestone
7. Motivational elements

Return ONLY a valid JSON object in this exact format:
{
  "domain": "${userProfile.selectedDomain}",
  "currentLevel": "${userProfile.skillLevel}",
  "targetLevel": "expert",
  "totalEstimatedHours": 240,
  "totalEstimatedWeeks": 24,
  "difficultyLevel": "${userProfile.skillLevel}",
  "milestones": [
    {
      "id": "m1",
      "title": "Milestone Title",
      "description": "Detailed description",
      "category": "fundamentals",
      "skillArea": "Core Skills",
      "estimatedHours": 20,
      "estimatedDays": 7,
      "difficulty": "easy",
      "prerequisites": [],
      "completionCriteria": ["Criteria 1", "Criteria 2"],
      "resources": [
        {
          "title": "Resource Title",
          "type": "course",
          "url": "https://example.com",
          "description": "Resource description",
          "estimatedTime": "2 hours",
          "difficulty": "beginner"
        }
      ],
      "badges": [
        {
          "id": "b1",
          "name": "Badge Name",
          "description": "Badge description",
          "icon": "🏆",
          "category": "milestone",
          "requirements": "Complete milestone",
          "points": 100
        }
      ],
      "isCompleted": false
    }
  ],
  "allBadges": [],
  "skillProgression": [
    {
      "skillName": "JavaScript",
      "currentLevel": 3,
      "targetLevel": 8,
      "progressPercentage": 37,
      "relatedMilestones": ["m1", "m2"],
      "importanceScore": 95
    }
  ],
  "motivationalQuotes": ["Motivational quote here"],
  "dailyGoals": [
    {
      "id": "d1",
      "title": "Daily Goal",
      "description": "What to do today",
      "estimatedMinutes": 30,
      "category": "learning",
      "relatedMilestone": "m1",
      "priority": "high"
    }
  ],
  "weeklyGoals": [
    {
      "id": "w1",
      "title": "Weekly Goal",
      "description": "What to accomplish this week",
      "milestones": ["m1"],
      "estimatedHours": 10,
      "targetCompletionDate": "2025-10-01"
    }
  ],
  "personalizedTips": ["Tip 1", "Tip 2"],
  "careerProjections": [
    {
      "jobTitle": "Senior Developer",
      "industry": "Technology",
      "averageSalary": "$85,000 - $120,000",
      "requiredSkills": ["JavaScript", "React"],
      "timeToAchieve": "12-18 months",
      "probability": 85,
      "description": "Career path description"
    }
  ]
}

REMEMBER: Return ONLY the JSON object above. No additional text, no comments, no explanations. The response must be valid JSON that can be parsed directly.
`;

    try {
      const response = await this.callGemini(prompt);
      
      // Use the utility function to clean and parse JSON
      const roadmap = cleanAndParseJSON(response);
      
      // Validate the structure
      if (!roadmap.milestones || !Array.isArray(roadmap.milestones)) {
        throw new Error('Invalid roadmap structure: missing milestones array');
      }
      
      return roadmap;
    } catch (error) {
      console.error('Error generating gamified roadmap:', error);
      
      // Try alternative parsing approaches
      try {
        const fallbackResponse = await this.callGemini(prompt);
        console.error('Attempting fallback parsing for response:', fallbackResponse);
        
        // Try to extract just the core structure
        const simplifiedMatch = fallbackResponse.match(/"milestones"\s*:\s*\[([\s\S]*?)\]/);
        if (simplifiedMatch) {
          const basicRoadmap: GamifiedRoadmap = {
            domain: userProfile.selectedDomain,
            currentLevel: userProfile.skillLevel,
            targetLevel: 'expert',
            totalEstimatedHours: 240,
            totalEstimatedWeeks: 24,
            difficultyLevel: userProfile.skillLevel,
            milestones: [],
            allBadges: [],
            skillProgression: [],
            motivationalQuotes: ['Keep learning and growing!'],
            dailyGoals: [],
            weeklyGoals: [],
            personalizedTips: ['Focus on consistent daily practice'],
            careerProjections: []
          };
          
          try {
            const milestonesJson = `[${simplifiedMatch[1]}]`;
            const cleaned = milestonesJson
              .replace(/\/\/.*$/gm, '')
              .replace(/\/\*[\s\S]*?\*\//g, '')
              .replace(/,(\s*[}\]])/g, '$1');
            basicRoadmap.milestones = JSON.parse(cleaned);
            return basicRoadmap;
          } catch (milestoneError) {
            console.error('Failed to parse milestones:', milestoneError);
          }
        }
      } catch (fallbackError) {
        console.error('Fallback generation also failed:', fallbackError);
      }
      
      throw new Error('Failed to generate gamified roadmap: Invalid JSON format from AI response');
    }
  }

  async getPersonalizedAdvice(
    userProfile: UserProfile,
    assessmentResult: AssessmentResult,
    specificQuestion?: string
  ): Promise<string> {
    const prompt = `
You are an AI career coach. Provide personalized advice for:

User Profile: ${JSON.stringify(userProfile)}
Assessment Results: ${JSON.stringify(assessmentResult)}
${specificQuestion ? `Specific Question: ${specificQuestion}` : ''}

Provide encouraging, actionable, and personalized career advice in 2-3 paragraphs.
Focus on their strengths, address improvement areas, and provide concrete next steps.
`;

    try {
      return await this.callGemini(prompt);
    } catch (error) {
      console.error('Error generating advice:', error);
      throw new Error('Failed to generate personalized advice');
    }
  }

  // Generate personalized learning resource recommendations
  async generateResourceRecommendations(
    userProfile: UserProfile,
    assessmentResult: AssessmentResult,
    specificSkills?: string[]
  ): Promise<LearningResource[]> {
    const prompt = `
Generate personalized learning resource recommendations for a user with the following profile:

User Profile:
- Domain: ${userProfile.selectedDomain}
- Skill Level: ${userProfile.skillLevel}
- Experience: ${userProfile.experience}
- Goals: ${userProfile.goals.join(', ')}
- Interests: ${userProfile.interests.join(', ')}

Assessment Results:
- Overall Score: ${assessmentResult.percentage}%
- Strength Areas: ${assessmentResult.strengthAreas.join(', ')}
- Improvement Areas: ${assessmentResult.improvementAreas.join(', ')}
${specificSkills ? `Focus on these skills: ${specificSkills.join(', ')}` : ''}

Provide a JSON array of 8-12 learning resources with the following structure:
{
  "id": "unique_id",
  "title": "Resource Title",
  "description": "Brief description of what this resource covers",
  "type": "video|article|course|tutorial|book|certification|project|practice",
  "provider": "Platform or author name",
  "url": "https://example.com",
  "duration": "2 hours" or "3 weeks" etc,
  "difficulty": "beginner|intermediate|advanced",
  "skills": ["skill1", "skill2"],
  "rating": 4.5,
  "price": "free|paid|freemium",
  "relevanceScore": 95,
  "category": "category_name"
}

Focus on:
1. High-quality, reputable sources
2. Mix of free and paid resources
3. Various learning formats (videos, hands-on, reading)
4. Progressive difficulty levels
5. Resources that address identified skill gaps
6. Popular platforms like Coursera, Udemy, YouTube, freeCodeCamp, etc.

Return only the JSON array, no additional text.
`;

    try {
      const response = await this.callGemini(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating resource recommendations:', error);
      // Return fallback recommendations
      return this.getFallbackResourceRecommendations(userProfile.selectedDomain);
    }
  }

  // Analyze uploaded resume content
  async analyzeResume(resumeText: string, targetRole?: string): Promise<ResumeAnalysis> {
    const prompt = `
Analyze the following resume content and provide comprehensive feedback:

Resume Content:
${resumeText}

${targetRole ? `Target Role: ${targetRole}` : ''}

Provide analysis in the following JSON format:
{
  "overallScore": 85,
  "skillsDetected": ["JavaScript", "React", "Node.js"],
  "experienceLevel": "intermediate",
  "strengthAreas": ["Technical skills", "Project experience"],
  "improvementAreas": ["Leadership experience", "Certifications"],
  "missingKeywords": ["Agile", "Docker", "AWS"],
  "recommendations": ["Add more quantified achievements", "Include soft skills"],
  "skillGaps": [
    {
      "skill": "System Design",
      "currentLevel": 3,
      "requiredLevel": 7,
      "priority": "high",
      "learningPath": ["Study distributed systems", "Practice system design interviews"]
    }
  ],
  "careerSuggestions": ["Consider frontend specialization", "Explore full-stack roles"],
  "atsScore": 75
}

Focus on:
1. Skills extraction and assessment
2. Experience level evaluation
3. ATS (Applicant Tracking System) optimization
4. Missing industry keywords
5. Quantifiable achievements analysis
6. Career progression recommendations
7. Skill gap identification with learning paths

Return only the JSON object, no additional text.
`;

    try {
      const response = await this.callGemini(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw new Error('Failed to analyze resume');
    }
  }

  // Generate daily engagement content
  async generateDailyEngagement(
    userProfile: UserProfile,
    progressData: any,
    previousEngagement?: EngagementData
  ): Promise<EngagementData> {
    const prompt = `
Generate daily engagement content for a user with the following profile:

User Profile:
- Domain: ${userProfile.selectedDomain}
- Skill Level: ${userProfile.skillLevel}
- Goals: ${userProfile.goals.join(', ')}

Progress Data: ${JSON.stringify(progressData)}
${previousEngagement ? `Previous Engagement: ${JSON.stringify(previousEngagement)}` : ''}

Generate engaging daily content in the following JSON format:
{
  "dailyMotivation": {
    "quote": "Inspirational quote related to their field",
    "tip": "Practical daily tip for skill improvement",
    "challenge": "Small achievable challenge for today",
    "goalReminder": "Personalized reminder about their goals"
  },
  "reminders": [
    {
      "id": "r1",
      "type": "goal|milestone|practice|review",
      "title": "Reminder Title",
      "message": "Motivational reminder message",
      "scheduledTime": "09:00",
      "frequency": "daily",
      "isActive": true
    }
  ],
  "achievements": [
    {
      "id": "a1",
      "title": "Achievement Title",
      "description": "What they accomplished",
      "icon": "🏆",
      "dateEarned": "2025-09-20",
      "category": "learning",
      "points": 100
    }
  ],
  "streakData": {
    "currentStreak": 5,
    "longestStreak": 12,
    "totalDays": 45,
    "lastActivityDate": "2025-09-20"
  },
  "progressInsights": [
    {
      "metric": "Skills Learned",
      "currentValue": 8,
      "previousValue": 6,
      "trend": "up",
      "insight": "Great progress on technical skills this week!"
    }
  ]
}

Make it personalized, motivating, and actionable. Return only the JSON object.
`;

    try {
      const response = await this.callGemini(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating daily engagement:', error);
      return this.getFallbackEngagementData();
    }
  }

  // Fallback methods for error handling
  private getFallbackResourceRecommendations(domain: string): LearningResource[] {
    return [
      {
        id: "fallback-1",
        title: `${domain} Fundamentals Course`,
        description: "Comprehensive introduction to core concepts",
        type: "course",
        provider: "FreeCodeCamp",
        url: "https://freecodecamp.org",
        duration: "40 hours",
        difficulty: "beginner",
        skills: ["fundamentals", "basics"],
        rating: 4.5,
        price: "free",
        relevanceScore: 90,
        category: "fundamentals"
      },
      {
        id: "fallback-2",
        title: `Advanced ${domain} Techniques`,
        description: "Deep dive into advanced concepts and best practices",
        type: "tutorial",
        provider: "YouTube",
        url: "https://youtube.com",
        duration: "10 hours",
        difficulty: "advanced",
        skills: ["advanced techniques", "best practices"],
        rating: 4.3,
        price: "free",
        relevanceScore: 85,
        category: "advanced"
      }
    ];
  }

  private getFallbackEngagementData(): EngagementData {
    return {
      dailyMotivation: {
        quote: "The only way to do great work is to love what you do. - Steve Jobs",
        tip: "Spend 30 minutes today learning something new in your field",
        challenge: "Complete one coding exercise or read one technical article",
        goalReminder: "Remember your goal to advance your career - every step counts!"
      },
      reminders: [
        {
          id: "r1",
          type: "practice",
          title: "Daily Practice",
          message: "Time for your daily skill practice session!",
          scheduledTime: "09:00",
          frequency: "daily",
          isActive: true
        }
      ],
      achievements: [],
      streakData: {
        currentStreak: 1,
        longestStreak: 1,
        totalDays: 1,
        lastActivityDate: new Date().toISOString().split('T')[0]
      },
      progressInsights: [
        {
          metric: "Learning Streak",
          currentValue: 1,
          previousValue: 0,
          trend: "up",
          insight: "Great start on your learning journey!"
        }
      ]
    };
  }
}

export const geminiService = new GeminiAIService();