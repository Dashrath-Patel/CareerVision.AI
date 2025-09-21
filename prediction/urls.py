from django.urls import path
from . import views
from . import gamification_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Main app URLs
    path('', views.home, name='home'),
    path('prediction/', views.prediction, name='prediction'),
    path('quiz/', views.quiz_view, name='quiz'),
    path('submit/', views.submit_quiz, name='submit_quiz'),
    path('roadmap/', views.roadmap, name='roadmap'),
    path('job/', views.job_view, name='job'),  # New URL pattern for job page
    
    # Gamification API URLs
    path('api/gamification/profile/<str:user_id>/', gamification_views.user_profile, name='api_user_profile'),
    path('api/gamification/roadmap/<str:domain>/stages/', gamification_views.roadmap_stages, name='api_roadmap_stages'),
    path('api/gamification/progress/<str:user_id>/', gamification_views.user_progress, name='api_user_progress'),
    path('api/gamification/progress/<str:user_id>/update/', gamification_views.update_progress, name='api_update_progress'),
    path('api/gamification/challenges/<str:user_id>/', gamification_views.daily_challenges, name='api_daily_challenges'),
    path('api/gamification/challenges/<str:user_id>/<int:challenge_id>/complete/', gamification_views.complete_challenge, name='api_complete_challenge'),
    path('api/gamification/quest/<str:user_id>/', gamification_views.weekly_quest, name='api_weekly_quest'),
    path('api/gamification/badges/<str:user_id>/', gamification_views.user_badges, name='api_user_badges'),
    path('api/gamification/leaderboard/', gamification_views.leaderboard, name='api_leaderboard'),
    path('api/gamification/leaderboard/<str:domain>/', gamification_views.leaderboard, name='api_domain_leaderboard'),
    path('api/gamification/stats/<str:user_id>/', gamification_views.progress_stats, name='api_progress_stats'),
]

# This is to serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)