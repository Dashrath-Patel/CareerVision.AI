import { CareerRoadmap, RoadmapStage, LearningResource } from '@/types/gamification';

export class RoadmapDataService {
  /**
   * Software Development Career Roadmap
   */
  static getSoftwareDevelopmentRoadmap(): CareerRoadmap {
    const stages: RoadmapStage[] = [
      // Foundation Stages
      {
        id: 'sd-foundation-1',
        title: 'Programming Fundamentals',
        description: 'Master the basics of programming concepts and logic',
        category: 'Foundation',
        difficulty: 'beginner',
        estimatedTime: '4-6 weeks',
        points: 200,
        prerequisites: [],
        skills: ['Logic Building', 'Problem Solving', 'Basic Syntax'],
        resources: [
          {
            id: 'prog-basics-1',
            title: 'Introduction to Programming Concepts',
            description: 'Learn fundamental programming concepts like variables, loops, and functions',
            type: 'course',
            provider: 'Codecademy',
            url: 'https://codecademy.com/learn/introduction-to-programming',
            duration: '10 hours',
            difficulty: 'beginner',
            rating: 4.7,
            tags: ['programming', 'basics', 'fundamentals'],
            isPremium: false,
            points: 50
          },
          {
            id: 'logic-building-1',
            title: 'Problem Solving with Algorithms',
            description: 'Build logical thinking skills through algorithmic challenges',
            type: 'practice',
            provider: 'HackerRank',
            url: 'https://hackerrank.com/domains/algorithms',
            duration: '20 hours',
            difficulty: 'beginner',
            rating: 4.5,
            tags: ['algorithms', 'logic', 'practice'],
            isPremium: false,
            points: 75
          }
        ],
        completed: false,
        progress: 0,
        order: 1
      },
      {
        id: 'sd-foundation-2',
        title: 'Choose Your First Language',
        description: 'Select and master your first programming language (Python, JavaScript, or Java)',
        category: 'Foundation',
        difficulty: 'beginner',
        estimatedTime: '6-8 weeks',
        points: 300,
        prerequisites: ['sd-foundation-1'],
        skills: ['Python/JavaScript/Java', 'Syntax Mastery', 'Basic Projects'],
        resources: [
          {
            id: 'python-course-1',
            title: 'Python for Beginners',
            description: 'Complete Python programming course from basics to projects',
            type: 'course',
            provider: 'Python.org',
            url: 'https://python.org/about/gettingstarted/',
            duration: '40 hours',
            difficulty: 'beginner',
            rating: 4.8,
            tags: ['python', 'programming', 'beginner'],
            isPremium: false,
            points: 100
          },
          {
            id: 'js-course-1',
            title: 'JavaScript Essentials',
            description: 'Learn JavaScript fundamentals and DOM manipulation',
            type: 'course',
            provider: 'MDN Web Docs',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript',
            duration: '35 hours',
            difficulty: 'beginner',
            rating: 4.7,
            tags: ['javascript', 'web', 'programming'],
            isPremium: false,
            points: 100
          }
        ],
        completed: false,
        progress: 0,
        order: 2
      },
      {
        id: 'sd-foundation-3',
        title: 'Version Control with Git',
        description: 'Learn Git and GitHub for code management and collaboration',
        category: 'Foundation',
        difficulty: 'beginner',
        estimatedTime: '2-3 weeks',
        points: 150,
        prerequisites: ['sd-foundation-2'],
        skills: ['Git', 'GitHub', 'Version Control', 'Collaboration'],
        resources: [
          {
            id: 'git-tutorial-1',
            title: 'Git and GitHub for Beginners',
            description: 'Complete guide to version control with Git and GitHub',
            type: 'tutorial',
            provider: 'GitHub',
            url: 'https://github.com/skills/introduction-to-github',
            duration: '8 hours',
            difficulty: 'beginner',
            rating: 4.6,
            tags: ['git', 'github', 'version-control'],
            isPremium: false,
            points: 75
          }
        ],
        completed: false,
        progress: 0,
        order: 3
      },

      // Intermediate Stages
      {
        id: 'sd-intermediate-1',
        title: 'Data Structures & Algorithms',
        description: 'Master fundamental data structures and algorithmic thinking',
        category: 'Core Skills',
        difficulty: 'intermediate',
        estimatedTime: '8-10 weeks',
        points: 400,
        prerequisites: ['sd-foundation-3'],
        skills: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting', 'Searching'],
        resources: [
          {
            id: 'dsa-course-1',
            title: 'Data Structures and Algorithms Specialization',
            description: 'Comprehensive course covering all major data structures and algorithms',
            type: 'course',
            provider: 'Coursera',
            url: 'https://coursera.org/specializations/data-structures-algorithms',
            duration: '60 hours',
            difficulty: 'intermediate',
            rating: 4.8,
            tags: ['algorithms', 'data-structures', 'programming'],
            isPremium: true,
            points: 200
          },
          {
            id: 'leetcode-practice-1',
            title: 'LeetCode Algorithm Practice',
            description: 'Practice algorithmic problems to reinforce learning',
            type: 'practice',
            provider: 'LeetCode',
            url: 'https://leetcode.com/explore/',
            duration: 'Ongoing',
            difficulty: 'intermediate',
            rating: 4.5,
            tags: ['practice', 'algorithms', 'interviews'],
            isPremium: false,
            points: 150
          }
        ],
        completed: false,
        progress: 0,
        order: 4
      },
      {
        id: 'sd-intermediate-2',
        title: 'Database Fundamentals',
        description: 'Learn database design, SQL, and data management concepts',
        category: 'Core Skills',
        difficulty: 'intermediate',
        estimatedTime: '4-6 weeks',
        points: 300,
        prerequisites: ['sd-foundation-3'],
        skills: ['SQL', 'Database Design', 'Normalization', 'Relationships'],
        resources: [
          {
            id: 'sql-course-1',
            title: 'SQL for Data Science',
            description: 'Complete SQL course with hands-on practice',
            type: 'course',
            provider: 'SQLBolt',
            url: 'https://sqlbolt.com/',
            duration: '20 hours',
            difficulty: 'intermediate',
            rating: 4.7,
            tags: ['sql', 'database', 'data'],
            isPremium: false,
            points: 150
          }
        ],
        completed: false,
        progress: 0,
        order: 5
      },
      {
        id: 'sd-intermediate-3',
        title: 'Web Development Basics',
        description: 'Learn HTML, CSS, and responsive web design principles',
        category: 'Specialization',
        difficulty: 'intermediate',
        estimatedTime: '6-8 weeks',
        points: 350,
        prerequisites: ['sd-foundation-2'],
        skills: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox', 'Grid'],
        resources: [
          {
            id: 'web-dev-1',
            title: 'The Complete Web Developer Course',
            description: 'Learn HTML, CSS, and modern web development practices',
            type: 'course',
            provider: 'freeCodeCamp',
            url: 'https://freecodecamp.org/learn/responsive-web-design/',
            duration: '50 hours',
            difficulty: 'intermediate',
            rating: 4.8,
            tags: ['html', 'css', 'web-development'],
            isPremium: false,
            points: 175
          }
        ],
        completed: false,
        progress: 0,
        order: 6
      },

      // Advanced Stages
      {
        id: 'sd-advanced-1',
        title: 'Framework Mastery',
        description: 'Master a modern framework (React, Angular, Vue, or Django/Flask)',
        category: 'Specialization',
        difficulty: 'advanced',
        estimatedTime: '10-12 weeks',
        points: 500,
        prerequisites: ['sd-intermediate-3'],
        skills: ['React/Angular/Vue', 'Component Architecture', 'State Management'],
        resources: [
          {
            id: 'react-course-1',
            title: 'React: The Complete Guide',
            description: 'Master React with hooks, context, and modern patterns',
            type: 'course',
            provider: 'Udemy',
            url: 'https://udemy.com/course/react-the-complete-guide/',
            duration: '80 hours',
            difficulty: 'advanced',
            rating: 4.9,
            tags: ['react', 'javascript', 'frontend'],
            isPremium: true,
            points: 250
          }
        ],
        completed: false,
        progress: 0,
        order: 7
      },
      {
        id: 'sd-advanced-2',
        title: 'Backend Development',
        description: 'Build robust backend systems with APIs and microservices',
        category: 'Specialization',
        difficulty: 'advanced',
        estimatedTime: '8-10 weeks',
        points: 450,
        prerequisites: ['sd-intermediate-1', 'sd-intermediate-2'],
        skills: ['REST APIs', 'Authentication', 'Microservices', 'Cloud Services'],
        resources: [
          {
            id: 'backend-course-1',
            title: 'Node.js Backend Development',
            description: 'Build scalable backend applications with Node.js and Express',
            type: 'course',
            provider: 'Pluralsight',
            url: 'https://pluralsight.com/paths/node-js',
            duration: '60 hours',
            difficulty: 'advanced',
            rating: 4.7,
            tags: ['nodejs', 'backend', 'api'],
            isPremium: true,
            points: 225
          }
        ],
        completed: false,
        progress: 0,
        order: 8
      },
      {
        id: 'sd-advanced-3',
        title: 'DevOps & Deployment',
        description: 'Learn CI/CD, containerization, and cloud deployment',
        category: 'Operations',
        difficulty: 'advanced',
        estimatedTime: '6-8 weeks',
        points: 400,
        prerequisites: ['sd-advanced-2'],
        skills: ['Docker', 'CI/CD', 'AWS/Azure', 'Kubernetes', 'Monitoring'],
        resources: [
          {
            id: 'devops-course-1',
            title: 'DevOps for Developers',
            description: 'Learn Docker, CI/CD, and cloud deployment strategies',
            type: 'course',
            provider: 'Docker',
            url: 'https://docker.com/get-started/',
            duration: '40 hours',
            difficulty: 'advanced',
            rating: 4.6,
            tags: ['docker', 'devops', 'deployment'],
            isPremium: false,
            points: 200
          }
        ],
        completed: false,
        progress: 0,
        order: 9
      },

      // Expert Stages
      {
        id: 'sd-expert-1',
        title: 'System Design',
        description: 'Design scalable, distributed systems and architectures',
        category: 'Architecture',
        difficulty: 'advanced',
        estimatedTime: '8-12 weeks',
        points: 600,
        prerequisites: ['sd-advanced-2', 'sd-advanced-3'],
        skills: ['System Architecture', 'Scalability', 'Load Balancing', 'Caching'],
        resources: [
          {
            id: 'system-design-1',
            title: 'System Design Interview Preparation',
            description: 'Learn to design large-scale distributed systems',
            type: 'course',
            provider: 'Educative',
            url: 'https://educative.io/courses/grokking-the-system-design-interview',
            duration: '50 hours',
            difficulty: 'advanced',
            rating: 4.8,
            tags: ['system-design', 'architecture', 'scalability'],
            isPremium: true,
            points: 300
          }
        ],
        completed: false,
        progress: 0,
        order: 10
      }
    ];

    return {
      id: 'software-development',
      domain: 'Software Development',
      title: 'Full-Stack Software Developer',
      description: 'Comprehensive roadmap to become a skilled software developer with expertise in both frontend and backend technologies',
      totalStages: stages.length,
      estimatedDuration: '12-18 months',
      stages,
      skills: [
        'Programming Languages', 'Data Structures & Algorithms', 'Web Development',
        'Database Management', 'Version Control', 'System Design', 'DevOps',
        'Problem Solving', 'Software Architecture', 'Testing'
      ],
      careerPaths: [
        'Frontend Developer', 'Backend Developer', 'Full-Stack Developer',
        'Software Architect', 'DevOps Engineer', 'Technical Lead'
      ],
      salaryRange: {
        min: 60000,
        max: 180000,
        currency: 'USD'
      },
      jobDemand: 'very-high',
      prerequisites: [
        'Basic computer literacy',
        'Strong logical thinking',
        'Willingness to learn continuously',
        'Problem-solving mindset'
      ]
    };
  }

  /**
   * Data Science Career Roadmap
   */
  static getDataScienceRoadmap(): CareerRoadmap {
    const stages: RoadmapStage[] = [
      {
        id: 'ds-foundation-1',
        title: 'Mathematics & Statistics Foundation',
        description: 'Build strong mathematical foundation for data science',
        category: 'Foundation',
        difficulty: 'beginner',
        estimatedTime: '6-8 weeks',
        points: 250,
        prerequisites: [],
        skills: ['Statistics', 'Linear Algebra', 'Calculus', 'Probability'],
        resources: [
          {
            id: 'math-stats-1',
            title: 'Statistics for Data Science',
            description: 'Comprehensive statistics course tailored for data science',
            type: 'course',
            provider: 'Khan Academy',
            url: 'https://khanacademy.org/math/statistics-probability',
            duration: '30 hours',
            difficulty: 'beginner',
            rating: 4.7,
            tags: ['statistics', 'probability', 'math'],
            isPremium: false,
            points: 125
          }
        ],
        completed: false,
        progress: 0,
        order: 1
      },
      {
        id: 'ds-foundation-2',
        title: 'Python for Data Science',
        description: 'Master Python programming with focus on data science libraries',
        category: 'Foundation',
        difficulty: 'beginner',
        estimatedTime: '8-10 weeks',
        points: 300,
        prerequisites: ['ds-foundation-1'],
        skills: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Jupyter'],
        resources: [
          {
            id: 'python-ds-1',
            title: 'Python for Data Science and AI',
            description: 'Learn Python with focus on data science applications',
            type: 'course',
            provider: 'IBM Coursera',
            url: 'https://coursera.org/learn/python-for-applied-data-science-ai',
            duration: '25 hours',
            difficulty: 'beginner',
            rating: 4.6,
            tags: ['python', 'data-science', 'programming'],
            isPremium: true,
            points: 150
          }
        ],
        completed: false,
        progress: 0,
        order: 2
      }
      // Additional stages would follow similar pattern...
    ];

    return {
      id: 'data-science',
      domain: 'Data Science',
      title: 'Data Scientist',
      description: 'Complete roadmap to become a skilled data scientist with expertise in machine learning, statistics, and data analysis',
      totalStages: stages.length,
      estimatedDuration: '10-16 months',
      stages,
      skills: [
        'Python/R', 'Statistics', 'Machine Learning', 'Data Visualization',
        'SQL', 'Big Data', 'Deep Learning', 'Business Intelligence'
      ],
      careerPaths: [
        'Data Analyst', 'Machine Learning Engineer', 'Data Scientist',
        'Research Scientist', 'AI Engineer', 'Business Intelligence Analyst'
      ],
      salaryRange: {
        min: 70000,
        max: 200000,
        currency: 'USD'
      },
      jobDemand: 'very-high',
      prerequisites: [
        'Strong mathematical background',
        'Analytical thinking',
        'Basic programming knowledge',
        'Curiosity about data patterns'
      ]
    };
  }

  /**
   * UX Design Career Roadmap
   */
  static getUXDesignRoadmap(): CareerRoadmap {
    const stages: RoadmapStage[] = [
      {
        id: 'ux-foundation-1',
        title: 'Design Thinking Fundamentals',
        description: 'Learn the core principles of human-centered design',
        category: 'Foundation',
        difficulty: 'beginner',
        estimatedTime: '4-6 weeks',
        points: 200,
        prerequisites: [],
        skills: ['Design Thinking', 'User Research', 'Empathy', 'Problem Definition'],
        resources: [
          {
            id: 'design-thinking-1',
            title: 'Design Thinking for Innovation',
            description: 'Stanford\'s renowned design thinking methodology',
            type: 'course',
            provider: 'Stanford d.school',
            url: 'https://dschool.stanford.edu/resources',
            duration: '20 hours',
            difficulty: 'beginner',
            rating: 4.8,
            tags: ['design-thinking', 'innovation', 'user-research'],
            isPremium: false,
            points: 100
          }
        ],
        completed: false,
        progress: 0,
        order: 1
      }
      // Additional UX stages would follow...
    ];

    return {
      id: 'ux-design',
      domain: 'UX Design',
      title: 'UX/UI Designer',
      description: 'Complete roadmap to become a skilled UX designer with expertise in user research, design, and prototyping',
      totalStages: stages.length,
      estimatedDuration: '8-12 months',
      stages,
      skills: [
        'User Research', 'Wireframing', 'Prototyping', 'Visual Design',
        'Interaction Design', 'Usability Testing', 'Design Systems', 'Figma/Sketch'
      ],
      careerPaths: [
        'UX Designer', 'UI Designer', 'Product Designer',
        'UX Researcher', 'Design Lead', 'Design Systems Designer'
      ],
      salaryRange: {
        min: 55000,
        max: 150000,
        currency: 'USD'
      },
      jobDemand: 'high',
      prerequisites: [
        'Creative thinking',
        'Empathy for users',
        'Basic design sense',
        'Problem-solving skills'
      ]
    };
  }

  /**
   * Get roadmap by domain
   */
  static getRoadmapByDomain(domain: string): CareerRoadmap | null {
    switch (domain.toLowerCase()) {
      case 'software development':
      case 'software-development':
        return this.getSoftwareDevelopmentRoadmap();
      case 'data science':
      case 'data-science':
        return this.getDataScienceRoadmap();
      case 'ux design':
      case 'ux-design':
        return this.getUXDesignRoadmap();
      default:
        return null;
    }
  }

  /**
   * Get all available roadmaps
   */
  static getAllRoadmaps(): CareerRoadmap[] {
    return [
      this.getSoftwareDevelopmentRoadmap(),
      this.getDataScienceRoadmap(),
      this.getUXDesignRoadmap()
    ];
  }

  /**
   * Get next stage in roadmap
   */
  static getNextStage(roadmap: CareerRoadmap, completedStages: string[]): RoadmapStage | null {
    const availableStages = roadmap.stages.filter(stage => {
      // Check if all prerequisites are completed
      const prerequisitesMet = stage.prerequisites.every(prereq => 
        completedStages.includes(prereq)
      );
      // Stage not already completed
      const notCompleted = !completedStages.includes(stage.id);
      
      return prerequisitesMet && notCompleted;
    });

    // Return the stage with the lowest order number
    return availableStages.sort((a, b) => a.order - b.order)[0] || null;
  }

  /**
   * Calculate roadmap completion percentage
   */
  static calculateRoadmapProgress(roadmap: CareerRoadmap, completedStages: string[]): number {
    const completed = roadmap.stages.filter(stage => 
      completedStages.includes(stage.id)
    ).length;
    
    return Math.round((completed / roadmap.totalStages) * 100);
  }

  /**
   * Get recommended next steps
   */
  static getRecommendedNextSteps(
    roadmap: CareerRoadmap, 
    completedStages: string[]
  ): RoadmapStage[] {
    const nextStage = this.getNextStage(roadmap, completedStages);
    if (!nextStage) return [];

    // Get up to 3 next available stages
    const availableStages = roadmap.stages.filter(stage => {
      const prerequisitesMet = stage.prerequisites.every(prereq => 
        completedStages.includes(prereq)
      );
      const notCompleted = !completedStages.includes(stage.id);
      return prerequisitesMet && notCompleted;
    });

    return availableStages
      .sort((a, b) => a.order - b.order)
      .slice(0, 3);
  }
}