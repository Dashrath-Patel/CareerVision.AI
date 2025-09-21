from django.contrib import admin
from .models import (
    Roadmap, Question, Choice,
    UserProfile, RoadmapStage, UserStageProgress, Badge, UserBadge,
    Achievement, UserAchievement, DailyChallenge, UserChallengeProgress,
    WeeklyQuest, UserQuestProgress, SkillMastery, ActivityLog
)


class RoadmapAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'image_tag')
    readonly_fields = ('image_tag',)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'domain', 'total_points', 'current_level', 'current_streak', 'created_at')
    list_filter = ('domain', 'current_level', 'created_at')
    search_fields = ('user_id', 'domain')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(RoadmapStage)
class RoadmapStageAdmin(admin.ModelAdmin):
    list_display = ('stage_id', 'domain', 'title', 'difficulty', 'points', 'order', 'is_active')
    list_filter = ('domain', 'difficulty', 'is_active')
    search_fields = ('stage_id', 'title', 'domain')
    list_editable = ('is_active', 'order')
    ordering = ('domain', 'order')


@admin.register(UserStageProgress)
class UserStageProgressAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'stage', 'progress', 'completed', 'completed_at')
    list_filter = ('completed', 'stage__domain', 'stage__difficulty')
    search_fields = ('user_profile__user_id', 'stage__title')
    readonly_fields = ('started_at', 'updated_at')


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('badge_id', 'name', 'rarity', 'created_at')
    list_filter = ('rarity', 'created_at')
    search_fields = ('badge_id', 'name')


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'badge', 'unlocked_at')
    list_filter = ('badge__rarity', 'unlocked_at')
    search_fields = ('user_profile__user_id', 'badge__name')


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('achievement_id', 'name', 'category', 'points', 'max_progress', 'is_active')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('achievement_id', 'name')
    list_editable = ('is_active',)


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'achievement', 'progress', 'completed', 'completed_at')
    list_filter = ('completed', 'achievement__category')
    search_fields = ('user_profile__user_id', 'achievement__name')
    readonly_fields = ('started_at', 'updated_at')


@admin.register(DailyChallenge)
class DailyChallengeAdmin(admin.ModelAdmin):
    list_display = ('challenge_id', 'title', 'challenge_type', 'points', 'expires_at', 'is_active')
    list_filter = ('challenge_type', 'is_active', 'created_at')
    search_fields = ('challenge_id', 'title')
    list_editable = ('is_active',)


@admin.register(UserChallengeProgress)
class UserChallengeProgressAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'challenge', 'completed', 'completed_at')
    list_filter = ('completed', 'challenge__challenge_type')
    search_fields = ('user_profile__user_id', 'challenge__title')


@admin.register(WeeklyQuest)
class WeeklyQuestAdmin(admin.ModelAdmin):
    list_display = ('quest_id', 'title', 'total_points', 'starts_at', 'ends_at', 'is_active')
    list_filter = ('is_active', 'starts_at')
    search_fields = ('quest_id', 'title')
    list_editable = ('is_active',)


@admin.register(UserQuestProgress)
class UserQuestProgressAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'quest', 'progress', 'completed', 'completed_at')
    list_filter = ('completed', 'quest__starts_at')
    search_fields = ('user_profile__user_id', 'quest__title')
    readonly_fields = ('started_at', 'updated_at')


@admin.register(SkillMastery)
class SkillMasteryAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'skill_name', 'level', 'progress', 'updated_at')
    list_filter = ('level', 'skill_name')
    search_fields = ('user_profile__user_id', 'skill_name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'activity_type', 'points_earned', 'created_at')
    list_filter = ('activity_type', 'created_at')
    search_fields = ('user_profile__user_id', 'activity_type')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'


# Register original models
admin.site.register(Roadmap, RoadmapAdmin)
admin.site.register(Question)
admin.site.register(Choice)
