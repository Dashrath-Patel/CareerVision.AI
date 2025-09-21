import { LearningResource, UserProgress, PersonalizedRecommendation, CareerRoadmap } from '@/types/gamification';
import { SkillsAnalysisService } from './skills-analysis-service';

export interface ResourceProvider {
  id: string;
  name: string;
  type: 'platform' | 'university' | 'bootcamp' | 'youtube' | 'blog' | 'documentation';
  credibility: 'high' | 'medium' | 'low';
  averageRating: number;
  totalCourses: number;
  specialties: string[];
  pricingModel: 'free' | 'freemium' | 'subscription' | 'one-time' | 'mixed';
  certification: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  resources: LearningResource[];
  prerequisites: string[];
  learningOutcomes: string[];
  projects: ProjectResource[];
  assessments: AssessmentResource[];
}

export interface ProjectResource {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  skills: string[];
  technologies: string[];
  repository?: string;
  liveDemo?: string;
  instructions: string[];
  learningObjectives: string[];
  points: number;
}

export interface AssessmentResource {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'coding-challenge' | 'project-review' | 'peer-assessment';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit?: number; // in minutes
  questions: number;
  passingScore: number;
  skills: string[];
  points: number;
}

export class ResourceRecommendationService {
  private static readonly PROVIDERS: ResourceProvider[] = [
    {
      id: 'coursera',
      name: 'Coursera',
      type: 'platform',
      credibility: 'high',
      averageRating: 4.5,
      totalCourses: 5000,
      specialties: ['Data Science', 'Business', 'Computer Science', 'AI/ML'],
      pricingModel: 'subscription',
      certification: true
    },
    {
      id: 'udemy',
      name: 'Udemy',
      type: 'platform',
      credibility: 'medium',
      averageRating: 4.2,
      totalCourses: 15000,
      specialties: ['Programming', 'Design', 'Business', 'Personal Development'],
      pricingModel: 'one-time',
      certification: true
    },
    {
      id: 'freecodecamp',
      name: 'freeCodeCamp',
      type: 'platform',
      credibility: 'high',
      averageRating: 4.8,
      totalCourses: 50,
      specialties: ['Web Development', 'Programming', 'Data Science'],
      pricingModel: 'free',
      certification: true
    },
    {
      id: 'pluralsight',
      name: 'Pluralsight',
      type: 'platform',
      credibility: 'high',
      averageRating: 4.4,
      totalCourses: 7000,
      specialties: ['Technology', 'Software Development', 'IT Operations'],
      pricingModel: 'subscription',
      certification: true
    },
    {
      id: 'edx',
      name: 'edX',
      type: 'university',
      credibility: 'high',
      averageRating: 4.6,
      totalCourses: 3000,
      specialties: ['Computer Science', 'Engineering', 'Business', 'Data Science'],
      pricingModel: 'freemium',
      certification: true
    },
    {
      id: 'youtube',
      name: 'YouTube Educators',
      type: 'youtube',
      credibility: 'medium',
      averageRating: 4.0,
      totalCourses: 1000000,
      specialties: ['Everything'],
      pricingModel: 'free',
      certification: false
    }
  ];

  private static readonly RESOURCE_DATABASE: { [domain: string]: { [skill: string]: LearningResource[] } } = {
    'software-development': {
      'javascript': [
        {
          id: 'js-fundamentals-fcc',
          title: 'JavaScript Algorithms and Data Structures',
          description: 'Complete JavaScript course with algorithms and data structures',
          type: 'course',
          provider: 'freeCodeCamp',
          url: 'https://freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
          duration: '300 hours',
          difficulty: 'beginner',
          rating: 4.8,
          tags: ['javascript', 'algorithms', 'data-structures', 'programming'],
          isPremium: false,
          points: 300
        },
        {
          id: 'js-complete-udemy',
          title: 'The Complete JavaScript Course 2024',
          description: 'Master JavaScript with projects, challenges, and modern ES6+',
          type: 'course',
          provider: 'Udemy',
          url: 'https://udemy.com/course/the-complete-javascript-course/',
          duration: '69 hours',
          difficulty: 'intermediate',
          rating: 4.7,
          tags: ['javascript', 'es6', 'projects', 'modern-js'],
          isPremium: true,
          points: 350
        },
        {
          id: 'js-30-challenge',
          title: 'JavaScript30 - 30 Day Vanilla JS Challenge',
          description: 'Build 30 projects in 30 days with vanilla JavaScript',
          type: 'project',
          provider: 'Wes Bos',
          url: 'https://javascript30.com/',
          duration: '30 days',
          difficulty: 'intermediate',
          rating: 4.9,
          tags: ['javascript', 'projects', 'vanilla-js', 'hands-on'],
          isPremium: false,
          points: 300
        }
      ],
      'react': [
        {
          id: 'react-docs-official',
          title: 'React Official Documentation',
          description: 'Comprehensive guide to React from the official team',
          type: 'tutorial',
          provider: 'React Team',
          url: 'https://react.dev/learn',
          duration: '20 hours',
          difficulty: 'beginner',
          rating: 4.9,
          tags: ['react', 'official', 'documentation', 'components'],
          isPremium: false,
          points: 200
        },
        {
          id: 'react-complete-guide',
          title: 'React - The Complete Guide',
          description: 'Learn React, Hooks, Redux, React Router, Next.js',
          type: 'course',
          provider: 'Udemy',
          url: 'https://udemy.com/course/react-the-complete-guide-incl-redux/',
          duration: '48 hours',
          difficulty: 'intermediate',
          rating: 4.6,
          tags: ['react', 'hooks', 'redux', 'router', 'nextjs'],
          isPremium: true,
          points: 400
        }
      ],
      'python': [
        {
          id: 'python-crash-course',
          title: 'Python Crash Course - A Hands-On, Project-Based Introduction',
          description: 'Learn Python fundamentals through practical projects',
          type: 'book',
          provider: 'No Starch Press',
          url: 'https://nostarch.com/pythoncrashcourse2e',
          duration: '40 hours',
          difficulty: 'beginner',
          rating: 4.7,
          tags: ['python', 'beginner', 'projects', 'fundamentals'],
          isPremium: true,
          points: 250
        },
        {
          id: 'python-for-everybody',
          title: 'Python for Everybody Specialization',
          description: 'Learn to program and analyze data with Python',
          type: 'course',
          provider: 'Coursera',
          url: 'https://coursera.org/specializations/python',
          duration: '60 hours',
          difficulty: 'beginner',
          rating: 4.8,
          tags: ['python', 'data-analysis', 'programming', 'beginner'],
          isPremium: true,
          points: 300
        }
      ]
    },
    'data-science': {
      'python': [
        {
          id: 'python-data-science-handbook',
          title: 'Python Data Science Handbook',
          description: 'Essential tools for working with data in Python',
          type: 'book',
          provider: "O'Reilly",
          url: 'https://jakevdp.github.io/PythonDataScienceHandbook/',
          duration: '50 hours',
          difficulty: 'intermediate',
          rating: 4.6,
          tags: ['python', 'data-science', 'numpy', 'pandas', 'matplotlib'],
          isPremium: false,
          points: 300
        }
      ],
      'machine-learning': [
        {
          id: 'ml-coursera-stanford',
          title: 'Machine Learning Course',
          description: 'Stanford\'s famous machine learning course by Andrew Ng',
          type: 'course',
          provider: 'Coursera',
          url: 'https://coursera.org/learn/machine-learning',
          duration: '61 hours',
          difficulty: 'intermediate',
          rating: 4.9,
          tags: ['machine-learning', 'stanford', 'andrew-ng', 'algorithms'],
          isPremium: true,
          points: 500
        }
      ]
    }
  };

  /**
   * Get personalized resource recommendations based on user progress and goals
   */
  static getPersonalizedRecommendations(
    userProgress: UserProgress,
    domain: string,
    preferences: {
      learningStyle: 'visual' | 'hands-on' | 'reading' | 'mixed';
      timeAvailability: 'low' | 'medium' | 'high';
      budget: 'free' | 'budget' | 'premium';
      goals: string[];
      currentFocus?: string;
    }
  ): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];

    // Get skill-based recommendations
    const skillRecommendations = this.getSkillBasedRecommendations(userProgress, domain, preferences);
    recommendations.push(...skillRecommendations);

    // Get progress-based recommendations
    const progressRecommendations = this.getProgressBasedRecommendations(userProgress, preferences);
    recommendations.push(...progressRecommendations);

    // Get goal-oriented recommendations
    const goalRecommendations = this.getGoalOrientedRecommendations(preferences.goals, domain, preferences);
    recommendations.push(...goalRecommendations);

    // Get trending/emerging skill recommendations
    const trendingRecommendations = this.getTrendingSkillRecommendations(domain, userProgress);
    recommendations.push(...trendingRecommendations);

    return this.prioritizeRecommendations(recommendations, userProgress, preferences);
  }

  /**
   * Create comprehensive learning paths for specific domains
   */
  static createLearningPath(
    domain: string,
    specialization: string,
    targetLevel: 'entry' | 'mid' | 'senior',
    userPreferences: any
  ): LearningPath {
    const pathId = `${domain}-${specialization}-${targetLevel}`;
    
    switch (domain) {
      case 'software-development':
        return this.createSoftwareDevelopmentPath(specialization, targetLevel, userPreferences);
      case 'data-science':
        return this.createDataSciencePath(specialization, targetLevel, userPreferences);
      case 'ux-design':
        return this.createUXDesignPath(specialization, targetLevel, userPreferences);
      default:
        return this.createGeneralTechPath(domain, specialization, targetLevel);
    }
  }

  /**
   * Get resources filtered by user criteria
   */
  static getFilteredResources(
    domain: string,
    filters: {
      skills?: string[];
      type?: string[];
      difficulty?: string[];
      provider?: string[];
      isPremium?: boolean;
      minRating?: number;
      maxDuration?: number; // in hours
    }
  ): LearningResource[] {
    const domainResources = this.RESOURCE_DATABASE[domain] || {};
    let allResources: LearningResource[] = [];

    // Collect all resources for the domain
    Object.values(domainResources).forEach(skillResources => {
      allResources.push(...skillResources);
    });

    // Apply filters
    let filteredResources = allResources;

    if (filters.skills && filters.skills.length > 0) {
      filteredResources = filteredResources.filter(resource =>
        filters.skills!.some(skill => 
          resource.tags.some(tag => tag.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }

    if (filters.type && filters.type.length > 0) {
      filteredResources = filteredResources.filter(resource =>
        filters.type!.includes(resource.type)
      );
    }

    if (filters.difficulty && filters.difficulty.length > 0) {
      filteredResources = filteredResources.filter(resource =>
        filters.difficulty!.includes(resource.difficulty)
      );
    }

    if (filters.provider && filters.provider.length > 0) {
      filteredResources = filteredResources.filter(resource =>
        filters.provider!.includes(resource.provider)
      );
    }

    if (filters.isPremium !== undefined) {
      filteredResources = filteredResources.filter(resource =>
        resource.isPremium === filters.isPremium
      );
    }

    if (filters.minRating) {
      filteredResources = filteredResources.filter(resource =>
        (resource.rating || 0) >= filters.minRating!
      );
    }

    if (filters.maxDuration) {
      filteredResources = filteredResources.filter(resource => {
        const duration = this.parseDurationToHours(resource.duration || '');
        return duration <= filters.maxDuration!;
      });
    }

    return filteredResources.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  /**
   * Get recommended learning sequence for optimal skill development
   */
  static getOptimalLearningSequence(
    targetSkills: string[],
    currentSkills: string[],
    timeConstraint: number // weeks
  ): {
    sequence: Array<{
      week: number;
      skill: string;
      resources: LearningResource[];
      estimatedHours: number;
      prerequisites: string[];
    }>;
    totalDuration: number;
    skillDependencies: { [skill: string]: string[] };
  } {
    const skillDependencies = this.getSkillDependencies();
    const sortedSkills = this.topologicalSort(targetSkills, skillDependencies);
    const sequence = [];
    let currentWeek = 1;

    sortedSkills.forEach(skill => {
      if (!currentSkills.includes(skill)) {
        const resources = this.getResourcesForSkill(skill);
        const estimatedHours = this.calculateLearningTime(skill, resources);
        const weeksNeeded = Math.ceil(estimatedHours / 10); // Assume 10 hours per week

        for (let week = 0; week < weeksNeeded; week++) {
          sequence.push({
            week: currentWeek + week,
            skill,
            resources: resources.slice(week * 2, (week + 1) * 2), // 2 resources per week
            estimatedHours: Math.min(10, estimatedHours - (week * 10)),
            prerequisites: skillDependencies[skill] || []
          });
        }

        currentWeek += weeksNeeded;
      }
    });

    return {
      sequence,
      totalDuration: currentWeek - 1,
      skillDependencies
    };
  }

  /**
   * Get project recommendations based on skill level and interests
   */
  static getProjectRecommendations(
    skills: string[],
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    domain: string
  ): ProjectResource[] {
    const projects: ProjectResource[] = this.getProjectDatabase(domain);
    
    return projects.filter(project => {
      const skillMatch = project.skills.some(skill => 
        skills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
      );
      const difficultyMatch = project.difficulty === difficulty;
      
      return skillMatch && difficultyMatch;
    }).sort((a, b) => b.points - a.points).slice(0, 5);
  }

  /**
   * Generate study plan with daily/weekly goals
   */
  static generateStudyPlan(
    learningPath: LearningPath,
    availableHoursPerWeek: number,
    startDate: Date = new Date()
  ): {
    weeklyPlan: Array<{
      week: number;
      startDate: Date;
      endDate: Date;
      goals: string[];
      resources: LearningResource[];
      estimatedHours: number;
      milestones: string[];
    }>;
    totalWeeks: number;
    completionDate: Date;
  } {
    const totalHours = this.calculatePathDuration(learningPath);
    const totalWeeks = Math.ceil(totalHours / availableHoursPerWeek);
    
    const weeklyPlan = [];
    const resourcesPerWeek = Math.ceil(learningPath.resources.length / totalWeeks);

    for (let week = 1; week <= totalWeeks; week++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + (week - 1) * 7);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekResources = learningPath.resources.slice(
        (week - 1) * resourcesPerWeek,
        week * resourcesPerWeek
      );

      weeklyPlan.push({
        week,
        startDate: weekStart,
        endDate: weekEnd,
        goals: this.generateWeeklyGoals(week, weekResources),
        resources: weekResources,
        estimatedHours: Math.min(availableHoursPerWeek, totalHours - (week - 1) * availableHoursPerWeek),
        milestones: this.generateWeeklyMilestones(week, totalWeeks, learningPath)
      });
    }

    const completionDate = new Date(startDate);
    completionDate.setDate(completionDate.getDate() + totalWeeks * 7);

    return {
      weeklyPlan,
      totalWeeks,
      completionDate
    };
  }

  // Private helper methods
  private static getSkillBasedRecommendations(
    userProgress: UserProgress,
    domain: string,
    preferences: any
  ): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];
    
    // Recommend resources for skills with low mastery
    const lowMasterySkills = userProgress.skillMasteries
      .filter(mastery => mastery.progress < 50)
      .sort((a, b) => a.progress - b.progress);

    lowMasterySkills.slice(0, 3).forEach(mastery => {
      const resources = this.getResourcesForSkill(mastery.skill, preferences);
      
      recommendations.push({
        id: `skill-improvement-${mastery.skill}`,
        type: 'skill_gap',
        title: `Improve ${mastery.skill} Skills`,
        description: `Boost your ${mastery.skill} proficiency with targeted learning resources`,
        priority: 'high',
        reasoning: `Your ${mastery.skill} skills are at ${mastery.level} level with ${mastery.progress}% progress`,
        actionable_steps: [
          `Start with ${resources[0]?.title || 'fundamental concepts'}`,
          'Practice with hands-on exercises',
          'Build a project to apply knowledge',
          'Take assessments to track progress'
        ],
        resources: resources.slice(0, 3),
        estimatedImpact: 'high',
        category: 'skill_development'
      });
    });

    return recommendations;
  }

  private static getProgressBasedRecommendations(
    userProgress: UserProgress,
    preferences: any
  ): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];

    // Recommend based on current level
    if (userProgress.currentLevel.level < 3) {
      recommendations.push({
        id: 'foundation-building',
        type: 'next_step',
        title: 'Strengthen Your Foundation',
        description: 'Focus on fundamental skills to accelerate your learning journey',
        priority: 'high',
        reasoning: 'Building strong fundamentals will help you progress faster in advanced topics',
        actionable_steps: [
          'Complete basic skill assessments',
          'Practice coding challenges daily',
          'Join beginner-friendly communities',
          'Set consistent learning schedule'
        ],
        resources: [],
        estimatedImpact: 'high',
        category: 'foundation'
      });
    }

    // Recommend streak maintenance
    if (userProgress.streak.currentStreak < 7) {
      recommendations.push({
        id: 'build-streak',
        type: 'challenge',
        title: 'Build a Learning Streak',
        description: 'Establish consistent daily learning habits for better retention',
        priority: 'medium',
        reasoning: 'Consistent daily practice leads to better skill retention and faster progress',
        actionable_steps: [
          'Set aside 30 minutes daily for learning',
          'Choose one skill to focus on each day',
          'Use learning reminders and tracking',
          'Celebrate small daily wins'
        ],
        resources: [],
        estimatedImpact: 'medium',
        category: 'habit_building'
      });
    }

    return recommendations;
  }

  private static getGoalOrientedRecommendations(
    goals: string[],
    domain: string,
    preferences: any
  ): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];

    goals.forEach(goal => {
      const resources = this.getResourcesForGoal(goal, domain, preferences);
      
      recommendations.push({
        id: `goal-${goal.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'career_path',
        title: `Achieve: ${goal}`,
        description: `Structured path to reach your goal of ${goal}`,
        priority: 'high',
        reasoning: `This aligns with your stated goal and career aspirations`,
        actionable_steps: [
          `Research ${goal} requirements`,
          'Identify skill gaps',
          'Create learning timeline',
          'Build relevant projects',
          'Network with professionals'
        ],
        resources,
        estimatedImpact: 'high',
        category: 'goal_achievement'
      });
    });

    return recommendations;
  }

  private static getTrendingSkillRecommendations(
    domain: string,
    userProgress: UserProgress
  ): PersonalizedRecommendation[] {
    // Would implement trending skills analysis
    return [];
  }

  private static prioritizeRecommendations(
    recommendations: PersonalizedRecommendation[],
    userProgress: UserProgress,
    preferences: any
  ): PersonalizedRecommendation[] {
    return recommendations
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 10); // Return top 10 recommendations
  }

  private static createSoftwareDevelopmentPath(
    specialization: string,
    targetLevel: string,
    preferences: any
  ): LearningPath {
    // Implementation for software development learning paths
    return {
      id: 'software-dev-fullstack-entry',
      title: 'Full-Stack Developer Path',
      description: 'Complete path to become a full-stack developer',
      domain: 'software-development',
      difficulty: 'beginner',
      estimatedDuration: '6-12 months',
      resources: [],
      prerequisites: ['Basic computer literacy'],
      learningOutcomes: ['Build web applications', 'Understand databases', 'Deploy applications'],
      projects: [],
      assessments: []
    };
  }

  private static createDataSciencePath(specialization: string, targetLevel: string, preferences: any): LearningPath {
    return {
      id: 'data-science-analyst-entry',
      title: 'Data Science Analyst Path',
      description: 'Complete path to become a data scientist',
      domain: 'data-science',
      difficulty: 'intermediate',
      estimatedDuration: '8-15 months',
      resources: [],
      prerequisites: ['Basic statistics', 'Python fundamentals'],
      learningOutcomes: ['Analyze data', 'Build ML models', 'Create visualizations'],
      projects: [],
      assessments: []
    };
  }

  private static createUXDesignPath(specialization: string, targetLevel: string, preferences: any): LearningPath {
    return {
      id: 'ux-design-designer-entry',
      title: 'UX Designer Path',
      description: 'Complete path to become a UX designer',
      domain: 'ux-design',
      difficulty: 'beginner',
      estimatedDuration: '4-8 months',
      resources: [],
      prerequisites: ['Design interest', 'Basic computer skills'],
      learningOutcomes: ['Conduct user research', 'Create wireframes', 'Design prototypes'],
      projects: [],
      assessments: []
    };
  }

  private static createGeneralTechPath(domain: string, specialization: string, targetLevel: string): LearningPath {
    return {
      id: `${domain}-${specialization}-${targetLevel}`,
      title: `${specialization} in ${domain}`,
      description: `Learning path for ${specialization}`,
      domain,
      difficulty: 'beginner',
      estimatedDuration: '3-9 months',
      resources: [],
      prerequisites: [],
      learningOutcomes: [],
      projects: [],
      assessments: []
    };
  }

  private static getResourcesForSkill(skill: string, preferences?: any): LearningResource[] {
    // Search through resource database for skill-specific resources
    const allResources: LearningResource[] = [];
    Object.values(this.RESOURCE_DATABASE).forEach(domainResources => {
      Object.entries(domainResources).forEach(([skillName, resources]) => {
        if (skillName.toLowerCase().includes(skill.toLowerCase()) || 
            resources.some(r => r.tags.some(tag => tag.toLowerCase().includes(skill.toLowerCase())))) {
          allResources.push(...resources);
        }
      });
    });

    return allResources.slice(0, 5);
  }

  private static getResourcesForGoal(goal: string, domain: string, preferences: any): LearningResource[] {
    // Map goals to relevant resources
    return [];
  }

  private static getSkillDependencies(): { [skill: string]: string[] } {
    return {
      'react': ['javascript', 'html', 'css'],
      'node.js': ['javascript'],
      'express': ['node.js', 'javascript'],
      'mongodb': ['database-basics'],
      'postgresql': ['sql', 'database-basics'],
      'machine-learning': ['python', 'statistics', 'linear-algebra'],
      'deep-learning': ['machine-learning', 'python', 'calculus']
    };
  }

  private static topologicalSort(skills: string[], dependencies: { [skill: string]: string[] }): string[] {
    // Implement topological sorting for skill dependencies
    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (skill: string) => {
      if (visited.has(skill)) return;
      visited.add(skill);

      const deps = dependencies[skill] || [];
      deps.forEach(dep => visit(dep));
      
      result.push(skill);
    };

    skills.forEach(skill => visit(skill));
    return result;
  }

  private static calculateLearningTime(skill: string, resources: LearningResource[]): number {
    return resources.reduce((total, resource) => {
      return total + this.parseDurationToHours(resource.duration || '');
    }, 0);
  }

  private static parseDurationToHours(duration: string): number {
    const matches = duration.match(/(\d+)\s*(hour|hr|h|day|week|month)/i);
    if (!matches) return 0;

    const value = parseInt(matches[1]);
    const unit = matches[2].toLowerCase();

    switch (unit) {
      case 'hour':
      case 'hr':
      case 'h':
        return value;
      case 'day':
        return value * 8; // 8 hours per day
      case 'week':
        return value * 40; // 40 hours per week
      case 'month':
        return value * 160; // 160 hours per month
      default:
        return value;
    }
  }

  private static getProjectDatabase(domain: string): ProjectResource[] {
    // Return project database for domain
    return [];
  }

  private static calculatePathDuration(path: LearningPath): number {
    return path.resources.reduce((total, resource) => {
      return total + this.parseDurationToHours(resource.duration || '');
    }, 0);
  }

  private static generateWeeklyGoals(week: number, resources: LearningResource[]): string[] {
    return resources.map(resource => `Complete: ${resource.title}`);
  }

  private static generateWeeklyMilestones(week: number, totalWeeks: number, path: LearningPath): string[] {
    const progress = (week / totalWeeks) * 100;
    return [`${Math.round(progress)}% through ${path.title}`];
  }
}