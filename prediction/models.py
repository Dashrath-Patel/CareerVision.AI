from django.db import models
from django.utils.html import format_html
class Roadmap(models.Model):
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='roadmaps/')
    pdf = models.FileField(upload_to='roadmaps/')
    average_salary = models.IntegerField(null=True, blank=True)  # New field
    verified_by = models.CharField(max_length=255, null=True, blank=True)  # New field
    
    
    created_at = models.DateTimeField(auto_now_add=True)
    def image_tag(self):
        return format_html('<img src="/media/{}" style="width:40px;height:40px; "/>'.format(self.image))
    def __str__(self):
        return self.title
    
class Question(models.Model):
    question_text = models.CharField(max_length=255)
    
    def __str__(self):
        return self.question_text

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.choice_text



# New models for Skill Gap Analyzer feature
class Skill(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)  # e.g., "Technical", "Soft skill", etc.
    
    def __str__(self):
        return self.name

class JobRoleSkill(models.Model):
    job_role = models.CharField(max_length=100)  # e.g., "SE/SDE", "Analyst"
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    importance = models.IntegerField(default=5)  # Scale 1-10
    
    def __str__(self):
        return f"{self.job_role} - {self.skill.name}"

class LearningResource(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    url = models.URLField()
    resource_type = models.CharField(max_length=50, choices=[
        ('course', 'Course'),
        ('tutorial', 'Tutorial'),
        ('project', 'Project'),
        ('article', 'Article'),
        ('video', 'Video'),
        ('book', 'Book'),
        ('practice', 'Practice')
    ])
    provider = models.CharField(max_length=100)
    duration = models.CharField(max_length=50, blank=True)
    difficulty = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ])
    rating = models.FloatField(null=True, blank=True)
    is_premium = models.BooleanField(default=False)
    points = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# Gamification Models
class UserProfile(models.Model):
    user_id = models.CharField(max_length=100, unique=True)  # Can be session ID or user ID
    domain = models.CharField(max_length=100)
    total_points = models.IntegerField(default=0)
    current_level = models.IntegerField(default=1)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_activity_date = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"User {self.user_id} - Level {self.current_level}"


class RoadmapStage(models.Model):
    stage_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    domain = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ])
    estimated_time = models.CharField(max_length=50)
    points = models.IntegerField(default=100)
    order = models.IntegerField()
    prerequisites = models.JSONField(default=list, blank=True)  # List of stage IDs
    skills = models.JSONField(default=list, blank=True)  # List of skill names
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['domain', 'order']

    def __str__(self):
        return f"{self.domain} - {self.title}"


class UserStageProgress(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    stage = models.ForeignKey(RoadmapStage, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)  # 0-100
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user_profile', 'stage']

    def __str__(self):
        return f"{self.user_profile.user_id} - {self.stage.title} ({self.progress}%)"


class Badge(models.Model):
    badge_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50)  # Emoji or icon name
    category = models.CharField(max_length=50, choices=[
        ('skill', 'Skill'),
        ('progress', 'Progress'),
        ('streak', 'Streak'),
        ('achievement', 'Achievement'),
        ('milestone', 'Milestone')
    ])
    rarity = models.CharField(max_length=20, choices=[
        ('common', 'Common'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary')
    ])
    points = models.IntegerField(default=0)
    requirements = models.JSONField(default=dict)  # Badge requirements
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class UserBadge(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user_profile', 'badge']

    def __str__(self):
        return f"{self.user_profile.user_id} - {self.badge.name}"


class Achievement(models.Model):
    achievement_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50)
    achievement_type = models.CharField(max_length=50, choices=[
        ('milestone', 'Milestone'),
        ('challenge', 'Challenge'),
        ('skill', 'Skill'),
        ('consistency', 'Consistency')
    ])
    points = models.IntegerField(default=0)
    target = models.IntegerField()  # Target value to complete achievement
    requirements = models.JSONField(default=list)  # List of requirements
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    current_progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user_profile', 'achievement']

    def __str__(self):
        return f"{self.user_profile.user_id} - {self.achievement.name}"


class DailyChallenge(models.Model):
    challenge_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    challenge_type = models.CharField(max_length=50, choices=[
        ('skill_practice', 'Skill Practice'),
        ('learning', 'Learning'),
        ('project', 'Project'),
        ('assessment', 'Assessment')
    ])
    difficulty = models.CharField(max_length=20, choices=[
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard')
    ])
    points = models.IntegerField(default=25)
    time_estimate = models.CharField(max_length=50)
    category = models.CharField(max_length=100)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class UserChallengeProgress(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    challenge = models.ForeignKey(DailyChallenge, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user_profile', 'challenge']

    def __str__(self):
        return f"{self.user_profile.user_id} - {self.challenge.title}"


class WeeklyQuest(models.Model):
    quest_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    objectives = models.JSONField(default=list)  # List of objectives with IDs and descriptions
    total_points = models.IntegerField(default=0)
    reward_points = models.IntegerField(default=0)
    reward_badge = models.ForeignKey(Badge, on_delete=models.SET_NULL, null=True, blank=True)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class UserQuestProgress(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    quest = models.ForeignKey(WeeklyQuest, on_delete=models.CASCADE)
    objectives_completed = models.JSONField(default=list)  # List of completed objective IDs
    progress = models.IntegerField(default=0)  # 0-100
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user_profile', 'quest']

    def __str__(self):
        return f"{self.user_profile.user_id} - {self.quest.title}"


class SkillMastery(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    skill_name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert')
    ], default='beginner')
    progress = models.IntegerField(default=0)  # 0-100
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user_profile', 'skill_name']

    def __str__(self):
        return f"{self.user_profile.user_id} - {self.skill_name} ({self.level})"


class ActivityLog(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50, choices=[
        ('stage_completed', 'Stage Completed'),
        ('stage_progress', 'Stage Progress'),
        ('skill_practiced', 'Skill Practiced'),
        ('resource_completed', 'Resource Completed'),
        ('daily_activity', 'Daily Activity'),
        ('challenge_completed', 'Challenge Completed'),
        ('badge_earned', 'Badge Earned'),
        ('achievement_unlocked', 'Achievement Unlocked')
    ])
    points_earned = models.IntegerField(default=0)
    metadata = models.JSONField(default=dict, blank=True)  # Additional activity data
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user_profile.user_id} - {self.activity_type}"
    title = models.CharField(max_length=255)
    description = models.TextField()
    url = models.URLField()
    resource_type = models.CharField(max_length=50)  # e.g., "Course", "Video", "Book"
    is_free = models.BooleanField(default=True)
    provider = models.CharField(max_length=100, null=True, blank=True)  # e.g., "Coursera", "YouTube", "Udemy"
    
    def __str__(self):
        return self.title

class UserSkillGapAnalysis(models.Model):
    # No direct user relation since we're not using Django auth system in this project
    session_id = models.CharField(max_length=100)  # Store session ID to associate with a session
    job_role = models.CharField(max_length=100)
    current_skills = models.TextField()  # Store as JSON
    required_skills = models.TextField()  # Store as JSON
    skill_gaps = models.TextField()  # Store as JSON
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Analysis for {self.job_role} - {self.created_at}"