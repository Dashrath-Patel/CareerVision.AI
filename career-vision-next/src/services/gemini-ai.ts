import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Get the generative model
const model = genAI.getGenerativeModel({ 
  model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' 
});

// Utility function to clean and parse JSON from AI responses
// Returns null if parsing fails completely
function cleanAndParseJSON(response: string): any | null {
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
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .replace(/\n\s*\n/g, '\n') // Remove extra newlines
    .trim();
  
  // Try to fix common JSON structure issues
  try {
    return JSON.parse(jsonString);
  } catch (firstError) {
    const firstErrorMsg = firstError instanceof Error ? firstError.message : 'Unknown error';
    console.warn('First JSON parse failed, attempting repairs:', firstErrorMsg);
    console.log('Problematic JSON substring:', jsonString.substring(Math.max(0, 700), 800));
    
    // Try to fix specific issues that commonly occur
    let repairedJson = jsonString;
    
    // Fix unterminated strings - find unclosed quotes and close them
    if (firstErrorMsg.includes('Unterminated string')) {
      // Find all quote positions
      const quotePositions = [];
      for (let i = 0; i < repairedJson.length; i++) {
        if (repairedJson[i] === '"' && (i === 0 || repairedJson[i-1] !== '\\')) {
          quotePositions.push(i);
        }
      }
      
      // If we have an odd number of quotes, we have an unterminated string
      if (quotePositions.length % 2 === 1) {
        const lastQuotePos = quotePositions[quotePositions.length - 1];
        // Find the next logical place to close the string (before comma, brace, or bracket)
        const nextStructuralChar = repairedJson.substring(lastQuotePos + 1).search(/[,}\]]/);
        if (nextStructuralChar !== -1) {
          const insertPos = lastQuotePos + 1 + nextStructuralChar;
          repairedJson = repairedJson.substring(0, insertPos) + '"' + repairedJson.substring(insertPos);
        } else {
          // Just add quote at the end if no structural character found
          repairedJson += '"';
        }
      }
    }
    
    // Enhanced fix for missing commas after property values
    repairedJson = repairedJson
      .replace(/}(\s*"){/g, '},$1{') // Missing comma between objects
      .replace(/}(\s*{)/g, '},$1') // Missing comma between objects
      .replace(/](\s*"){/g, '],$1{') // Missing comma after array before object
      .replace(/](\s*{)/g, '],$1') // Missing comma after array before object
      .replace(/(\w)(\s*"[^"]*":\s*)/g, '$1,$2') // Missing comma before property after value
      .replace(/"([^"]*)"(\s*])(\s*,?\s*)(\[|{)/g, '"$1"$2,$4') // Missing comma after array closing bracket
      .replace(/(["\]\}])(\s*)(["\[])/g, '$1,$2$3') // General missing comma pattern
      .replace(/("methodology")(\s*)(])(\s*)(\[|{)/g, '$1$2$3,$5'); // Specific fix for "methodology" pattern
    
    // Fix unterminated array elements and incomplete property values
    repairedJson = repairedJson
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas first
      .replace(/("[^"]*")\s*([}\]])/g, '$1$2') // Fix spacing before closing brackets
      .replace(/:\s*"([^"]*)[^"]*$/g, ': "$1"') // Fix incomplete values at end
      .replace(/([^,}\]"\s])\s*([}\]])/g, '$1"$2'); // Add missing quotes before closing brackets
    
    // Fix incomplete URL properties and missing commas more aggressively
    repairedJson = repairedJson
      .replace(/"url":\s*"https:\s*"/g, '"url": ""') // Fix incomplete https URLs
      .replace(/"url":\s*"https?[^"]*\s*"/g, (match) => {
        // Try to complete broken URLs
        if (!match.includes('//')) {
          return '"url": ""'; // Remove malformed URLs
        }
        return match;
      })
      .replace(/"url":\s*"[^"]*\s+"/g, '"url": ""') // Remove URLs with spaces
      .replace(/"url":\s*"https:\s*/g, '"url": "",') // Fix incomplete https with missing quote and comma
      .replace(/"url":\s*"[^"]*"\s*"description"/g, '"url": "", "description"') // Fix missing comma between url and description
      .replace(/"\s*"description"/g, '", "description"') // Fix missing comma before description
      .replace(/("course"|"tutorial"|"book"|"certification"|"project")\s*,?\s*"description"/g, '$1", "description"'); // Fix missing comma after type
    
    // Fix incomplete strings or objects at the end
    if (repairedJson.match(/[{,]\s*$/)) {
      // Remove incomplete trailing structures
      repairedJson = repairedJson.replace(/[{,]\s*$/, '');
    }
    
    // Fix incomplete property values
    if (repairedJson.match(/:\s*$/)) {
      repairedJson = repairedJson.replace(/:\s*$/, ': ""');
    }
    
    // Fix incomplete property values that are missing quotes
    repairedJson = repairedJson
      .replace(/:\s*([^",\}\]]+)(\s*[,\}\]])/g, ': "$1"$2')
      .replace(/:\s*"([^"]*)\s*([,\}\]])/g, ': "$1"$2'); // Fix broken quoted values
    
    // Ensure proper closing brackets and braces
    const openBraces = (repairedJson.match(/\{/g) || []).length;
    const closeBraces = (repairedJson.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      for (let i = 0; i < openBraces - closeBraces; i++) {
        repairedJson += '}';
      }
    }
    
    const openBrackets = (repairedJson.match(/\[/g) || []).length;
    const closeBrackets = (repairedJson.match(/\]/g) || []).length;
    if (openBrackets > closeBrackets) {
      repairedJson += ']';
    }
    
    // Remove any trailing commas that might have been introduced
    repairedJson = repairedJson.replace(/,(\s*[}\]])/g, '$1');
    
    try {
      return JSON.parse(repairedJson);
    } catch (secondError) {
      const secondErrorMsg = secondError instanceof Error ? secondError.message : 'Unknown error';
      console.warn('JSON repair also failed:', secondErrorMsg);
      console.log('Failed repaired JSON substring:', repairedJson.substring(Math.max(0, 700), 800));
      
      // If repair still fails, try a more aggressive approach
      try {
        // Try to truncate at the problematic position and close structures
        const errorPos = parseInt(secondErrorMsg.match(/position (\d+)/)?.[1] || '0');
        if (errorPos > 0) {
          let truncatedJson = repairedJson.substring(0, errorPos);
          
          // Try to find a safe truncation point (after a complete property or array element)
          const safePoints = [
            truncatedJson.lastIndexOf('"}'),
            truncatedJson.lastIndexOf('"]}'),
            truncatedJson.lastIndexOf('"]'),
            truncatedJson.lastIndexOf('}]'),
            truncatedJson.lastIndexOf('}}')
          ];
          
          const safestPoint = Math.max(...safePoints.filter(p => p > errorPos - 50));
          if (safestPoint > 0 && safestPoint < errorPos) {
            truncatedJson = repairedJson.substring(0, safestPoint + 2);
          }
          
          // Remove any incomplete trailing property or value
          truncatedJson = truncatedJson.replace(/,\s*"[^"]*"?\s*:?\s*"?[^"]*"?\s*$/, '');
          truncatedJson = truncatedJson.replace(/,\s*$/, '');
          
          // Close any open structures
          const openBraces = (truncatedJson.match(/\{/g) || []).length;
          const closeBraces = (truncatedJson.match(/\}/g) || []).length;
          const openBrackets = (truncatedJson.match(/\[/g) || []).length;
          const closeBrackets = (truncatedJson.match(/\]/g) || []).length;
          
          // Add missing closing brackets/braces
          for (let i = 0; i < (openBrackets - closeBrackets); i++) {
            truncatedJson += ']';
          }
          for (let i = 0; i < (openBraces - closeBraces); i++) {
            truncatedJson += '}';
          }
          
          // Clean up any trailing commas
          truncatedJson = truncatedJson.replace(/,(\s*[}\]])/g, '$1');
          
          return JSON.parse(truncatedJson);
        }
      } catch (truncateError) {
        console.warn('Truncation repair also failed, returning null for fallback handling');
      }
      
      // Return null instead of throwing error to allow fallback system to work
      return null;
    }
  }
}

// Last resort fallback function for when JSON parsing completely fails
function createBasicFallbackRoadmap(userProfile: UserProfile): GamifiedRoadmap {
  const domain = userProfile.selectedDomain || 'general';
  const skillLevel = userProfile.skillLevel || 'beginner';
  
  // Customize content based on domain
  const domainSpecificContent = {
    'software-development': {
      skills: ['Programming', 'Problem Solving', 'Code Review'],
      resources: [
        { title: 'Coding Fundamentals', description: 'Learn programming basics' },
        { title: 'Algorithm Practice', description: 'Practice coding problems' },
        { title: 'Project Building', description: 'Build real-world projects' }
      ]
    },
    'data-science': {
      skills: ['Data Analysis', 'Machine Learning', 'Statistics'],
      resources: [
        { title: 'Data Analysis Basics', description: 'Learn data manipulation' },
        { title: 'ML Fundamentals', description: 'Introduction to machine learning' },
        { title: 'Statistics Course', description: 'Statistical analysis methods' }
      ]
    },
    'digital-marketing': {
      skills: ['SEO', 'Content Marketing', 'Analytics'],
      resources: [
        { title: 'Digital Marketing Basics', description: 'Marketing fundamentals' },
        { title: 'SEO Guide', description: 'Search engine optimization' },
        { title: 'Analytics Training', description: 'Track and measure success' }
      ]
    }
  };
  
  const content = domainSpecificContent[domain as keyof typeof domainSpecificContent] || {
    skills: ['Core Skills', 'Problem Solving', 'Communication'],
    resources: [
      { title: 'Getting Started Guide', description: 'Begin your learning journey' },
      { title: 'Practice Exercises', description: 'Hands-on practice' },
      { title: 'Advanced Concepts', description: 'Deep dive into topics' }
    ]
  };

  return {
    domain: domain,
    currentLevel: skillLevel,
    targetLevel: 'expert',
    totalEstimatedHours: 180,
    totalEstimatedWeeks: 18,
    difficultyLevel: skillLevel,
    milestones: [
      {
        id: 'm1',
        title: 'Foundation Building',
        description: `Build foundational skills in ${userProfile.selectedDomain || 'your chosen field'}`,
        category: 'fundamentals',
        skillArea: 'Core Skills',
        estimatedHours: 40,
        estimatedDays: 14,
        difficulty: 'easy',
        prerequisites: [],
        completionCriteria: [
          'Complete introductory materials',
          'Practice basic concepts',
          'Understand core terminology'
        ],
        resources: [
          {
            title: content.resources[0].title,
            type: 'tutorial',
            url: '',
            description: content.resources[0].description,
            estimatedTime: '8 hours',
            difficulty: 'beginner'
          },
          {
            title: content.resources[1].title,
            type: 'course',
            url: '',
            description: content.resources[1].description,
            estimatedTime: '20 hours',
            difficulty: 'beginner'
          },
          {
            title: content.resources[2].title,
            type: 'project',
            url: '',
            description: content.resources[2].description,
            estimatedTime: '12 hours',
            difficulty: 'beginner'
          }
        ],
        badges: [
          {
            id: 'b1',
            name: 'Foundation Builder',
            description: 'Built strong fundamentals',
            icon: '🏗️',
            category: 'milestone',
            requirements: 'Complete milestone m1',
            points: 100
          }
        ],
        isCompleted: false
      },
      {
        id: 'm2',
        title: 'Skill Development',
        description: `Develop intermediate skills and practical experience in ${userProfile.selectedDomain || 'your field'}`,
        category: 'development',
        skillArea: 'Practical Skills',
        estimatedHours: 60,
        estimatedDays: 21,
        difficulty: 'medium',
        prerequisites: ['m1'],
        completionCriteria: [
          'Complete intermediate projects',
          'Demonstrate practical application',
          'Receive peer feedback'
        ],
        resources: [
          {
            title: 'Advanced Concepts Course',
            type: 'course',
            url: '',
            description: 'Deep dive into intermediate concepts',
            estimatedTime: '25 hours',
            difficulty: 'intermediate'
          },
          {
            title: 'Project Portfolio',
            type: 'project',
            url: '',
            description: 'Build a portfolio of practical projects',
            estimatedTime: '30 hours',
            difficulty: 'intermediate'
          },
          {
            title: 'Industry Best Practices',
            type: 'book',
            url: '',
            description: 'Learn professional standards and practices',
            estimatedTime: '5 hours',
            difficulty: 'intermediate'
          }
        ],
        badges: [
          {
            id: 'b2',
            name: 'Skill Developer',
            description: 'Developed practical skills',
            icon: '⚙️',
            category: 'milestone',
            requirements: 'Complete milestone m2',
            points: 150
          }
        ],
        isCompleted: false
      },
      {
        id: 'm3',
        title: 'Professional Mastery',
        description: `Achieve professional-level competency and prepare for career opportunities`,
        category: 'mastery',
        skillArea: 'Professional Skills',
        estimatedHours: 80,
        estimatedDays: 28,
        difficulty: 'hard',
        prerequisites: ['m1', 'm2'],
        completionCriteria: [
          'Complete capstone project',
          'Pass professional assessment',
          'Prepare for job market'
        ],
        resources: [
          {
            title: 'Professional Certification Prep',
            type: 'certification',
            url: '',
            description: 'Prepare for industry certification',
            estimatedTime: '40 hours',
            difficulty: 'advanced'
          },
          {
            title: 'Capstone Project',
            type: 'project',
            url: '',
            description: 'Comprehensive project demonstrating mastery',
            estimatedTime: '35 hours',
            difficulty: 'advanced'
          },
          {
            title: 'Career Preparation',
            type: 'tutorial',
            url: '',
            description: 'Resume building and interview preparation',
            estimatedTime: '5 hours',
            difficulty: 'intermediate'
          }
        ],
        badges: [
          {
            id: 'b3',
            name: 'Professional Master',
            description: 'Achieved professional mastery',
            icon: '🎓',
            category: 'milestone',
            requirements: 'Complete milestone m3',
            points: 200
          }
        ],
        isCompleted: false
      }
    ],
    allBadges: [],
    skillProgression: [
      {
        skillName: content.skills[0],
        currentLevel: 2,
        targetLevel: 8,
        progressPercentage: 25,
        relatedMilestones: ['m1', 'm2', 'm3'],
        importanceScore: 95
      },
      {
        skillName: content.skills[1],
        currentLevel: 1,
        targetLevel: 7,
        progressPercentage: 15,
        relatedMilestones: ['m2', 'm3'],
        importanceScore: 85
      },
      {
        skillName: content.skills[2],
        currentLevel: 1,
        targetLevel: 6,
        progressPercentage: 17,
        relatedMilestones: ['m3'],
        importanceScore: 75
      }
    ],
    motivationalQuotes: [
      'Every expert was once a beginner!',
      'The journey of improvement never ends.'
    ],
    dailyGoals: [
      {
        id: 'd1',
        title: 'Daily Learning',
        description: 'Spend 30 minutes learning',
        estimatedMinutes: 30,
        category: 'learning',
        relatedMilestone: 'm1',
        priority: 'high'
      }
    ],
    weeklyGoals: [
      {
        id: 'w1',
        title: 'Weekly Progress',
        description: 'Make steady progress',
        milestones: ['m1'],
        estimatedHours: 10,
        targetCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ],
    personalizedTips: [
      'Focus on consistent practice',
      'Break complex topics into smaller parts',
      'Celebrate small victories'
    ],
    careerProjections: [
      {
        jobTitle: `${domain.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Specialist`,
        industry: 'Technology',
        averageSalary: '$60,000 - $110,000',
        requiredSkills: content.skills,
        timeToAchieve: skillLevel === 'beginner' ? '18-24 months' : skillLevel === 'intermediate' ? '12-18 months' : '6-12 months',
        probability: skillLevel === 'beginner' ? 75 : skillLevel === 'intermediate' ? 85 : 95,
        description: `Career opportunities in ${domain} are growing rapidly with strong demand for skilled professionals.`
      }
    ]
  };
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
  type: 'multiple-choice';
  options: string[];
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

// Enhanced domain analysis and career mapping
interface DomainAnalysis {
  domain: string;
  subDomains: string[];
  coreSkills: string[];
  softSkills: string[];
  industryTrends: string[];
  careerLevels: CareerLevel[];
  salaryRanges: SalaryRange[];
  jobMarketDemand: 'high' | 'medium' | 'low';
  averageTimeToExpertise: string;
}

interface CareerLevel {
  level: string;
  title: string;
  experience: string;
  requiredSkills: string[];
  responsibilities: string[];
  nextLevelRequirements: string[];
}

interface SalaryRange {
  level: string;
  range: string;
  currency: string;
  region: string;
}

interface SkillGapAnalysis {
  missingSkills: string[];
  weakSkills: string[];
  strongSkills: string[];
  prioritySkills: string[];
  learningPath: SkillLearningPath[];
  estimatedTimeToFill: string;
  recommendedOrder: string[];
}

interface SkillLearningPath {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  estimatedHours: number;
  prerequisites: string[];
  learningMethods: string[];
  resources: LearningResource[];
}

// Enhanced user profile analysis
interface EnhancedUserProfile extends UserProfile {
  resumeText?: string;
  detectedSkills?: string[];
  experienceAnalysis?: ExperienceAnalysis;
  careerGoalsAnalysis?: CareerGoalsAnalysis;
  learningPreferences?: LearningPreferences;
}

interface ExperienceAnalysis {
  totalYears: number;
  relevantExperience: number;
  industries: string[];
  roles: string[];
  technologies: string[];
  achievements: string[];
  careerProgression: string;
}

interface CareerGoalsAnalysis {
  shortTermGoals: string[];
  longTermGoals: string[];
  targetRole: string;
  targetIndustry: string;
  timeframe: string;
  motivations: string[];
}

interface LearningPreferences {
  preferredMethods: string[];
  timeAvailability: string;
  budget: string;
  difficulty: 'gradual' | 'intensive' | 'balanced';
}

// Performance tracking interface
interface PerformanceData {
  completionTime: string;
  qualityScore: number;
  difficultyRating: number;
  learningPreferences: string[];
  strugglingAreas?: string[];
  excellingAreas?: string[];
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
    numberOfQuestions: number = 5
  ): Promise<AssessmentQuestion[]> {
    const prompt = `
You are an expert career assessment designer. Generate ${numberOfQuestions} personalized assessment questions for a user with the following profile:

Domain: ${userProfile.selectedDomain}
Skill Level: ${userProfile.skillLevel}
Education: ${userProfile.educationLevel}
Experience: ${userProfile.experience}
Interests: ${userProfile.interests.join(', ')}
Goals: ${userProfile.goals.join(', ')}

Create ONLY multiple choice questions with the following specifications:
- All questions must be multiple choice type with exactly 4 options each
- No rating/scale questions or open-ended questions
- Each question should have one clearly correct answer
- Include distractors that are plausible but incorrect

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

  // 1. Enhanced User Input Analysis
  async analyzeUserProfile(userProfile: UserProfile, resumeText?: string): Promise<EnhancedUserProfile> {
    const prompt = `
Analyze this user profile and provide comprehensive insights:

User Profile:
- Domain: ${userProfile.selectedDomain}
- Skill Level: ${userProfile.skillLevel}
- Education: ${userProfile.educationLevel}
- Experience: ${userProfile.experience}
- Goals: ${userProfile.goals.join(', ')}
- Interests: ${userProfile.interests.join(', ')}
${resumeText ? `- Resume: ${resumeText}` : ''}

Provide detailed analysis in JSON format:
{
  "detectedSkills": ["skill1", "skill2"],
  "experienceAnalysis": {
    "totalYears": 5,
    "relevantExperience": 3,
    "industries": ["tech", "finance"],
    "roles": ["developer", "analyst"],
    "technologies": ["python", "sql"],
    "achievements": ["led team", "increased efficiency"],
    "careerProgression": "steady upward trajectory"
  },
  "careerGoalsAnalysis": {
    "shortTermGoals": ["learn react", "get certification"],
    "longTermGoals": ["become senior developer", "lead team"],
    "targetRole": "Senior Software Engineer",
    "targetIndustry": "Technology",
    "timeframe": "2-3 years",
    "motivations": ["career growth", "higher salary"]
  },
  "learningPreferences": {
    "preferredMethods": ["hands-on projects", "online courses"],
    "timeAvailability": "10-15 hours per week",
    "budget": "moderate",
    "difficulty": "balanced"
  }
}`;

    try {
      const response = await this.callGemini(prompt);
      const analysis = cleanAndParseJSON(response);
      
      return {
        ...userProfile,
        resumeText,
        ...analysis
      };
    } catch (error) {
      console.error('Profile analysis failed, using basic analysis:', error);
      return {
        ...userProfile,
        resumeText,
        detectedSkills: [],
        experienceAnalysis: {
          totalYears: parseInt(userProfile.experience) || 0,
          relevantExperience: parseInt(userProfile.experience) || 0,
          industries: [],
          roles: [],
          technologies: [],
          achievements: [],
          careerProgression: 'steady'
        },
        careerGoalsAnalysis: {
          shortTermGoals: userProfile.goals,
          longTermGoals: ['Career advancement'],
          targetRole: 'Professional',
          targetIndustry: userProfile.selectedDomain,
          timeframe: '1-2 years',
          motivations: ['professional growth']
        },
        learningPreferences: {
          preferredMethods: ['online courses'],
          timeAvailability: '5-10 hours per week',
          budget: 'moderate',
          difficulty: 'balanced'
        }
      };
    }
  }

  async performSkillGapAnalysis(
    userProfile: EnhancedUserProfile, 
    targetDomain: string
  ): Promise<SkillGapAnalysis> {
    const prompt = `
Perform comprehensive skills gap analysis:

Current User Skills: ${userProfile.detectedSkills?.join(', ') || 'None detected'}
Target Domain: ${targetDomain}
Current Level: ${userProfile.skillLevel}
Experience: ${userProfile.experience}

Analyze skill gaps and provide learning roadmap in JSON:
{
  "missingSkills": ["skill1", "skill2"],
  "weakSkills": ["skill3", "skill4"],
  "strongSkills": ["skill5", "skill6"],
  "prioritySkills": ["critical_skill1", "critical_skill2"],
  "learningPath": [
    {
      "skill": "JavaScript",
      "currentLevel": 2,
      "targetLevel": 8,
      "estimatedHours": 120,
      "prerequisites": ["HTML", "CSS"],
      "learningMethods": ["courses", "projects", "practice"],
      "resources": []
    }
  ],
  "estimatedTimeToFill": "6-8 months",
  "recommendedOrder": ["skill1", "skill2", "skill3"]
}`;

    try {
      const response = await this.callGemini(prompt);
      return cleanAndParseJSON(response);
    } catch (error) {
      console.error('Skills gap analysis failed:', error);
      return this.getFallbackSkillGapAnalysis(targetDomain);
    }
  }

  private getFallbackSkillGapAnalysis(domain: string): SkillGapAnalysis {
    const domainSkills = {
      'software-development': ['JavaScript', 'React', 'Node.js', 'Databases', 'Git'],
      'data-science': ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'],
      'digital-marketing': ['SEO', 'Content Marketing', 'Analytics', 'Social Media', 'PPC']
    };

    const skills = domainSkills[domain as keyof typeof domainSkills] || ['Core Skills'];

    return {
      missingSkills: skills.slice(0, 3),
      weakSkills: skills.slice(3, 4),
      strongSkills: [],
      prioritySkills: skills.slice(0, 2),
      learningPath: skills.map((skill, index) => ({
        skill,
        currentLevel: 1,
        targetLevel: 7,
        estimatedHours: 40 + (index * 20),
        prerequisites: index > 0 ? [skills[index - 1]] : [],
        learningMethods: ['courses', 'practice', 'projects'],
        resources: []
      })),
      estimatedTimeToFill: '4-6 months',
      recommendedOrder: skills
    };
  }

  // 2. Enhanced Gamified Roadmap Generation
  async generateGamifiedRoadmap(
    userProfile: UserProfile,
    assessmentResult: AssessmentResult
  ): Promise<GamifiedRoadmap> {
    // First, analyze the user comprehensively
    const enhancedProfile = await this.analyzeUserProfile(userProfile);
    const skillGaps = await this.performSkillGapAnalysis(enhancedProfile, userProfile.selectedDomain);
    
    const prompt = `
Create an intelligent, personalized career roadmap based on comprehensive user analysis.

User Analysis:
- Domain: ${userProfile.selectedDomain}
- Current Level: ${userProfile.skillLevel}
- Experience: ${userProfile.experience}
- Assessment Score: ${assessmentResult.percentage}%
- Strong Skills: ${enhancedProfile.detectedSkills?.join(', ') || 'None detected'}
- Missing Skills: ${skillGaps.missingSkills.join(', ')}
- Priority Skills: ${skillGaps.prioritySkills.join(', ')}
- Learning Preferences: ${enhancedProfile.learningPreferences?.preferredMethods.join(', ') || 'online courses'}
- Time Availability: ${enhancedProfile.learningPreferences?.timeAvailability || '5-10 hours/week'}
- Target Role: ${enhancedProfile.careerGoalsAnalysis?.targetRole || 'Senior Professional'}

Create a dynamic, gamified roadmap with adaptive difficulty and personalized content:

{
  "domain": "${userProfile.selectedDomain}",
  "currentLevel": "${userProfile.skillLevel}",
  "targetLevel": "expert",
  "totalEstimatedHours": 240,
  "totalEstimatedWeeks": 24,
  "difficultyLevel": "${userProfile.skillLevel}",
  "personalizedInsights": {
    "strengthsAnalysis": "Based on assessment, you excel in ${assessmentResult.strengthAreas.join(', ')}",
    "improvementAreas": "Focus needed on ${assessmentResult.improvementAreas.join(', ')}",
    "learningStyle": "Recommended approach: ${enhancedProfile.learningPreferences?.difficulty || 'balanced'} progression",
    "careerTrajectory": "Path to ${enhancedProfile.careerGoalsAnalysis?.targetRole || 'senior role'} in ${enhancedProfile.careerGoalsAnalysis?.timeframe || '2-3 years'}"
  },
  "milestones": [
    {
      "id": "m1",
      "title": "Foundation Mastery",
      "description": "Build rock-solid fundamentals in ${userProfile.selectedDomain}",
      "category": "fundamentals",
      "skillArea": "Core Knowledge",
      "estimatedHours": 60,
      "estimatedDays": 21,
      "difficulty": "easy",
      "prerequisites": [],
      "completionCriteria": [
        "Complete foundational courses with 85%+ scores",
        "Build 2 basic projects",
        "Pass skills assessment"
      ],
      "resources": [
        {
          "title": "Comprehensive ${userProfile.selectedDomain} Fundamentals",
          "type": "course",
          "url": "https://www.coursera.org/specializations/${userProfile.selectedDomain.toLowerCase().replace(' ', '-')}",
          "description": "University-level fundamentals course",
          "estimatedTime": "30 hours",
          "difficulty": "beginner"
        },
        {
          "title": "Interactive Coding Practice",
          "type": "tutorial",
          "url": "https://www.codecademy.com/${userProfile.selectedDomain.toLowerCase().replace(' ', '-')}",
          "description": "Hands-on practice with immediate feedback",
          "estimatedTime": "20 hours",
          "difficulty": "beginner"
        },
        {
          "title": "First Project: ${userProfile.selectedDomain} Starter",
          "type": "project",
          "url": "https://github.com/topics/${userProfile.selectedDomain.toLowerCase().replace(' ', '-')}-beginner",
          "description": "Build your first real project",
          "estimatedTime": "10 hours",
          "difficulty": "beginner"
        }
      ],
      "badges": [
        {
          "id": "foundation-master",
          "name": "Foundation Master",
          "description": "Mastered the fundamentals",
          "icon": "�️",
          "category": "milestone",
          "requirements": "Complete all foundation resources with 85%+",
          "points": 150
        }
      ],
      "adaptiveContent": {
        "ifStruggling": "Additional practice resources and mentorship sessions",
        "ifExcelling": "Advanced challenges and early intermediate content",
        "personalizedTip": "Based on your ${enhancedProfile.learningPreferences?.preferredMethods[0] || 'learning style'}, focus on practical application"
      },
      "isCompleted": false
    },
    {
      "id": "m2",
      "title": "Skill Development Sprint",
      "description": "Rapidly develop intermediate skills and industry practices",
      "category": "development",
      "skillArea": "Practical Application",
      "estimatedHours": 80,
      "estimatedDays": 28,
      "difficulty": "medium",
      "prerequisites": ["m1"],
      "completionCriteria": [
        "Complete 3 intermediate projects",
        "Demonstrate industry best practices",
        "Receive peer code review approval"
      ],
      "resources": [
        {
          "title": "Advanced ${userProfile.selectedDomain} Patterns",
          "type": "course",
          "url": "https://www.udemy.com/courses/search/?q=advanced+${userProfile.selectedDomain.toLowerCase().replace(' ', '+')}",
          "description": "Industry-standard patterns and practices",
          "estimatedTime": "35 hours",
          "difficulty": "intermediate"
        },
        {
          "title": "Real-World Project Portfolio",
          "type": "project",
          "url": "https://www.frontendmentor.io/challenges",
          "description": "Build portfolio-worthy projects",
          "estimatedTime": "40 hours",
          "difficulty": "intermediate"
        },
        {
          "title": "Industry Best Practices Guide",
          "type": "book",
          "url": "https://www.oreilly.com/search/?q=${userProfile.selectedDomain.replace(' ', '+')}&type=book",
          "description": "Learn professional development practices",
          "estimatedTime": "5 hours",
          "difficulty": "intermediate"
        }
      ],
      "badges": [
        {
          "id": "skill-builder",
          "name": "Skill Builder",
          "description": "Developed practical expertise",
          "icon": "⚡",
          "category": "milestone",
          "requirements": "Complete skill development with portfolio projects",
          "points": 200
        }
      ],
      "adaptiveContent": {
        "ifStruggling": "Pair programming sessions and additional mentorship",
        "ifExcelling": "Leadership opportunities and advanced architecture challenges",
        "personalizedTip": "Leverage your strength in ${assessmentResult.strengthAreas[0] || 'problem-solving'} for complex projects"
      },
      "isCompleted": false
    },
    {
      "id": "m3",
      "title": "Expertise & Leadership",
      "description": "Achieve expert-level skills and leadership capabilities",
      "category": "mastery",
      "skillArea": "Expert Knowledge & Leadership",
      "estimatedHours": 100,
      "estimatedDays": 35,
      "difficulty": "hard",
      "prerequisites": ["m1", "m2"],
      "completionCriteria": [
        "Lead a complex project",
        "Mentor junior developers",
        "Contribute to open source",
        "Pass expert-level certification"
      ],
      "resources": [
        {
          "title": "Expert-Level ${userProfile.selectedDomain} Architecture",
          "type": "course",
          "url": "https://www.pluralsight.com/search?q=${userProfile.selectedDomain.replace(' ', '%20')}%20architecture",
          "description": "Master system design and architecture",
          "estimatedTime": "40 hours",
          "difficulty": "advanced"
        },
        {
          "title": "Open Source Contribution Project",
          "type": "project",
          "url": "https://github.com/topics/${userProfile.selectedDomain.toLowerCase().replace(' ', '-')}",
          "description": "Contribute to major open source projects",
          "estimatedTime": "50 hours",
          "difficulty": "advanced"
        },
        {
          "title": "Industry Certification",
          "type": "certification",
          "url": "https://www.credly.com/search#badges?q=${userProfile.selectedDomain.replace(' ', '%20')}",
          "description": "Earn recognized industry certification",
          "estimatedTime": "10 hours",
          "difficulty": "advanced"
        }
      ],
      "badges": [
        {
          "id": "expert-leader",
          "name": "Expert Leader",
          "description": "Achieved expert-level mastery and leadership",
          "icon": "🏆",
          "category": "milestone",
          "requirements": "Complete all expert-level challenges and certifications",
          "points": 300
        }
      ],
      "adaptiveContent": {
        "ifStruggling": "Extended mentorship and gradual complexity increase",
        "ifExcelling": "Industry speaking opportunities and consulting projects",
        "personalizedTip": "Your experience in ${enhancedProfile.experienceAnalysis?.industries.join(', ') || 'technology'} gives you unique insights"
      },
      "isCompleted": false
    }
  ],
  "allBadges": [
    {
      "id": "fast-learner",
      "name": "Fast Learner",
      "description": "Completed milestones ahead of schedule",
      "icon": "🚀",
      "category": "achievement",
      "requirements": "Complete any milestone 25% faster than estimated",
      "points": 100
    },
    {
      "id": "community-contributor",
      "name": "Community Contributor",
      "description": "Active in developer community",
      "icon": "🤝",
      "category": "achievement",
      "requirements": "Help others in forums or contribute to open source",
      "points": 150
    },
    {
      "id": "perfectionist",
      "name": "Perfectionist",
      "description": "Achieved 95%+ scores consistently",
      "icon": "💎",
      "category": "achievement",
      "requirements": "Maintain 95%+ average across all assessments",
      "points": 200
    }
  ],
  "skillProgression": [
    {
      "skillName": "${skillGaps.prioritySkills[0] || 'Core Skills'}",
      "currentLevel": 2,
      "targetLevel": 9,
      "progressPercentage": 22,
      "relatedMilestones": ["m1", "m2", "m3"],
      "importanceScore": 95,
      "personalizedPath": "Focus on practical application given your ${enhancedProfile.learningPreferences?.preferredMethods[0] || 'hands-on'} learning style"
    },
    {
      "skillName": "${skillGaps.prioritySkills[1] || 'Problem Solving'}",
      "currentLevel": 3,
      "targetLevel": 8,
      "progressPercentage": 37,
      "relatedMilestones": ["m2", "m3"],
      "importanceScore": 90,
      "personalizedPath": "Build on your assessment strength in ${assessmentResult.strengthAreas[0] || 'analytical thinking'}"
    }
  ],
  "motivationalQuotes": [
    "Your ${assessmentResult.percentage}% assessment score shows great potential!",
    "Every expert was once a beginner. You're on the right path.",
    "Focus on progress, not perfection. You've got this!"
  ],
  "dailyGoals": [
    {
      "id": "d1",
      "title": "Skill Practice Session",
      "description": "Practice ${skillGaps.prioritySkills[0] || 'core skills'} for 30 minutes",
      "estimatedMinutes": 30,
      "category": "learning",
      "relatedMilestone": "m1",
      "priority": "high",
      "personalizedNote": "Best practiced during your most productive hours"
    },
    {
      "id": "d2",
      "title": "Project Work",
      "description": "Work on current project milestone",
      "estimatedMinutes": 45,
      "category": "project",
      "relatedMilestone": "m2",
      "priority": "medium",
      "personalizedNote": "Break into smaller tasks if needed"
    }
  ],
  "weeklyGoals": [
    {
      "id": "w1",
      "title": "Milestone Progress",
      "description": "Complete key learning objectives for current milestone",
      "milestones": ["m1"],
      "estimatedHours": ${enhancedProfile.learningPreferences?.timeAvailability?.includes('10-15') ? '12' : '8'},
      "targetCompletionDate": "2025-10-01",
      "adaptiveTarget": "Adjusted based on your ${enhancedProfile.learningPreferences?.timeAvailability || 'available time'}"
    }
  ],
  "personalizedTips": [
    "Based on your ${userProfile.skillLevel} level, focus on building strong fundamentals first",
    "Your strength in ${assessmentResult.strengthAreas[0] || 'problem-solving'} will help with complex projects",
    "Consider ${enhancedProfile.learningPreferences?.preferredMethods[0] || 'hands-on practice'} for faster retention",
    "Set aside ${enhancedProfile.learningPreferences?.timeAvailability || '5-10 hours per week'} for consistent progress"
  ],
  "careerProjections": [
    {
      "jobTitle": "${enhancedProfile.careerGoalsAnalysis?.targetRole || 'Senior Professional'}",
      "industry": "${enhancedProfile.careerGoalsAnalysis?.targetIndustry || 'Technology'}",
      "averageSalary": "$75,000 - $120,000",
      "requiredSkills": ${JSON.stringify(skillGaps.prioritySkills.slice(0, 3))},
      "timeToAchieve": "${enhancedProfile.careerGoalsAnalysis?.timeframe || '18-24 months'}",
      "probability": ${assessmentResult.percentage > 70 ? 85 : assessmentResult.percentage > 50 ? 75 : 65},
      "description": "Strong career prospects based on your ${assessmentResult.percentage}% assessment score and learning plan",
      "nextSteps": [
        "Complete foundation milestone within 3 months",
        "Build portfolio with 3+ projects",
        "Network with industry professionals"
      ]
    }
  ]
}

Return ONLY the JSON above. No additional text.`;

    try {
      console.log('Generating simple roadmap...');
      
      const response = await this.callGemini(prompt);
      const roadmap = cleanAndParseJSON(response);
      
      if (roadmap && roadmap.milestones && Array.isArray(roadmap.milestones)) {
        console.log('Successfully generated roadmap');
        return roadmap;
      } else {
        throw new Error('Invalid roadmap structure received');
      }
    } catch (error) {
      console.log('Simple roadmap generation failed, using fallback structure');
      
      // Use the dedicated fallback function
      return createBasicFallbackRoadmap(userProfile);
    }
  }

  // 3. Intelligent Resource Recommendation Engine
  async generatePersonalizedResources(
    userProfile: EnhancedUserProfile,
    skillGaps: SkillGapAnalysis,
    currentMilestone: string
  ): Promise<LearningResource[]> {
    const prompt = `
Generate intelligent, personalized learning resources based on comprehensive user analysis.

User Context:
- Domain: ${userProfile.selectedDomain}
- Skill Level: ${userProfile.skillLevel}
- Learning Style: ${userProfile.learningPreferences?.preferredMethods.join(', ') || 'mixed'}
- Time Availability: ${userProfile.learningPreferences?.timeAvailability || '5-10 hours/week'}
- Budget: ${userProfile.learningPreferences?.budget || 'moderate'}
- Current Milestone: ${currentMilestone}

Skills Analysis:
- Missing Skills: ${skillGaps.missingSkills.join(', ')}
- Priority Skills: ${skillGaps.prioritySkills.join(', ')}
- Strong Skills: ${skillGaps.strongSkills.join(', ')}

Create personalized resource recommendations with real URLs:

[
  {
    "id": "resource-1",
    "title": "Interactive ${skillGaps.prioritySkills[0] || 'Programming'} Course",
    "description": "Comprehensive course tailored to your ${userProfile.skillLevel} level",
    "type": "course",
    "provider": "Coursera",
    "url": "https://www.coursera.org/search?query=${skillGaps.prioritySkills[0]?.replace(' ', '%20') || 'programming'}&index=prod_all_launched_products_term_optimization",
    "duration": "6-8 weeks",
    "difficulty": "${userProfile.skillLevel}",
    "skills": ${JSON.stringify(skillGaps.prioritySkills.slice(0, 3))},
    "rating": 4.6,
    "price": "${userProfile.learningPreferences?.budget === 'free' ? 'free' : 'paid'}",
    "relevanceScore": 95,
    "category": "core-skills",
    "personalizedReason": "Matches your ${userProfile.learningPreferences?.preferredMethods[0] || 'hands-on'} learning style"
  },
  {
    "id": "resource-2", 
    "title": "Hands-on ${userProfile.selectedDomain} Projects",
    "description": "Build real-world projects to reinforce learning",
    "type": "project",
    "provider": "GitHub",
    "url": "https://github.com/topics/${userProfile.selectedDomain.toLowerCase().replace(' ', '-')}-projects",
    "duration": "2-4 weeks per project",
    "difficulty": "${userProfile.skillLevel}",
    "skills": ${JSON.stringify(skillGaps.prioritySkills.slice(0, 2))},
    "rating": 4.4,
    "price": "free",
    "relevanceScore": 90,
    "category": "practical-application",
    "personalizedReason": "Perfect for your goal of ${userProfile.careerGoalsAnalysis?.shortTermGoals[0] || 'skill building'}"
  },
  {
    "id": "resource-3",
    "title": "${skillGaps.prioritySkills[1] || 'Advanced Concepts'} Masterclass",
    "description": "Deep dive into advanced concepts and best practices",
    "type": "tutorial",
    "provider": "YouTube/Udemy",
    "url": "https://www.udemy.com/courses/search/?q=${skillGaps.prioritySkills[1]?.replace(' ', '+') || 'advanced+concepts'}&src=ukw",
    "duration": "3-5 hours",
    "difficulty": "intermediate",
    "skills": ${JSON.stringify([skillGaps.prioritySkills[1] || 'Advanced Skills'])},
    "rating": 4.3,
    "price": "${userProfile.learningPreferences?.budget === 'free' ? 'free' : 'freemium'}",
    "relevanceScore": 85,
    "category": "advanced-concepts",
    "personalizedReason": "Builds on your existing strength in ${skillGaps.strongSkills[0] || 'problem solving'}"
  }
]

Return ONLY the JSON array above.`;

    try {
      const response = await this.callGemini(prompt);
      return cleanAndParseJSON(response) || this.getFallbackResourceRecommendations(userProfile.selectedDomain);
    } catch (error) {
      console.error('Resource recommendation failed:', error);
      return this.getFallbackResourceRecommendations(userProfile.selectedDomain);
    }
  }

  private getFallbackResourceRecommendations(domain: string): LearningResource[] {
    const baseResources = {
      'software-development': [
        {
          id: 'sw-course-1',
          title: 'Complete Web Development Bootcamp',
          description: 'Comprehensive full-stack development course',
          type: 'course' as const,
          provider: 'Udemy',
          url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
          duration: '65 hours',
          difficulty: 'beginner' as const,
          skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
          rating: 4.7,
          price: 'paid' as const,
          relevanceScore: 95,
          category: 'full-stack'
        },
        {
          id: 'sw-project-1',
          title: 'Build 30 JavaScript Projects',
          description: 'Hands-on projects to build your portfolio',
          type: 'project' as const,
          provider: 'GitHub',
          url: 'https://github.com/bradtraversy/vanillawebprojects',
          duration: '3-6 months',
          difficulty: 'intermediate' as const,
          skills: ['JavaScript', 'DOM Manipulation', 'APIs'],
          rating: 4.5,
          price: 'free' as const,
          relevanceScore: 90,
          category: 'practical'
        }
      ],
      'data-science': [
        {
          id: 'ds-course-1',
          title: 'Python for Data Science and Machine Learning',
          description: 'Complete data science course with Python',
          type: 'course' as const,
          provider: 'Coursera',
          url: 'https://www.coursera.org/learn/python-for-applied-data-science-ai',
          duration: '6 weeks',
          difficulty: 'beginner' as const,
          skills: ['Python', 'Pandas', 'NumPy', 'Machine Learning'],
          rating: 4.6,
          price: 'freemium' as const,
          relevanceScore: 95,
          category: 'fundamentals'
        }
      ]
    };

    return baseResources[domain as keyof typeof baseResources] || [
      {
        id: 'general-1',
        title: `${domain} Fundamentals`,
        description: 'Comprehensive introduction course',
        type: 'course',
        provider: 'FreeCodeCamp',
        url: 'https://www.freecodecamp.org/',
        duration: '4-6 weeks',
        difficulty: 'beginner',
        skills: ['Fundamentals'],
        rating: 4.5,
        price: 'free',
        relevanceScore: 85,
        category: 'basics'
      }
    ];
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

  // 5. Enhanced Resume Analysis and Skills Extraction
  async analyzeResume(resumeText: string, targetDomain?: string): Promise<ResumeAnalysis> {
    const prompt = `
Perform comprehensive resume analysis for career development:

Resume Content:
${resumeText}

${targetDomain ? `Target Domain: ${targetDomain}` : ''}

Provide detailed analysis in JSON format:
{
  "overallScore": 78,
  "skillsDetected": ["JavaScript", "Python", "SQL", "Project Management"],
  "experienceLevel": "intermediate",
  "strengthAreas": ["Technical skills", "Problem solving", "Team collaboration"],
  "improvementAreas": ["Domain expertise", "Certifications", "Leadership experience"],
  "missingKeywords": ["React", "AWS", "Agile", "Machine Learning"],
  "recommendations": [
    "Add specific technology projects to portfolio",
    "Obtain industry-relevant certifications",
    "Highlight quantifiable achievements",
    "Include remote work and collaboration tools experience"
  ],
  "skillGaps": [
    {
      "skill": "React Development",
      "currentLevel": 2,
      "requiredLevel": 7,
      "priority": "high",
      "learningPath": ["Learn JSX syntax", "Component architecture", "State management", "Testing"]
    },
    {
      "skill": "Cloud Technologies",
      "currentLevel": 1,
      "requiredLevel": 6,
      "priority": "medium",
      "learningPath": ["AWS basics", "Docker containers", "CI/CD pipelines"]
    }
  ],
  "careerSuggestions": [
    "Junior Full-Stack Developer",
    "Frontend Developer",
    "Software Engineer I"
  ],
  "atsScore": 72,
  "marketabilityInsights": {
    "competitiveAdvantages": ["Multi-language programming", "Cross-functional experience"],
    "marketDemand": "high",
    "salaryRange": "$60,000 - $85,000",
    "geographicOpportunities": ["Remote", "Tech hubs", "Growing markets"]
  },
  "nextSteps": [
    "Build 2-3 portfolio projects showcasing ${targetDomain || 'target'} skills",
    "Network with professionals in ${targetDomain || 'desired'} field",
    "Apply to entry-level positions while continuing skill development"
  ]
}

Focus on actionable insights and specific improvement recommendations.`;

    try {
      const response = await this.callGemini(prompt);
      return cleanAndParseJSON(response) || this.getFallbackResumeAnalysis(targetDomain || 'general');
    } catch (error) {
      console.error('Resume analysis failed:', error);
      return this.getFallbackResumeAnalysis(targetDomain || 'general');
    }
  }

  private getFallbackResumeAnalysis(domain: string): ResumeAnalysis {
    return {
      overallScore: 60,
      skillsDetected: ['Basic skills detected'],
      experienceLevel: 'beginner',
      strengthAreas: ['Motivation', 'Learning potential'],
      improvementAreas: ['Domain-specific skills', 'Professional experience'],
      missingKeywords: ['Framework knowledge', 'Industry tools'],
      recommendations: [
        `Learn ${domain} fundamentals`,
        'Build a portfolio of projects',
        'Network with professionals in the field'
      ],
      skillGaps: [
        {
          skill: 'Core Skills',
          currentLevel: 1,
          requiredLevel: 6,
          priority: 'high',
          learningPath: ['Fundamentals', 'Practice', 'Projects']
        }
      ],
      careerSuggestions: [`Entry-level ${domain} role`],
      atsScore: 50
    };
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

  // 4. Progress Tracking and Adaptive System
  async updateRoadmapProgress(
    roadmap: GamifiedRoadmap,
    completedMilestone: string,
    performanceData: PerformanceData
  ): Promise<GamifiedRoadmap> {
    const prompt = `
Adapt and update the career roadmap based on user performance and completion.

Current Roadmap Domain: ${roadmap.domain}
Completed Milestone: ${completedMilestone}
Performance Data:
- Completion Time: ${performanceData.completionTime}
- Quality Score: ${performanceData.qualityScore}%
- Difficulty Rating: ${performanceData.difficultyRating}
- Learning Preferences: ${performanceData.learningPreferences.join(', ')}

Provide roadmap adaptations based on performance:
1. Adjust difficulty for upcoming milestones
2. Add resources if struggling or acceleration if excelling
3. Update timelines and goals
4. Provide personalized feedback

Return adaptation recommendations in JSON.`;

    try {
      const response = await this.callGemini(prompt);
      const adaptations = cleanAndParseJSON(response);
      
      if (adaptations) {
        return this.enhanceRoadmapWithAdaptiveFeatures(roadmap, performanceData);
      }
      
      return this.adaptRoadmapBasedOnPerformance(roadmap, performanceData);
    } catch (error) {
      console.error('Roadmap adaptation failed:', error);
      return this.adaptRoadmapBasedOnPerformance(roadmap, performanceData);
    }
  }

  private enhanceRoadmapWithAdaptiveFeatures(
    roadmap: GamifiedRoadmap, 
    performance: PerformanceData
  ): GamifiedRoadmap {
    // Adjust milestone difficulty based on performance
    const adjustedMilestones = roadmap.milestones.map(milestone => {
      if (!milestone.isCompleted) {
        if (performance.qualityScore > 85) {
          // User is excelling - add advanced challenges
          milestone.resources.push({
            title: 'Advanced Challenge',
            type: 'project',
            url: '',
            description: 'Additional challenge for high performers',
            estimatedTime: '5 hours',
            difficulty: 'advanced'
          });
        } else if (performance.qualityScore < 60) {
          // User struggling - add support resources
          milestone.resources.unshift({
            title: 'Foundation Review',
            type: 'tutorial',
            url: '',
            description: 'Review session for core concepts',
            estimatedTime: '3 hours',
            difficulty: 'beginner'
          });
        }
      }
      return milestone;
    });

    return {
      ...roadmap,
      milestones: adjustedMilestones,
      personalizedTips: [
        ...roadmap.personalizedTips,
        `Based on your ${performance.qualityScore}% performance, ${this.getPerformanceTip(performance)}`
      ]
    };
  }

  private adaptRoadmapBasedOnPerformance(
    roadmap: GamifiedRoadmap, 
    performance: PerformanceData
  ): GamifiedRoadmap {
    const adaptationMessage = performance.qualityScore > 80 
      ? "Excellent progress! Unlocking advanced challenges."
      : performance.qualityScore > 60 
      ? "Good progress! Continuing with current pace."
      : "Additional support resources added to help you succeed.";

    return {
      ...roadmap,
      personalizedTips: [
        ...roadmap.personalizedTips,
        adaptationMessage
      ]
    };
  }

  private getPerformanceTip(performance: PerformanceData): string {
    if (performance.qualityScore > 85) {
      return "you're ready for advanced challenges and leadership opportunities.";
    } else if (performance.qualityScore > 70) {
      return "you're making solid progress. Keep up the consistent effort!";
    } else if (performance.qualityScore > 50) {
      return "consider additional practice and review sessions to strengthen understanding.";
    } else {
      return "let's focus on fundamentals with extra support and slower pacing.";
    }
  }

  // Fallback methods for error handling
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

// Export the enhanced service
export default GeminiAIService;

export const geminiService = new GeminiAIService();