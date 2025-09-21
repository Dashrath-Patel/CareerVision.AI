from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import json

from prediction.models import (
    RoadmapStage, Badge, Achievement, DailyChallenge, WeeklyQuest
)


class Command(BaseCommand):
    help = 'Populate initial gamification data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting gamification data population...'))
        
        self.create_roadmap_stages()
        self.create_badges()
        self.create_achievements()
        self.create_daily_challenges()
        self.create_weekly_quests()
        
        self.stdout.write(self.style.SUCCESS('Successfully populated gamification data!'))

    def create_roadmap_stages(self):
        """Create roadmap stages for different domains"""
        self.stdout.write('Creating roadmap stages...')
        
        # Software Development Roadmap
        software_stages = [
            {
                'stage_id': 'programming_fundamentals',
                'domain': 'software_development',
                'title': 'Programming Fundamentals',
                'description': 'Master the core concepts of programming including variables, data types, control structures, and basic algorithms.',
                'difficulty': 'beginner',
                'estimated_duration': '4-6 weeks',
                'points': 500,
                'order': 1,
                'prerequisites': [],
                'skills': ['programming_basics', 'problem_solving', 'algorithms'],
                'resources': [
                    {
                        'type': 'course',
                        'title': 'Introduction to Programming',
                        'provider': 'Codecademy',
                        'url': 'https://codecademy.com/programming-intro',
                        'duration': '20 hours'
                    },
                    {
                        'type': 'book',
                        'title': 'Python Crash Course',
                        'author': 'Eric Matthes',
                        'isbn': '978-1593279288'
                    }
                ]
            },
            {
                'stage_id': 'data_structures_algorithms',
                'domain': 'software_development',
                'title': 'Data Structures & Algorithms',
                'description': 'Learn essential data structures and algorithms for efficient problem solving.',
                'difficulty': 'intermediate',
                'estimated_duration': '6-8 weeks',
                'points': 750,
                'order': 2,
                'prerequisites': ['programming_fundamentals'],
                'skills': ['data_structures', 'algorithms', 'complexity_analysis'],
                'resources': [
                    {
                        'type': 'course',
                        'title': 'Data Structures and Algorithms',
                        'provider': 'LeetCode',
                        'url': 'https://leetcode.com/explore/',
                        'duration': '40 hours'
                    }
                ]
            },
            {
                'stage_id': 'web_development_basics',
                'domain': 'software_development',
                'title': 'Web Development Basics',
                'description': 'Learn HTML, CSS, and JavaScript to build interactive web applications.',
                'difficulty': 'beginner',
                'estimated_duration': '5-7 weeks',
                'points': 600,
                'order': 3,
                'prerequisites': ['programming_fundamentals'],
                'skills': ['html', 'css', 'javascript', 'dom_manipulation'],
                'resources': [
                    {
                        'type': 'course',
                        'title': 'The Complete Web Developer Course',
                        'provider': 'Udemy',
                        'duration': '30 hours'
                    }
                ]
            },
            {
                'stage_id': 'backend_development',
                'domain': 'software_development',
                'title': 'Backend Development',
                'description': 'Master server-side programming, databases, and API development.',
                'difficulty': 'intermediate',
                'estimated_duration': '8-10 weeks',
                'points': 800,
                'order': 4,
                'prerequisites': ['programming_fundamentals', 'web_development_basics'],
                'skills': ['nodejs', 'python', 'databases', 'apis', 'server_management'],
                'resources': [
                    {
                        'type': 'course',
                        'title': 'Node.js Complete Guide',
                        'provider': 'Udemy',
                        'duration': '40 hours'
                    }
                ]
            },
            {
                'stage_id': 'database_design',
                'domain': 'software_development',
                'title': 'Database Design & Management',
                'description': 'Learn database design principles, SQL, and database management systems.',
                'difficulty': 'intermediate',
                'estimated_duration': '4-6 weeks',
                'points': 700,
                'order': 5,
                'prerequisites': ['backend_development'],
                'skills': ['sql', 'database_design', 'normalization', 'indexing'],
                'resources': []
            }
        ]
        
        for stage_data in software_stages:
            stage, created = RoadmapStage.objects.get_or_create(
                stage_id=stage_data['stage_id'],
                defaults=stage_data
            )
            if created:
                self.stdout.write(f'  Created stage: {stage.title}')

        # Data Science Roadmap
        data_science_stages = [
            {
                'stage_id': 'statistics_fundamentals',
                'domain': 'data_science',
                'title': 'Statistics Fundamentals',
                'description': 'Master descriptive and inferential statistics essential for data analysis.',
                'difficulty': 'beginner',
                'estimated_duration': '4-5 weeks',
                'points': 500,
                'order': 1,
                'prerequisites': [],
                'skills': ['statistics', 'probability', 'hypothesis_testing'],
                'resources': []
            },
            {
                'stage_id': 'python_data_analysis',
                'domain': 'data_science',
                'title': 'Python for Data Analysis',
                'description': 'Learn Python libraries like Pandas, NumPy, and Matplotlib for data manipulation and visualization.',
                'difficulty': 'beginner',
                'estimated_duration': '5-6 weeks',
                'points': 600,
                'order': 2,
                'prerequisites': ['statistics_fundamentals'],
                'skills': ['python', 'pandas', 'numpy', 'matplotlib', 'data_visualization'],
                'resources': []
            },
            {
                'stage_id': 'machine_learning_basics',
                'domain': 'data_science',
                'title': 'Machine Learning Fundamentals',
                'description': 'Understand supervised and unsupervised learning algorithms.',
                'difficulty': 'intermediate',
                'estimated_duration': '6-8 weeks',
                'points': 800,
                'order': 3,
                'prerequisites': ['python_data_analysis'],
                'skills': ['machine_learning', 'scikit_learn', 'regression', 'classification'],
                'resources': []
            }
        ]
        
        for stage_data in data_science_stages:
            stage, created = RoadmapStage.objects.get_or_create(
                stage_id=stage_data['stage_id'],
                defaults=stage_data
            )
            if created:
                self.stdout.write(f'  Created stage: {stage.title}')

    def create_badges(self):
        """Create gamification badges"""
        self.stdout.write('Creating badges...')
        
        badges_data = [
            {
                'badge_id': 'first_steps',
                'name': 'First Steps',
                'description': 'Complete your first learning stage',
                'icon_url': '/media/badges/first_steps.png',
                'rarity': 'common',
                'criteria': {'type': 'stages_completed', 'value': 1}
            },
            {
                'badge_id': 'progress_pioneer',
                'name': 'Progress Pioneer',
                'description': 'Complete 10 learning stages',
                'icon_url': '/media/badges/progress_pioneer.png',
                'rarity': 'uncommon',
                'criteria': {'type': 'stages_completed', 'value': 10}
            },
            {
                'badge_id': 'consistent_learner',
                'name': 'Consistent Learner',
                'description': 'Maintain a 7-day learning streak',
                'icon_url': '/media/badges/consistent_learner.png',
                'rarity': 'rare',
                'criteria': {'type': 'streak', 'value': 7}
            },
            {
                'badge_id': 'knowledge_seeker',
                'name': 'Knowledge Seeker',
                'description': 'Complete 50 learning resources',
                'icon_url': '/media/badges/knowledge_seeker.png',
                'rarity': 'epic',
                'criteria': {'type': 'resources_completed', 'value': 50}
            },
            {
                'badge_id': 'skill_master',
                'name': 'Skill Master',
                'description': 'Reach expert level in 5 skills',
                'icon_url': '/media/badges/skill_master.png',
                'rarity': 'legendary',
                'criteria': {'type': 'expert_skills', 'value': 5}
            },
            {
                'badge_id': 'challenge_champion',
                'name': 'Challenge Champion',
                'description': 'Complete 30 daily challenges',
                'icon_url': '/media/badges/challenge_champion.png',
                'rarity': 'rare',
                'criteria': {'type': 'challenges_completed', 'value': 30}
            },
            {
                'badge_id': 'point_collector',
                'name': 'Point Collector',
                'description': 'Earn 10,000 total points',
                'icon_url': '/media/badges/point_collector.png',
                'rarity': 'epic',
                'criteria': {'type': 'total_points', 'value': 10000}
            }
        ]
        
        for badge_data in badges_data:
            badge, created = Badge.objects.get_or_create(
                badge_id=badge_data['badge_id'],
                defaults=badge_data
            )
            if created:
                self.stdout.write(f'  Created badge: {badge.name}')

    def create_achievements(self):
        """Create gamification achievements"""
        self.stdout.write('Creating achievements...')
        
        achievements_data = [
            {
                'achievement_id': 'coding_novice',
                'name': 'Coding Novice',
                'description': 'Complete your first programming milestone',
                'icon_url': '/media/achievements/coding_novice.png',
                'category': 'programming',
                'points': 100,
                'max_progress': 5,
                'steps': [
                    'Complete Programming Fundamentals',
                    'Write your first program',
                    'Debug a code issue',
                    'Complete 10 coding exercises',
                    'Share your first project'
                ]
            },
            {
                'achievement_id': 'data_explorer',
                'name': 'Data Explorer',
                'description': 'Master the basics of data analysis',
                'icon_url': '/media/achievements/data_explorer.png',
                'category': 'data_science',
                'points': 150,
                'max_progress': 4,
                'steps': [
                    'Complete Statistics Fundamentals',
                    'Analyze your first dataset',
                    'Create data visualizations',
                    'Build a predictive model'
                ]
            },
            {
                'achievement_id': 'web_architect',
                'name': 'Web Architect',
                'description': 'Build comprehensive web applications',
                'icon_url': '/media/achievements/web_architect.png',
                'category': 'web_development',
                'points': 200,
                'max_progress': 6,
                'steps': [
                    'Learn HTML/CSS basics',
                    'Master JavaScript fundamentals',
                    'Build a frontend application',
                    'Create backend APIs',
                    'Integrate databases',
                    'Deploy a full-stack application'
                ]
            },
            {
                'achievement_id': 'streak_master',
                'name': 'Streak Master',
                'description': 'Maintain consistent learning habits',
                'icon_url': '/media/achievements/streak_master.png',
                'category': 'consistency',
                'points': 250,
                'max_progress': 3,
                'steps': [
                    'Maintain 7-day streak',
                    'Maintain 30-day streak',
                    'Maintain 90-day streak'
                ]
            }
        ]
        
        for achievement_data in achievements_data:
            achievement, created = Achievement.objects.get_or_create(
                achievement_id=achievement_data['achievement_id'],
                defaults=achievement_data
            )
            if created:
                self.stdout.write(f'  Created achievement: {achievement.name}')

    def create_daily_challenges(self):
        """Create sample daily challenges"""
        self.stdout.write('Creating daily challenges...')
        
        today = timezone.now().date()
        tomorrow = today + timedelta(days=1)
        
        challenges_data = [
            {
                'challenge_id': f'daily_code_{today.strftime("%Y%m%d")}',
                'title': 'Daily Coding Practice',
                'description': 'Solve one coding problem today',
                'challenge_type': 'coding',
                'target_value': 1,
                'points': 50,
                'expires_at': timezone.make_aware(timezone.datetime.combine(tomorrow, timezone.datetime.min.time())),
                'metadata': {
                    'difficulty': 'easy',
                    'topics': ['arrays', 'strings', 'loops']
                }
            },
            {
                'challenge_id': f'daily_learn_{today.strftime("%Y%m%d")}',
                'title': 'Learn Something New',
                'description': 'Complete at least 30 minutes of learning',
                'challenge_type': 'learning',
                'target_value': 30,
                'points': 40,
                'expires_at': timezone.make_aware(timezone.datetime.combine(tomorrow, timezone.datetime.min.time())),
                'metadata': {
                    'unit': 'minutes',
                    'activity_types': ['reading', 'video', 'practice']
                }
            },
            {
                'challenge_id': f'daily_quiz_{today.strftime("%Y%m%d")}',
                'title': 'Knowledge Check',
                'description': 'Take a quiz in your learning domain',
                'challenge_type': 'quiz',
                'target_value': 1,
                'points': 30,
                'expires_at': timezone.make_aware(timezone.datetime.combine(tomorrow, timezone.datetime.min.time())),
                'metadata': {
                    'min_score': 70,
                    'question_count': 10
                }
            }
        ]
        
        for challenge_data in challenges_data:
            challenge, created = DailyChallenge.objects.get_or_create(
                challenge_id=challenge_data['challenge_id'],
                defaults=challenge_data
            )
            if created:
                self.stdout.write(f'  Created daily challenge: {challenge.title}')

    def create_weekly_quests(self):
        """Create sample weekly quests"""
        self.stdout.write('Creating weekly quests...')
        
        today = timezone.now()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6, hours=23, minutes=59, seconds=59)
        
        quests_data = [
            {
                'quest_id': f'weekly_progress_{week_start.strftime("%Y%m%d")}',
                'title': 'Weekly Progress Quest',
                'description': 'Complete multiple learning objectives this week',
                'objectives': [
                    'Complete 2 learning stages',
                    'Solve 5 coding problems',
                    'Earn 500 points',
                    'Maintain daily learning streak'
                ],
                'total_points': 200,
                'starts_at': week_start,
                'ends_at': week_end
            },
            {
                'quest_id': f'weekly_skill_{week_start.strftime("%Y%m%d")}',
                'title': 'Skill Building Marathon',
                'description': 'Focus on improving specific skills this week',
                'objectives': [
                    'Practice 3 different skills',
                    'Complete 10 skill exercises',
                    'Reach intermediate level in 1 skill',
                    'Share your progress with community'
                ],
                'total_points': 300,
                'starts_at': week_start,
                'ends_at': week_end
            }
        ]
        
        for quest_data in quests_data:
            quest, created = WeeklyQuest.objects.get_or_create(
                quest_id=quest_data['quest_id'],
                defaults=quest_data
            )
            if created:
                self.stdout.write(f'  Created weekly quest: {quest.title}')