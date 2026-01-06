from django.core.management.base import BaseCommand
from prediction.models import Badge, Achievement, DailyChallenge, RoadmapStage


class Command(BaseCommand):
    help = 'Populate simple gamification data'

    def handle(self, *args, **options):
        self.stdout.write('Populating gamification data...')
        
        # Create simple badges
        badges_data = [
            {'badge_id': 'first_login', 'name': 'Welcome', 'description': 'First login', 'icon': 'star', 'category': 'milestone', 'points': 10},
            {'badge_id': 'first_prediction', 'name': 'Explorer', 'description': 'Made first prediction', 'icon': 'compass', 'category': 'exploration', 'points': 25},
            {'badge_id': 'streak_3_days', 'name': 'Consistent', 'description': '3-day streak', 'icon': 'fire', 'category': 'streak', 'points': 50},
        ]

        for badge_data in badges_data:
            badge, created = Badge.objects.get_or_create(
                badge_id=badge_data['badge_id'],
                defaults=badge_data
            )
            if created:
                self.stdout.write(f'Created badge: {badge.name}')

        # Create simple achievements
        achievements_data = [
            {'achievement_id': 'first_week', 'name': 'First Week', 'description': 'Completed first week', 'icon': 'calendar', 'achievement_type': 'milestone', 'points': 100, 'target': 1, 'requirements': []},
            {'achievement_id': 'skill_master', 'name': 'Skill Master', 'description': 'Mastered 5 skills', 'icon': 'brain', 'achievement_type': 'skill', 'points': 250, 'target': 5, 'requirements': []},
        ]

        for achievement_data in achievements_data:
            achievement, created = Achievement.objects.get_or_create(
                achievement_id=achievement_data['achievement_id'],
                defaults=achievement_data
            )
            if created:
                self.stdout.write(f'Created achievement: {achievement.name}')

        # Create simple challenges
        from django.utils import timezone
        from datetime import timedelta
        
        challenges_data = [
            {
                'challenge_id': 'daily_learn', 
                'title': 'Daily Learning', 
                'description': 'Learn something new today', 
                'challenge_type': 'learning', 
                'difficulty': 'easy',
                'points': 20, 
                'time_estimate': '30 minutes',
                'category': 'learning',
                'expires_at': timezone.now() + timedelta(days=30)
            },
            {
                'challenge_id': 'skill_practice', 
                'title': 'Practice Skills', 
                'description': 'Practice your skills', 
                'challenge_type': 'skill_practice', 
                'difficulty': 'medium',
                'points': 30,
                'time_estimate': '1 hour', 
                'category': 'practice',
                'expires_at': timezone.now() + timedelta(days=30)
            },
        ]

        for challenge_data in challenges_data:
            challenge, created = DailyChallenge.objects.get_or_create(
                challenge_id=challenge_data['challenge_id'],
                defaults=challenge_data
            )
            if created:
                self.stdout.write(f'Created challenge: {challenge.title}')

        # Create simple roadmap stages
        stages_data = [
            {
                'stage_id': 'python_basics',
                'title': 'Python Basics',
                'description': 'Learn Python fundamentals',
                'domain': 'software_development',
                'category': 'fundamentals',
                'difficulty': 'beginner',
                'estimated_time': '4 weeks',
                'points': 100,
                'order': 1,
                'prerequisites': [],
                'skills': ['python', 'programming']
            },
            {
                'stage_id': 'web_dev',
                'title': 'Web Development',
                'description': 'Learn web development',
                'domain': 'software_development',
                'category': 'specialization',
                'difficulty': 'intermediate',
                'estimated_time': '8 weeks',
                'points': 200,
                'order': 2,
                'prerequisites': ['python_basics'],
                'skills': ['html', 'css', 'javascript']
            }
        ]

        for stage_data in stages_data:
            stage, created = RoadmapStage.objects.get_or_create(
                stage_id=stage_data['stage_id'],
                defaults=stage_data
            )
            if created:
                self.stdout.write(f'Created stage: {stage.title}')

        self.stdout.write(self.style.SUCCESS('Successfully populated gamification data!'))