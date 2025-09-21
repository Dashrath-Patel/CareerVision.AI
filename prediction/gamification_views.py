from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, Sum, Count
from datetime import datetime, timedelta
import json

from .models import (
    UserProfile, RoadmapStage, UserStageProgress, Badge, UserBadge,
    Achievement, UserAchievement, DailyChallenge, UserChallengeProgress,
    WeeklyQuest, UserQuestProgress, SkillMastery, ActivityLog
)
from .serializers import (
    UserProfileSerializer, RoadmapStageSerializer, UserStageProgressSerializer,
    BadgeSerializer, UserBadgeSerializer, AchievementSerializer, UserAchievementSerializer,
    DailyChallengeSerializer, WeeklyQuestSerializer, SkillMasterySerializer, ActivityLogSerializer
)


@api_view(['GET', 'POST'])
def user_profile(request, user_id):
    """Get or create user profile"""
    if request.method == 'GET':
        try:
            profile = UserProfile.objects.get(user_id=user_id)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'POST':
        data = request.data.copy()
        data['user_id'] = user_id
        
        # Check if profile already exists
        profile, created = UserProfile.objects.get_or_create(
            user_id=user_id,
            defaults=data
        )
        
        if not created:
            # Update existing profile
            serializer = UserProfileSerializer(profile, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def roadmap_stages(request, domain):
    """Get all stages for a specific domain"""
    stages = RoadmapStage.objects.filter(domain=domain).order_by('order')
    serializer = RoadmapStageSerializer(stages, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def user_progress(request, user_id):
    """Get comprehensive user progress data"""
    try:
        profile = UserProfile.objects.get(user_id=user_id)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get user stage progress
    stage_progress = UserStageProgress.objects.filter(user_profile=profile)
    completed_stages = stage_progress.filter(completed=True)
    
    # Get user badges
    user_badges = UserBadge.objects.filter(user_profile=profile).select_related('badge')
    badges = [user_badge.badge for user_badge in user_badges]
    
    # Get user achievements
    user_achievements = UserAchievement.objects.filter(user_profile=profile).select_related('achievement')
    
    # Get skill masteries
    skill_masteries = SkillMastery.objects.filter(user_profile=profile)
    
    # Calculate level and next level
    from .services.gamification_service import GamificationService
    current_level = GamificationService.calculate_user_level(profile.total_points)
    next_level = GamificationService.get_next_level(current_level['level'])
    
    # Get weekly/monthly goals (simplified)
    current_week = timezone.now().isocalendar()[1]
    current_month = timezone.now().month
    
    weekly_completed = completed_stages.filter(
        completed_at__week=current_week,
        completed_at__year=timezone.now().year
    ).count()
    
    monthly_completed = completed_stages.filter(
        completed_at__month=current_month,
        completed_at__year=timezone.now().year
    ).count()
    
    progress_data = {
        'profile': UserProfileSerializer(profile).data,
        'current_level': current_level,
        'next_level': next_level,
        'total_points': profile.total_points,
        'completed_stages': [sp.stage.stage_id for sp in completed_stages],
        'badges': BadgeSerializer(badges, many=True).data,
        'achievements': UserAchievementSerializer(user_achievements, many=True).data,
        'skill_masteries': SkillMasterySerializer(skill_masteries, many=True).data,
        'streak': {
            'current_streak': profile.current_streak,
            'longest_streak': profile.longest_streak,
            'last_activity_date': profile.last_activity_date
        },
        'weekly_goals': {
            'target': max(3, profile.current_level // 2),  # Dynamic target based on level
            'current': weekly_completed,
            'week': f"{timezone.now().year}-W{current_week}"
        },
        'monthly_goals': {
            'target': max(10, profile.current_level * 2),  # Dynamic target based on level
            'current': monthly_completed,
            'month': f"{timezone.now().year}-{current_month:02d}"
        }
    }
    
    return Response(progress_data)


@api_view(['POST'])
def update_progress(request, user_id):
    """Update user progress based on activity"""
    try:
        profile = UserProfile.objects.get(user_id=user_id)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    update_data = request.data
    update_type = update_data.get('type')
    
    points_earned = 0
    new_badges = []
    level_up = False
    
    if update_type == 'stage_completed':
        stage_id = update_data.get('stage_id')
        try:
            stage = RoadmapStage.objects.get(stage_id=stage_id)
            
            # Update or create stage progress
            stage_progress, created = UserStageProgress.objects.get_or_create(
                user_profile=profile,
                stage=stage,
                defaults={'progress': 100, 'completed': True, 'completed_at': timezone.now()}
            )
            
            if not stage_progress.completed:
                stage_progress.completed = True
                stage_progress.progress = 100
                stage_progress.completed_at = timezone.now()
                stage_progress.save()
                
                # Calculate points based on stage difficulty
                difficulty_multiplier = {'beginner': 1, 'intermediate': 1.5, 'advanced': 2}
                points_earned = int(stage.points * difficulty_multiplier.get(stage.difficulty, 1))
                
                # Update skill masteries
                for skill_name in stage.skills:
                    skill_mastery, created = SkillMastery.objects.get_or_create(
                        user_profile=profile,
                        skill_name=skill_name,
                        defaults={'progress': 20, 'level': 'beginner'}
                    )
                    
                    if not created:
                        skill_mastery.progress = min(100, skill_mastery.progress + 20)
                        # Update level based on progress
                        if skill_mastery.progress >= 80 and skill_mastery.level != 'expert':
                            skill_mastery.level = 'expert'
                        elif skill_mastery.progress >= 60 and skill_mastery.level in ['beginner', 'intermediate']:
                            skill_mastery.level = 'advanced'
                        elif skill_mastery.progress >= 40 and skill_mastery.level == 'beginner':
                            skill_mastery.level = 'intermediate'
                        skill_mastery.save()
        
        except RoadmapStage.DoesNotExist:
            return Response({'error': 'Stage not found'}, status=status.HTTP_404_NOT_FOUND)
    
    elif update_type == 'skill_practiced':
        skill_name = update_data.get('skill_name')
        points_earned = 25
        
        if skill_name:
            skill_mastery, created = SkillMastery.objects.get_or_create(
                user_profile=profile,
                skill_name=skill_name,
                defaults={'progress': 5, 'level': 'beginner'}
            )
            
            if not created:
                skill_mastery.progress = min(100, skill_mastery.progress + 5)
                skill_mastery.save()
    
    elif update_type == 'resource_completed':
        points_earned = update_data.get('points', 50)
    
    elif update_type == 'daily_activity':
        points_earned = 10
    
    # Update profile points and check for level up
    old_level = profile.current_level
    profile.total_points += points_earned
    
    # Simple level calculation (would use GamificationService in real implementation)
    new_level = min(10, max(1, profile.total_points // 1000 + 1))
    if new_level > old_level:
        profile.current_level = new_level
        level_up = True
    
    # Update streak
    today = timezone.now().date()
    last_activity = profile.last_activity_date.date() if profile.last_activity_date else None
    
    if last_activity == today:
        # Already active today, don't change streak
        pass
    elif last_activity == today - timedelta(days=1):
        # Active yesterday, continue streak
        profile.current_streak += 1
        profile.longest_streak = max(profile.longest_streak, profile.current_streak)
    else:
        # Gap in activity, reset streak
        profile.current_streak = 1
    
    profile.last_activity_date = timezone.now()
    profile.save()
    
    # Log activity
    ActivityLog.objects.create(
        user_profile=profile,
        activity_type=update_type,
        points_earned=points_earned,
        metadata=update_data
    )
    
    # Check for new badges (simplified)
    new_badges = check_badge_eligibility(profile)
    
    response_data = {
        'points_earned': points_earned,
        'total_points': profile.total_points,
        'level_up': level_up,
        'new_level': profile.current_level if level_up else old_level,
        'new_badges': BadgeSerializer(new_badges, many=True).data,
        'current_streak': profile.current_streak
    }
    
    return Response(response_data)


@api_view(['GET'])
def daily_challenges(request, user_id):
    """Get daily challenges for user"""
    today = timezone.now().date()
    tomorrow = today + timedelta(days=1)
    
    # Get today's challenges
    challenges = DailyChallenge.objects.filter(
        expires_at__date=tomorrow,  # Challenges expire at end of day
        created_at__date=today
    )
    
    # Get user's progress on these challenges
    try:
        profile = UserProfile.objects.get(user_id=user_id)
        user_progress = UserChallengeProgress.objects.filter(
            user_profile=profile,
            challenge__in=challenges
        )
        progress_dict = {up.challenge_id: up for up in user_progress}
    except UserProfile.DoesNotExist:
        progress_dict = {}
    
    # Combine challenge data with progress
    challenge_data = []
    for challenge in challenges:
        progress = progress_dict.get(challenge.id)
        challenge_info = DailyChallengeSerializer(challenge).data
        challenge_info['completed'] = progress.completed if progress else False
        challenge_info['completed_at'] = progress.completed_at if progress else None
        challenge_data.append(challenge_info)
    
    return Response(challenge_data)


@api_view(['POST'])
def complete_challenge(request, user_id, challenge_id):
    """Mark a daily challenge as completed"""
    try:
        profile = UserProfile.objects.get(user_id=user_id)
        challenge = DailyChallenge.objects.get(id=challenge_id)
    except (UserProfile.DoesNotExist, DailyChallenge.DoesNotExist):
        return Response({'error': 'User or challenge not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Create or update challenge progress
    progress, created = UserChallengeProgress.objects.get_or_create(
        user_profile=profile,
        challenge=challenge,
        defaults={'completed': True, 'completed_at': timezone.now()}
    )
    
    if progress.completed:
        return Response({'message': 'Challenge already completed'})
    
    progress.completed = True
    progress.completed_at = timezone.now()
    progress.save()
    
    # Award points
    profile.total_points += challenge.points
    profile.save()
    
    # Log activity
    ActivityLog.objects.create(
        user_profile=profile,
        activity_type='challenge_completed',
        points_earned=challenge.points,
        metadata={'challenge_id': challenge.challenge_id}
    )
    
    return Response({
        'message': 'Challenge completed successfully',
        'points_earned': challenge.points,
        'total_points': profile.total_points
    })


@api_view(['GET'])
def weekly_quest(request, user_id):
    """Get current weekly quest for user"""
    today = timezone.now()
    current_quest = WeeklyQuest.objects.filter(
        starts_at__lte=today,
        ends_at__gte=today
    ).first()
    
    if not current_quest:
        return Response({'message': 'No active weekly quest'})
    
    # Get user progress
    try:
        profile = UserProfile.objects.get(user_id=user_id)
        quest_progress = UserQuestProgress.objects.filter(
            user_profile=profile,
            quest=current_quest
        ).first()
    except UserProfile.DoesNotExist:
        quest_progress = None
    
    quest_data = {
        'id': current_quest.quest_id,
        'title': current_quest.title,
        'description': current_quest.description,
        'objectives': current_quest.objectives,
        'total_points': current_quest.total_points,
        'starts_at': current_quest.starts_at,
        'ends_at': current_quest.ends_at,
        'progress': quest_progress.progress if quest_progress else 0,
        'completed': quest_progress.completed if quest_progress else False,
        'objectives_completed': quest_progress.objectives_completed if quest_progress else []
    }
    
    return Response(quest_data)


@api_view(['GET'])
def user_badges(request, user_id):
    """Get all badges earned by user"""
    try:
        profile = UserProfile.objects.get(user_id=user_id)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    user_badges = UserBadge.objects.filter(user_profile=profile).select_related('badge')
    badges_data = []
    
    for user_badge in user_badges:
        badge_data = BadgeSerializer(user_badge.badge).data
        badge_data['unlocked_at'] = user_badge.unlocked_at
        badges_data.append(badge_data)
    
    return Response(badges_data)


@api_view(['GET'])
def leaderboard(request, domain=None):
    """Get leaderboard for domain or global"""
    query = UserProfile.objects.all()
    
    if domain:
        query = query.filter(domain=domain)
    
    # Get top users by points
    top_users = query.order_by('-total_points')[:10]
    
    leaderboard_data = []
    for rank, user in enumerate(top_users, 1):
        user_data = {
            'rank': rank,
            'user_id': user.user_id,
            'total_points': user.total_points,
            'level': user.current_level,
            'domain': user.domain,
            'badges_count': UserBadge.objects.filter(user_profile=user).count(),
            'current_streak': user.current_streak
        }
        leaderboard_data.append(user_data)
    
    return Response(leaderboard_data)


@api_view(['GET'])
def progress_stats(request, user_id):
    """Get detailed progress statistics for user"""
    try:
        profile = UserProfile.objects.get(user_id=user_id)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get activity logs for stats
    activities = ActivityLog.objects.filter(user_profile=profile).order_by('-created_at')
    
    # Calculate stats
    total_activities = activities.count()
    completed_stages = UserStageProgress.objects.filter(user_profile=profile, completed=True).count()
    total_stages = RoadmapStage.objects.filter(domain=profile.domain).count()
    completion_rate = (completed_stages / total_stages * 100) if total_stages > 0 else 0
    
    # Weekly activity
    week_ago = timezone.now() - timedelta(days=7)
    weekly_activities = activities.filter(created_at__gte=week_ago).count()
    
    # Skill distribution
    skill_masteries = SkillMastery.objects.filter(user_profile=profile)
    skill_distribution = []
    total_skill_progress = sum(sm.progress for sm in skill_masteries)
    
    for mastery in skill_masteries:
        percentage = (mastery.progress / total_skill_progress * 100) if total_skill_progress > 0 else 0
        skill_distribution.append({
            'skill': mastery.skill_name,
            'percentage': percentage,
            'level': mastery.level,
            'progress': mastery.progress
        })
    
    # Active days (simplified)
    unique_days = activities.values('created_at__date').distinct().count()
    
    stats_data = {
        'total_time_spent': total_activities * 30,  # Estimate 30 min per activity
        'completion_rate': completion_rate,
        'average_session_time': 45,  # Placeholder
        'weekly_goal_progress': (weekly_activities / 7) * 100,  # Simplified
        'monthly_goal_progress': (completed_stages / max(10, profile.current_level * 2)) * 100,
        'last_activity_date': profile.last_activity_date,
        'active_days': unique_days,
        'productive_hours': [  # Placeholder data
            {'hour': 9, 'count': 5},
            {'hour': 14, 'count': 8},
            {'hour': 20, 'count': 6}
        ],
        'skill_distribution': skill_distribution
    }
    
    return Response(stats_data)


def check_badge_eligibility(profile):
    """Check if user is eligible for new badges"""
    new_badges = []
    
    # Get existing badges
    existing_badge_ids = UserBadge.objects.filter(user_profile=profile).values_list('badge__badge_id', flat=True)
    
    # Check for various badge criteria
    completed_stages_count = UserStageProgress.objects.filter(user_profile=profile, completed=True).count()
    
    # First Steps badge
    if 'first_steps' not in existing_badge_ids and completed_stages_count >= 1:
        try:
            badge = Badge.objects.get(badge_id='first_steps')
            UserBadge.objects.create(user_profile=profile, badge=badge)
            new_badges.append(badge)
        except Badge.DoesNotExist:
            pass
    
    # Progress badges
    if 'progress_pioneer' not in existing_badge_ids and completed_stages_count >= 10:
        try:
            badge = Badge.objects.get(badge_id='progress_pioneer')
            UserBadge.objects.create(user_profile=profile, badge=badge)
            new_badges.append(badge)
        except Badge.DoesNotExist:
            pass
    
    # Streak badges
    if 'consistent_learner' not in existing_badge_ids and profile.current_streak >= 7:
        try:
            badge = Badge.objects.get(badge_id='consistent_learner')
            UserBadge.objects.create(user_profile=profile, badge=badge)
            new_badges.append(badge)
        except Badge.DoesNotExist:
            pass
    
    return new_badges