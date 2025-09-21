import { SkillGapAnalysis, PersonalizedRecommendation, LearningResource, CareerRoadmap } from '@/types/gamification';

export interface ResumeSkillExtraction {
  skills: Array<{
    name: string;
    category: 'technical' | 'soft' | 'tool' | 'framework' | 'language' | 'other';
    confidence: number; // 0-100 based on context and frequency
    context: string[]; // Where the skill was mentioned
    yearsOfExperience?: number;
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
  experience: {
    totalYears: number;
    roles: Array<{
      title: string;
      company: string;
      duration: string;
      skills: string[];
    }>;
  };
  education: Array<{
    degree: string;
    field: string;
    institution: string;
    skills: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    skills: string[];
    impact?: string;
  }>;
}

export interface DomainSkillRequirements {
  domain: string;
  coreSkills: Array<{
    name: string;
    importance: 'nice-to-have' | 'important' | 'critical';
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: 'technical' | 'soft' | 'tool' | 'framework' | 'language';
    description: string;
    relatedSkills: string[];
  }>;
  emergingSkills: Array<{
    name: string;
    trend: 'growing' | 'declining' | 'stable';
    importance: 'nice-to-have' | 'important' | 'critical';
    timeToLearn: string;
  }>;
  careerLevels: {
    entry: string[];
    mid: string[];
    senior: string[];
    lead: string[];
  };
}

export class SkillsAnalysisService {
  private static readonly SKILL_PATTERNS = {
    programming: [
      'javascript', 'python', 'java', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
      'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql', 'html', 'css', 'sass', 'less'
    ],
    frameworks: [
      'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
      'rails', 'asp.net', 'next.js', 'nuxt.js', 'svelte', 'gatsby', 'flutter', 'react native'
    ],
    tools: [
      'git', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github', 'jira', 'confluence',
      'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'mysql', 'postgresql',
      'mongodb', 'redis', 'elasticsearch', 'aws', 'azure', 'gcp', 'firebase'
    ],
    methodologies: [
      'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'tdd', 'bdd', 'microservices',
      'design thinking', 'user research', 'usability testing', 'a/b testing'
    ],
    soft_skills: [
      'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
      'creativity', 'adaptability', 'time management', 'project management', 'mentoring'
    ]
  };

  /**
   * Extract skills from resume text using AI and pattern matching
   */
  static async extractSkillsFromResume(resumeText: string): Promise<ResumeSkillExtraction> {
    // In a real implementation, this would use an AI service like OpenAI or Gemini
    // For now, we'll use pattern matching and keyword extraction
    
    const extractedSkills = this.extractSkillsUsingPatterns(resumeText);
    const experience = this.extractExperience(resumeText);
    const education = this.extractEducation(resumeText);
    const projects = this.extractProjects(resumeText);

    return {
      skills: extractedSkills,
      experience,
      education,
      projects
    };
  }

  /**
   * Analyze skill gaps for a specific domain
   */
  static analyzeSkillGaps(
    resumeSkills: ResumeSkillExtraction,
    domain: string,
    targetLevel: 'entry' | 'mid' | 'senior' | 'lead' = 'entry'
  ): SkillGapAnalysis {
    const domainRequirements = this.getDomainSkillRequirements(domain);
    const currentSkills = resumeSkills.skills.map(skill => ({
      name: skill.name,
      level: skill.level || this.inferSkillLevel(skill, resumeSkills.experience),
      confidence: skill.confidence,
      yearsOfExperience: skill.yearsOfExperience
    }));

    const requiredSkills = this.getRequiredSkillsForLevel(domainRequirements, targetLevel);
    const gaps = this.identifySkillGaps(currentSkills, requiredSkills);
    const strengths = this.identifyStrengths(currentSkills, requiredSkills);
    const overallReadiness = this.calculateReadiness(currentSkills, requiredSkills);

    return {
      currentSkills,
      requiredSkills,
      gaps,
      strengths,
      overallReadiness
    };
  }

  /**
   * Generate personalized recommendations based on skill gaps
   */
  static generatePersonalizedRecommendations(
    skillGaps: SkillGapAnalysis,
    domain: string,
    userPreferences: {
      learningStyle: 'visual' | 'hands-on' | 'reading' | 'mixed';
      timeAvailability: 'low' | 'medium' | 'high';
      budget: 'free' | 'budget' | 'premium';
      experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    }
  ): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];

    // High priority skill gaps
    const criticalGaps = skillGaps.gaps.filter(gap => gap.priority === 'critical');
    criticalGaps.forEach(gap => {
      recommendations.push({
        id: `skill-gap-${gap.skill.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'skill_gap',
        title: `Master ${gap.skill}`,
        description: `${gap.skill} is critical for your career path. Focus on reaching ${gap.requiredLevel} level.`,
        priority: 'critical',
        reasoning: `This skill is essential for ${domain} roles and you currently have a significant gap.`,
        actionable_steps: this.generateActionableSteps(gap, userPreferences),
        resources: this.getRecommendedResources(gap.skill, gap.requiredLevel, userPreferences),
        estimatedImpact: 'high',
        category: 'skill_development'
      });
    });

    // Next steps based on current progress
    const nextSteps = this.generateNextStepRecommendations(skillGaps, domain);
    recommendations.push(...nextSteps);

    // Learning path recommendations
    const learningPath = this.generateLearningPathRecommendations(skillGaps, userPreferences);
    recommendations.push(...learningPath);

    // Career advancement recommendations
    const careerAdvancement = this.generateCareerAdvancementRecommendations(skillGaps, domain);
    recommendations.push(...careerAdvancement);

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Get recommended learning resources based on skill and user preferences
   */
  static getRecommendedResources(
    skill: string,
    targetLevel: string,
    preferences: {
      learningStyle: 'visual' | 'hands-on' | 'reading' | 'mixed';
      timeAvailability: 'low' | 'medium' | 'high';
      budget: 'free' | 'budget' | 'premium';
    }
  ): LearningResource[] {
    const resources: LearningResource[] = [];

    // Base resources for different skills
    const skillResources = this.getSkillSpecificResources(skill, targetLevel);
    
    // Filter based on budget
    const budgetFiltered = skillResources.filter(resource => {
      if (preferences.budget === 'free') return !resource.isPremium;
      if (preferences.budget === 'budget') return !resource.isPremium || resource.provider === 'Udemy';
      return true; // Premium allows all
    });

    // Filter based on learning style
    const styleFiltered = budgetFiltered.filter(resource => {
      switch (preferences.learningStyle) {
        case 'visual':
          return resource.type === 'video' || resource.type === 'course';
        case 'hands-on':
          return resource.type === 'project' || resource.type === 'practice';
        case 'reading':
          return resource.type === 'article' || resource.type === 'book';
        default:
          return true;
      }
    });

    // Filter based on time availability
    const timeFiltered = styleFiltered.filter(resource => {
      const duration = this.parseDuration(resource.duration || '');
      switch (preferences.timeAvailability) {
        case 'low':
          return duration <= 10; // 10 hours or less
        case 'medium':
          return duration <= 30; // 30 hours or less
        default:
          return true;
      }
    });

    return timeFiltered.slice(0, 5); // Return top 5 recommendations
  }

  /**
   * Create adaptive learning plan based on user progress and preferences
   */
  static createAdaptiveLearningPlan(
    skillGaps: SkillGapAnalysis,
    userPreferences: {
      learningStyle: string;
      timeAvailability: string;
      goals: string[];
      deadline?: Date;
    }
  ): {
    weeklyPlan: Array<{
      week: number;
      focus: string;
      skills: string[];
      estimatedHours: number;
      resources: LearningResource[];
      milestones: string[];
    }>;
    totalDuration: string;
    successMetrics: string[];
  } {
    const criticalSkills = skillGaps.gaps
      .filter(gap => gap.priority === 'critical')
      .sort((a, b) => this.getSkillImportanceScore(a.skill) - this.getSkillImportanceScore(b.skill));

    const highPrioritySkills = skillGaps.gaps
      .filter(gap => gap.priority === 'high')
      .sort((a, b) => this.getSkillImportanceScore(a.skill) - this.getSkillImportanceScore(b.skill));

    const weeklyPlan = [];
    let currentWeek = 1;

    // Phase 1: Critical skills (first 4-6 weeks)
    criticalSkills.forEach((gap, index) => {
      const weeksForSkill = this.calculateWeeksNeeded(gap, userPreferences.timeAvailability);
      
      for (let week = 0; week < weeksForSkill; week++) {
        weeklyPlan.push({
          week: currentWeek++,
          focus: gap.skill,
          skills: [gap.skill],
          estimatedHours: this.getWeeklyHours(userPreferences.timeAvailability),
          resources: this.getRecommendedResources(gap.skill, gap.requiredLevel, userPreferences as any),
          milestones: this.getWeeklyMilestones(gap.skill, week, weeksForSkill)
        });
      }
    });

    // Phase 2: High priority skills
    highPrioritySkills.forEach(gap => {
      const weeksForSkill = this.calculateWeeksNeeded(gap, userPreferences.timeAvailability);
      
      for (let week = 0; week < weeksForSkill; week++) {
        weeklyPlan.push({
          week: currentWeek++,
          focus: gap.skill,
          skills: [gap.skill],
          estimatedHours: this.getWeeklyHours(userPreferences.timeAvailability),
          resources: this.getRecommendedResources(gap.skill, gap.requiredLevel, userPreferences as any),
          milestones: this.getWeeklyMilestones(gap.skill, week, weeksForSkill)
        });
      }
    });

    const totalWeeks = weeklyPlan.length;
    const totalDuration = `${totalWeeks} weeks (${Math.ceil(totalWeeks / 4)} months)`;

    const successMetrics = [
      'Complete all weekly milestones',
      'Achieve target skill levels',
      'Build portfolio projects',
      'Pass skill assessments',
      'Maintain consistent learning streak'
    ];

    return {
      weeklyPlan,
      totalDuration,
      successMetrics
    };
  }

  // Private helper methods
  private static extractSkillsUsingPatterns(text: string): ResumeSkillExtraction['skills'] {
    const skills: ResumeSkillExtraction['skills'] = [];
    const lowerText = text.toLowerCase();

    // Extract technical skills
    Object.entries(this.SKILL_PATTERNS).forEach(([category, patterns]) => {
      patterns.forEach(pattern => {
        const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
        const matches = text.match(regex);
        
        if (matches) {
          const confidence = Math.min(100, matches.length * 20 + 40);
          const context = this.extractContext(text, pattern);
          const yearsMatch = context.join(' ').match(/(\d+)\s*years?/i);
          const yearsOfExperience = yearsMatch ? parseInt(yearsMatch[1]) : undefined;

          skills.push({
            name: pattern,
            category: category as any,
            confidence,
            context,
            yearsOfExperience,
            level: this.inferLevelFromContext(context, yearsOfExperience)
          });
        }
      });
    });

    return skills;
  }

  private static extractContext(text: string, skill: string): string[] {
    const sentences = text.split(/[.!?]+/);
    return sentences
      .filter(sentence => sentence.toLowerCase().includes(skill.toLowerCase()))
      .map(sentence => sentence.trim())
      .slice(0, 3);
  }

  private static inferLevelFromContext(context: string[], years?: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const contextText = context.join(' ').toLowerCase();
    
    if (years) {
      if (years >= 5) return 'expert';
      if (years >= 3) return 'advanced';
      if (years >= 1) return 'intermediate';
    }

    if (contextText.includes('expert') || contextText.includes('senior') || contextText.includes('lead')) {
      return 'expert';
    }
    if (contextText.includes('advanced') || contextText.includes('architect')) {
      return 'advanced';
    }
    if (contextText.includes('intermediate') || contextText.includes('experience')) {
      return 'intermediate';
    }
    
    return 'beginner';
  }

  private static extractExperience(text: string): ResumeSkillExtraction['experience'] {
    // This would be more sophisticated in a real implementation
    const yearMatches = text.match(/(\d+)\s*years?\s*(of\s*)?experience/gi);
    const totalYears = yearMatches ? parseInt(yearMatches[0].match(/\d+/)?.[0] || '0') : 0;

    return {
      totalYears,
      roles: [] // Would extract job roles and durations
    };
  }

  private static extractEducation(text: string): ResumeSkillExtraction['education'] {
    // Would extract education details
    return [];
  }

  private static extractProjects(text: string): ResumeSkillExtraction['projects'] {
    // Would extract project details
    return [];
  }

  private static getDomainSkillRequirements(domain: string): DomainSkillRequirements {
    // This would come from a comprehensive skills database
    const requirements: { [key: string]: DomainSkillRequirements } = {
      'software-development': {
        domain: 'Software Development',
        coreSkills: [
          {
            name: 'JavaScript',
            importance: 'critical',
            level: 'intermediate',
            category: 'language',
            description: 'Essential for web development',
            relatedSkills: ['React', 'Node.js', 'TypeScript']
          },
          {
            name: 'Git',
            importance: 'critical',
            level: 'intermediate',
            category: 'tool',
            description: 'Version control is fundamental',
            relatedSkills: ['GitHub', 'GitLab']
          }
          // More skills would be defined here
        ],
        emergingSkills: [
          {
            name: 'AI/ML Integration',
            trend: 'growing',
            importance: 'important',
            timeToLearn: '3-6 months'
          }
        ],
        careerLevels: {
          entry: ['JavaScript', 'HTML', 'CSS', 'Git'],
          mid: ['React', 'Node.js', 'Database', 'Testing'],
          senior: ['System Design', 'Architecture', 'Mentoring'],
          lead: ['Team Management', 'Technical Strategy', 'Business Alignment']
        }
      }
    };

    return requirements[domain] || requirements['software-development'];
  }

  private static getRequiredSkillsForLevel(
    requirements: DomainSkillRequirements,
    level: 'entry' | 'mid' | 'senior' | 'lead'
  ) {
    const levelSkills = requirements.careerLevels[level] || [];
    return levelSkills.map(skillName => {
      const coreSkill = requirements.coreSkills.find(s => s.name === skillName);
      return {
        name: skillName,
        importance: coreSkill?.importance || 'important',
        level: coreSkill?.level || 'intermediate'
      };
    });
  }

  private static identifySkillGaps(currentSkills: any[], requiredSkills: any[]) {
    const gaps = [];

    requiredSkills.forEach(required => {
      const current = currentSkills.find(s => 
        s.name.toLowerCase() === required.name.toLowerCase()
      );

      if (!current) {
        gaps.push({
          skill: required.name,
          currentLevel: 'none',
          requiredLevel: required.level,
          priority: required.importance as 'low' | 'medium' | 'high' | 'critical',
          recommendations: []
        });
      } else {
        const levelGap = this.calculateLevelGap(current.level, required.level);
        if (levelGap > 0) {
          gaps.push({
            skill: required.name,
            currentLevel: current.level,
            requiredLevel: required.level,
            priority: required.importance as 'low' | 'medium' | 'high' | 'critical',
            recommendations: []
          });
        }
      }
    });

    return gaps;
  }

  private static identifyStrengths(currentSkills: any[], requiredSkills: any[]): string[] {
    const strengths = [];

    currentSkills.forEach(current => {
      const required = requiredSkills.find(r => 
        r.name.toLowerCase() === current.name.toLowerCase()
      );

      if (required && this.calculateLevelGap(current.level, required.level) <= 0) {
        strengths.push(current.name);
      }
    });

    return strengths;
  }

  private static calculateReadiness(currentSkills: any[], requiredSkills: any[]): number {
    if (requiredSkills.length === 0) return 100;

    let totalScore = 0;
    requiredSkills.forEach(required => {
      const current = currentSkills.find(s => 
        s.name.toLowerCase() === required.name.toLowerCase()
      );

      if (current) {
        const levelScore = this.getLevelScore(current.level);
        const requiredScore = this.getLevelScore(required.level);
        const skillReadiness = Math.min(100, (levelScore / requiredScore) * 100);
        totalScore += skillReadiness;
      }
    });

    return Math.round(totalScore / requiredSkills.length);
  }

  private static calculateLevelGap(currentLevel: string, requiredLevel: string): number {
    const levels = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 };
    return levels[requiredLevel as keyof typeof levels] - levels[currentLevel as keyof typeof levels];
  }

  private static getLevelScore(level: string): number {
    const scores = { 'beginner': 25, 'intermediate': 50, 'advanced': 75, 'expert': 100 };
    return scores[level as keyof typeof scores] || 0;
  }

  private static inferSkillLevel(skill: any, experience: any): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (skill.level) return skill.level;
    if (skill.yearsOfExperience >= 5) return 'expert';
    if (skill.yearsOfExperience >= 3) return 'advanced';
    if (skill.yearsOfExperience >= 1) return 'intermediate';
    return 'beginner';
  }

  private static generateActionableSteps(gap: any, preferences: any): string[] {
    return [
      `Start with fundamentals of ${gap.skill}`,
      `Complete beginner-friendly tutorials`,
      `Practice with hands-on projects`,
      `Join community forums and discussions`,
      `Build a portfolio project showcasing ${gap.skill}`
    ];
  }

  private static generateNextStepRecommendations(skillGaps: SkillGapAnalysis, domain: string): PersonalizedRecommendation[] {
    // Implementation for next step recommendations
    return [];
  }

  private static generateLearningPathRecommendations(skillGaps: SkillGapAnalysis, preferences: any): PersonalizedRecommendation[] {
    // Implementation for learning path recommendations
    return [];
  }

  private static generateCareerAdvancementRecommendations(skillGaps: SkillGapAnalysis, domain: string): PersonalizedRecommendation[] {
    // Implementation for career advancement recommendations
    return [];
  }

  private static getSkillSpecificResources(skill: string, level: string): LearningResource[] {
    // Return skill-specific learning resources
    return [];
  }

  private static parseDuration(duration: string): number {
    const matches = duration.match(/(\d+)/);
    return matches ? parseInt(matches[1]) : 0;
  }

  private static getSkillImportanceScore(skill: string): number {
    // Return importance score for skill ordering
    return 1;
  }

  private static calculateWeeksNeeded(gap: any, timeAvailability: string): number {
    const baseWeeks = { 'beginner': 2, 'intermediate': 3, 'advanced': 4, 'expert': 6 };
    const multiplier = { 'low': 2, 'medium': 1.5, 'high': 1 };
    
    return Math.ceil(baseWeeks[gap.requiredLevel as keyof typeof baseWeeks] * multiplier[timeAvailability as keyof typeof multiplier]);
  }

  private static getWeeklyHours(timeAvailability: string): number {
    const hours = { 'low': 5, 'medium': 10, 'high': 20 };
    return hours[timeAvailability as keyof typeof hours];
  }

  private static getWeeklyMilestones(skill: string, week: number, totalWeeks: number): string[] {
    // Return weekly milestones for skill learning
    return [`Week ${week + 1}: Learn ${skill} basics`];
  }
}