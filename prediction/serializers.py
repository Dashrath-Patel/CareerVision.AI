from rest_framework import serializers
from .models import (
    UserProfile, RoadmapStage, UserStageProgress, Badge, UserBadge,
    Achievement, UserAchievement, DailyChallenge, UserChallengeProgress,
    WeeklyQuest, UserQuestProgress, SkillMastery, ActivityLog
)


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile data"""
    class Meta:
        model = UserProfile
        fields = [
            'user_id', 'domain', 'total_points', 'current_level',
            'current_streak', 'longest_streak', 'last_activity_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class RoadmapStageSerializer(serializers.ModelSerializer):
    """Serializer for roadmap stages"""
    prerequisites = serializers.JSONField()
    skills = serializers.JSONField()
    resources = serializers.JSONField()
    
    class Meta:
        model = RoadmapStage
        fields = [
            'stage_id', 'domain', 'title', 'description', 'difficulty',
            'estimated_duration', 'points', 'order', 'prerequisites',
            'skills', 'resources', 'is_active', 'created_at'
        ]
        read_only_fields = ['created_at']


class UserStageProgressSerializer(serializers.ModelSerializer):
    """Serializer for user stage progress"""
    stage = RoadmapStageSerializer(read_only=True)
    stage_id = serializers.CharField(write_only=True)
    
    class Meta:
        model = UserStageProgress
        fields = [
            'user_profile', 'stage', 'stage_id', 'progress',
            'completed', 'completed_at', 'started_at', 'updated_at'
        ]
        read_only_fields = ['started_at', 'updated_at']


class BadgeSerializer(serializers.ModelSerializer):
    """Serializer for badges"""
    class Meta:
        model = Badge
        fields = [
            'badge_id', 'name', 'description', 'icon_url', 'rarity',
            'criteria', 'created_at'
        ]
        read_only_fields = ['created_at']


class UserBadgeSerializer(serializers.ModelSerializer):
    """Serializer for user badges"""
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = UserBadge
        fields = ['badge', 'unlocked_at']
        read_only_fields = ['unlocked_at']


class AchievementSerializer(serializers.ModelSerializer):
    """Serializer for achievements"""
    steps = serializers.JSONField()
    
    class Meta:
        model = Achievement
        fields = [
            'achievement_id', 'name', 'description', 'icon_url',
            'category', 'points', 'max_progress', 'steps',
            'is_active', 'created_at'
        ]
        read_only_fields = ['created_at']


class UserAchievementSerializer(serializers.ModelSerializer):
    """Serializer for user achievements"""
    achievement = AchievementSerializer(read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = [
            'achievement', 'progress', 'completed', 'completed_at',
            'steps_completed', 'started_at', 'updated_at'
        ]
        read_only_fields = ['started_at', 'updated_at']


class DailyChallengeSerializer(serializers.ModelSerializer):
    """Serializer for daily challenges"""
    metadata = serializers.JSONField()
    
    class Meta:
        model = DailyChallenge
        fields = [
            'challenge_id', 'title', 'description', 'challenge_type',
            'target_value', 'points', 'metadata', 'expires_at',
            'is_active', 'created_at'
        ]
        read_only_fields = ['created_at']


class UserChallengeProgressSerializer(serializers.ModelSerializer):
    """Serializer for user challenge progress"""
    challenge = DailyChallengeSerializer(read_only=True)
    
    class Meta:
        model = UserChallengeProgress
        fields = [
            'challenge', 'completed', 'completed_at', 'created_at'
        ]
        read_only_fields = ['created_at']


class WeeklyQuestSerializer(serializers.ModelSerializer):
    """Serializer for weekly quests"""
    objectives = serializers.JSONField()
    
    class Meta:
        model = WeeklyQuest
        fields = [
            'quest_id', 'title', 'description', 'objectives',
            'total_points', 'starts_at', 'ends_at', 'is_active',
            'created_at'
        ]
        read_only_fields = ['created_at']


class UserQuestProgressSerializer(serializers.ModelSerializer):
    """Serializer for user quest progress"""
    quest = WeeklyQuestSerializer(read_only=True)
    objectives_completed = serializers.JSONField()
    
    class Meta:
        model = UserQuestProgress
        fields = [
            'quest', 'progress', 'completed', 'completed_at',
            'objectives_completed', 'started_at', 'updated_at'
        ]
        read_only_fields = ['started_at', 'updated_at']


class SkillMasterySerializer(serializers.ModelSerializer):
    """Serializer for skill mastery"""
    class Meta:
        model = SkillMastery
        fields = [
            'skill_name', 'progress', 'level', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ActivityLogSerializer(serializers.ModelSerializer):
    """Serializer for activity logs"""
    metadata = serializers.JSONField()
    
    class Meta:
        model = ActivityLog
        fields = [
            'activity_type', 'points_earned', 'metadata', 'created_at'
        ]
        read_only_fields = ['created_at']


# Detailed serializers for dashboard views
class UserProgressSummarySerializer(serializers.Serializer):
    """Comprehensive user progress summary"""
    profile = UserProfileSerializer()
    current_level = serializers.DictField()
    next_level = serializers.DictField()
    total_points = serializers.IntegerField()
    completed_stages = serializers.ListField(child=serializers.CharField())
    badges = BadgeSerializer(many=True)
    achievements = UserAchievementSerializer(many=True)
    skill_masteries = SkillMasterySerializer(many=True)
    streak = serializers.DictField()
    weekly_goals = serializers.DictField()
    monthly_goals = serializers.DictField()


class ProgressUpdateResponseSerializer(serializers.Serializer):
    """Response for progress updates"""
    points_earned = serializers.IntegerField()
    total_points = serializers.IntegerField()
    level_up = serializers.BooleanField()
    new_level = serializers.IntegerField()
    new_badges = BadgeSerializer(many=True)
    current_streak = serializers.IntegerField()


class LeaderboardEntrySerializer(serializers.Serializer):
    """Leaderboard entry"""
    rank = serializers.IntegerField()
    user_id = serializers.CharField()
    total_points = serializers.IntegerField()
    level = serializers.IntegerField()
    domain = serializers.CharField()
    badges_count = serializers.IntegerField()
    current_streak = serializers.IntegerField()


class ProgressStatsSerializer(serializers.Serializer):
    """Detailed progress statistics"""
    total_time_spent = serializers.IntegerField()
    completion_rate = serializers.FloatField()
    average_session_time = serializers.IntegerField()
    weekly_goal_progress = serializers.FloatField()
    monthly_goal_progress = serializers.FloatField()
    last_activity_date = serializers.DateTimeField()
    active_days = serializers.IntegerField()
    productive_hours = serializers.ListField(child=serializers.DictField())
    skill_distribution = serializers.ListField(child=serializers.DictField())


class SkillDistributionSerializer(serializers.Serializer):
    """Skill distribution for progress visualization"""
    skill = serializers.CharField()
    percentage = serializers.FloatField()
    level = serializers.CharField()
    progress = serializers.IntegerField()


class DailyChallengeWithProgressSerializer(DailyChallengeSerializer):
    """Daily challenge with user progress"""
    completed = serializers.BooleanField()
    completed_at = serializers.DateTimeField(allow_null=True)


class WeeklyQuestWithProgressSerializer(WeeklyQuestSerializer):
    """Weekly quest with user progress"""
    progress = serializers.IntegerField()
    completed = serializers.BooleanField()
    objectives_completed = serializers.JSONField()


# Input serializers for API requests
class StageCompletionSerializer(serializers.Serializer):
    """Input for stage completion"""
    type = serializers.CharField()
    stage_id = serializers.CharField()
    completion_time = serializers.IntegerField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)


class SkillPracticeSerializer(serializers.Serializer):
    """Input for skill practice"""
    type = serializers.CharField()
    skill_name = serializers.CharField()
    practice_type = serializers.CharField(required=False)
    duration = serializers.IntegerField(required=False)


class ResourceCompletionSerializer(serializers.Serializer):
    """Input for resource completion"""
    type = serializers.CharField()
    resource_id = serializers.CharField()
    resource_type = serializers.CharField()
    points = serializers.IntegerField(default=50)
    notes = serializers.CharField(required=False, allow_blank=True)


class DailyActivitySerializer(serializers.Serializer):
    """Input for daily activity logging"""
    type = serializers.CharField()
    activity_details = serializers.DictField(required=False)